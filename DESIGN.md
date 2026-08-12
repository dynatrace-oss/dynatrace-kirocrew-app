# Dynatrace KiroCrew App — Design

A Kanban control tower for Dynatrace: triage **Problems** (default view), and see
health-grouped **Services** and **Applications**, powered by `dtctl` against the
user's tenant. Read-only: the app never closes problems or changes any Dynatrace
state. Anything that acts links out to Dynatrace or hands off to a KiroCrew agent.

## Views (Kanban)

Segmented switcher in the header: **Problems | Services | Applications**.

### Problems (default)

| Column | Definition |
|---|---|
| New | `event.status == ACTIVE` and started < 24h ago |
| Ongoing | `event.status == ACTIVE` and started ≥ 24h ago |
| Under maintenance | ACTIVE and `maintenance.is_under_maintenance == true` |
| Recently closed | `event.status == CLOSED`, ended within the lookback window |

Lookback window selector: 24h / 3d / 7d (default) / 30d — bounds the DQL
(`from:now()-Nd`) and the "Recently closed" column.

Card: `display_id`, `event.name`, category chip (ERROR red / AVAILABILITY red /
SLOWDOWN amber / RESOURCE_CONTENTION purple / other gray), affected-entity count,
root-cause entity name (when present), age/duration, smart-rank position badge
with one-line rationale on hover (when smart ranking is fresh).

### Services / Applications

| Column | Definition |
|---|---|
| Unhealthy | ≥ 1 ACTIVE problem references the entity in `affected_entity_ids` |
| Watch | no active problem, but a problem CLOSED within last 24h referenced it |
| Healthy | everything else |

Card: entity name, tags (first 3 + overflow count), active/recent problem count,
entity id (muted).

### Detail drawer

Clicking a card opens a right-side drawer (board stays visible):
- Problems: full title, status, category, start/end, duration, root cause,
  affected entities list, maintenance flag, deep link to the Dynatrace Problems
  app (`{envUrl}/ui/apps/dynatrace.davis.problems/problem/{event.id}`), and
  **agent handoff** actions: *Investigate*, *Summarize for standup*.
- Entities: name, type, tags, related problems (active + recent), deep link to
  the entity in Dynatrace.

## Sorting

Sort selector, per column, applies within every column:

1. **Smart (default)** — agentic ranking (below). When no fresh ranking exists,
   the UI shows "Smart (warming up)" and falls back to Severity.
2. Severity — category weight (AVAILABILITY=4, ERROR=3, RESOURCE_CONTENTION=2,
   SLOWDOWN=1), then affected-entity count desc, then newest.
3. Newest — `event.start` desc.
4. Most affected — affected-entity count desc.
5. Longest running — duration desc.

Deterministic sorts are computed client-side from card data.

### Smart (agentic) ranking — architecture

App backend subprocesses have no LLM bridge (env: PORT, KIROCREW_APP_NAME,
KIROCREW_HOME, KIROCREW_PROXY_SECRET only). The ranking therefore runs as a
**KiroCrew agent via the app cron**:

1. `app.json` cron `dynatrace-smart-rank` (every 15 min) sends the agent a
   message: fetch `GET /apps/dynatrace/api/board?view=problems`, rank the ACTIVE
   problem cards using its knowledge (blast radius, category, user context,
   memory/preferences), then `POST /apps/dynatrace/api/rank` with
   `{view, order: [display_id...], rationales: {display_id: one-liner}}`.
2. Backend stores the ranking in `<data_dir>/rank-problems.json` with a
   timestamp; `GET /board` includes `smart_rank: {fresh: bool, ranked_at,
   order, rationales}` (fresh = < 30 min old and card set overlaps ≥ 50%).
3. UI orders by `order` (unranked cards appended by severity), shows rationale
   on hover, and a "ranked N min ago by agent" caption.
4. Failure mode: no ranking file / stale → deterministic Severity order,
   caption "Smart ranking pending".

`POST /rank` is only accepted from the gateway proxy (HMAC-verified), same as
every other route.

## Backend

Python 3 + aiohttp, single `backend/server.py` plus small
modules. All routes under `/apps/dynatrace/api/`. Every handler wrapped by one
decorator producing `{"error": {code, message, hint}}` envelopes; no bare 500s.
Verify `X-KiroCrew-Proxy` HMAC with `KIROCREW_PROXY_SECRET` on every request.

### dtctl integration

- Shell out to `dtctl` (found via PATH, `DTCTL_BIN` override) with
  `-o json --plain`, per-call timeout 20s.
- One DQL query per column-set, deduped:
  `fetch dt.davis.problems, from:now()-{N}d | sort timestamp asc | summarize
  {field=takeLast(field)...}, by:{display_id}` (tested; see
  docs/research-dtctl.md).
- Entities: `fetch dt.entity.service` / `dt.entity.application` (only fields
  id, entity.name, entity.type, tags exist).
- Health correlation: expand `affected_entity_ids` of active/recent problems,
  map onto entity cards server-side.
- Cache every dtctl result 60s in memory (a call costs ~1.4s); `?refresh=1`
  busts the cache. UI polls every 60s, paused while drawer write actions run.

### Credential resolution (order)

1. `DT_ACCESS_TOKEN` env var (+ `DT_ENVIRONMENT_URL`) → passed to dtctl via
   `dtctl config set-credentials`-style ephemeral context or direct flags.
2. Existing dtctl context (OS keyring OAuth or config tokens) — the normal dev
   path; `dtctl auth whoami` probes it at startup.
3. Token pasted in the Settings overlay → stored `0600` +`O_NOFOLLOW` under the
   app data dir, never logged, never echoed (only `configured/source/last4`).

If nothing resolves → **demo mode**: fixtures shaped identically to live
payloads, every response labelled `"demo": true`, amber banner in the UI.

### Routes

| Route | Purpose |
|---|---|
| `GET /health` | liveness (no auth) |
| `GET /apps/dynatrace/api/status` | credential state: `{configured, source, masked, environment, demo}` |
| `GET /apps/dynatrace/api/board?view=problems\|services\|applications&window=7d` | column-bucketed cards + `smart_rank` block + `demo` flag |
| `GET /apps/dynatrace/api/problems/{display_id}` | full problem detail |
| `GET /apps/dynatrace/api/entities/{id}` | entity detail + related problems |
| `POST /apps/dynatrace/api/rank` | agent posts smart ranking (see above) |
| `POST /apps/dynatrace/api/settings/token` | save pasted token (validated live before write; 400 bad token vs 502 unreachable) |
| `DELETE /apps/dynatrace/api/settings/token` | remove pasted token |
| `POST /apps/dynatrace/api/handoff` | compose agent prompt for investigate/summarize on a problem |

## UI

Scaffold stack: React + TSX + Vite, `@kirocrew/app-sdk` (`useAppApi()`,
`Card`, `PageHeader`, ...). Theme CSS vars only — zero hardcoded hex.

Layout: `PageHeader` (title, env link, demo badge) → toolbar (view switcher,
sort select, window select, search box, refresh, settings gear) → Kanban of
3-4 columns (`overflow-x-auto`, each column `min-w-[280px]`, own scroll) →
detail drawer (absolute right overlay, closes on ESC/outside click).

Empty states per DESIGN taxonomy: no-credentials (points at Settings),
no-data-in-window (suggests widening the window), filtered-out (clear search).

## Skill + cron

- `skills/dynatrace-problems/SKILL.md`: how an agent should read the board API,
  the handoff prompts, and a daily-digest recipe ("summarize last 24h problems
  and open investigations every morning").
- Crons in app.json: `dynatrace-smart-rank` (15 min) and a sample (disabled by
  default in docs) morning digest.

## Non-goals (v0)

- No writes to Dynatrace (no problem close/comment).
- No per-user auth: single-user app, one tenant context.
- No websocket push; 60s polling.

## Alternatives considered

- **Kanban lanes by severity** instead of lifecycle — rejected: lifecycle
  (new/ongoing/maintenance/closed) matches triage flow and the original
  "investigations dashboard" idea; severity is a sort, not a lane.
- **In-process backend hooks** (LD style) for direct chat seeding — rejected:
  the scaffold's managed-subprocess backend is the current supported shape.
- **kiro-cli subprocess per rank call** — rejected: heavyweight (full agent
  spin-up per request) on a memory-tight host; cron agent amortizes it.
