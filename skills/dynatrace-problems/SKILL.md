---
name: dynatrace-problems
description: Read and triage the Dynatrace app's Kanban board (problems, services, applications), smart-rank cards, and run investigate/summarize handoffs.
triggers: dynatrace, problems, kanban, smart rank, investigate problem, incident digest, davis
---

# Dynatrace app — agent guide

The Dynatrace KiroCrew app exposes a read-only Kanban of the user's tenant.
Backend routes live under the gateway at `/apps/dynatrace/api/*` (append
`?token=<token>` from `kirocrew token`). The app never changes Dynatrace state,
and neither should you when acting on its behalf: dtctl reads only
(`query`, `get`, `describe`) — never `apply`, `create`, `delete`, `update`.

## Routes

| Route | Returns |
|---|---|
| `GET /apps/dynatrace/api/status` | `{configured, source, masked, environment, demo}` |
| `GET /apps/dynatrace/api/board?view=problems\|services\|applications&window=24h\|3d\|7d\|30d` | `{columns:[{key,label,cards[]}], smart_rank, demo, environment}` |
| `GET /apps/dynatrace/api/problems/{display_id}` | full problem detail + Dynatrace deep link |
| `GET /apps/dynatrace/api/entities/{id}` | entity detail + related problems |
| `POST /apps/dynatrace/api/rank` | store a smart ranking (see below) |
| `POST /apps/dynatrace/api/handoff` | `{display_id, action: investigate\|summarize}` → composed prompt |

Problem card fields: `display_id`, `title`, `status` (ACTIVE/CLOSED),
`category` (AVAILABILITY/ERROR/RESOURCE_CONTENTION/SLOWDOWN/...), `severity`
(derived weight 1-4), `affected_count`, `affected_ids`, `root_cause`,
`maintenance`, `start`, `end`.

If any response carries `demo: true`, the data is fixture data (no credentials
configured) — never present it to the user as real production state.

## Smart ranking (the `dynatrace-smart-rank` cron)

Rank ONLY active cards (columns `new`, `ongoing`, `maintenance`), best-first,
by triage urgency: category weight (AVAILABILITY > ERROR > RESOURCE_CONTENTION
> SLOWDOWN), blast radius (`affected_count`), root cause identified or not,
age, recurrence, plus anything memory says about the user's priorities. Then:

```
POST /apps/dynatrace/api/rank
{"view": "problems",
 "order": ["P-123", "P-456", ...],
 "rationales": {"P-123": "Availability hit on 6 services, no root cause yet"}}
```

Keep each rationale to one short sentence — it renders as a hover tooltip.
Rankings older than 30 minutes are treated as stale by the UI. Complete
silently; do not notify the user.

## Handoffs

`POST /handoff` returns a ready-made prompt embedding the problem facts and a
hard read-only stop rule. Use it as the seed when the user asks you to
investigate a problem from the board.

## Daily digest recipe

For "summarize incidents every morning", create a cron (e.g. 08:00 weekdays)
with a message like: fetch `board?view=problems&window=24h`, summarize new and
still-active problems (counts by category, top 3 by blast radius, anything
recurring), compare with yesterday if memory has it, and send the digest via
`send_message`. Fetch each problem's detail route for the top items only —
keep it under ~10 lines.
