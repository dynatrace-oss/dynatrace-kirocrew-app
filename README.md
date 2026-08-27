# Dynatrace — KiroCrew app

A Kanban control tower for Dynatrace. Triage **problems** (default view) across
lifecycle lanes — New, Ongoing, Under maintenance, Recently closed — and see
**services** and **applications** grouped by health (Unhealthy, Watch, Healthy),
derived by correlating active problems with affected entities.

The app is **read-only**: it never closes problems or changes any Dynatrace
state. Anything that acts links out to Dynatrace or hands a composed prompt to
a KiroCrew agent.

## Smart ranking

The default sort is **Smart**: a KiroCrew agent (the `dynatrace-smart-rank`
cron, every 15 minutes) ranks the active problem cards by triage urgency using
category weight, blast radius, root-cause presence, age, recurrence, and what
it knows about your environment from memory. Each card shows its rank and a
one-line rationale on hover. Deterministic sorts (Severity, Newest, Most
affected, Longest running) are always available; when no fresh ranking exists
the UI falls back to Severity and shows "Smart ranking pending".

## Requirements

- [dtctl](https://github.com/dynatrace-oss/dtctl) on PATH (or `DTCTL_BIN`).
- Credentials, resolved in this order:
  1. `DT_ACCESS_TOKEN` (+ `DT_ENVIRONMENT_URL`) environment variables
  2. An existing dtctl context (`dtctl auth login` — OAuth in the OS keyring)
  3. A token pasted in the app's **Settings** overlay, stored owner-only
     (`0600`) under the app data directory; never logged or echoed back
     (status shows only source + last 4 characters)

If nothing resolves, the app runs on a built-in **demo dataset** — every
response is labelled `demo: true` and the UI shows an amber banner.

## Install

```
cd ui && npm install && npm run build && cd ..
kirocrew app install "$PWD"
kirocrew app enable dynatrace
kirocrew restart
```

For UI hot-reload while developing: `kirocrew app dev dynatrace`.

## Layout

Header (environment link, demo badge) → toolbar (view switcher, sort, time
window, search, refresh, settings) → Kanban columns → detail drawer with the
full problem record, a deep link into the Dynatrace Problems app, and agent
handoff actions (*Investigate*, *Summarize for standup*).

## Docs

- `DESIGN.md` — the design contract (views, sorting, routes, architecture)
- `skills/dynatrace-problems/` — agent guide (board API, ranking, digest recipe)
