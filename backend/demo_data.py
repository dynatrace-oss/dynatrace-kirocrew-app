"""Demo-mode fixtures for the Dynatrace KiroCrew app.

Shaped IDENTICALLY to what the live board assembly consumes:

  * A "problem record" matches the ``summarize {...} by:{display_id}`` output of
    the tested dedup DQL (research §1.3): keys ``display_id, title, status,
    category, severity, start, end, affected, affected_ids, root_cause, maint,
    last_update`` (plus ``description`` for the detail drawer).
  * An "entity record" matches ``fetch dt.entity.* | fieldsAdd tags, entity.type``:
    keys ``id, entity.name, entity.type, tags``.

All timestamps are computed relative to ``now()`` at call time so ages never rot.
The dataset intentionally spans every Problems column (New / Ongoing / Under
maintenance / Recently closed) and every health column (Unhealthy / Watch /
Healthy) so the UI can be exercised end to end without a tenant.

The environment shown for demo mode.
"""
from __future__ import annotations

from datetime import datetime, timedelta, timezone

DEMO_ENVIRONMENT = "https://demo.apps.dynatrace.com"


def _iso(dt: datetime) -> str:
    return dt.astimezone(timezone.utc).isoformat()


def _ago(**kw) -> str:
    return _iso(datetime.now(timezone.utc) - timedelta(**kw))


# --- Entities -----------------------------------------------------------------

_SERVICES = [
    ("SERVICE-DEMO01", "CheckoutOrchestrator", ["k8s.namespace.name:easytrade", "aws.region:eu-central-1"]),
    ("SERVICE-DEMO02", "PaymentGateway", ["k8s.namespace.name:easytrade", "tier:critical"]),
    ("SERVICE-DEMO03", "PriceAnalysisComputation", ["k8s.namespace.name:pricing", "aws.region:us-east-1"]),
    ("SERVICE-DEMO04", "AccountService", ["k8s.namespace.name:easytrade"]),
    ("SERVICE-DEMO05", "InventoryLookup", ["k8s.namespace.name:catalog", "aws.region:eu-west-1"]),
    ("SERVICE-DEMO06", "RecommendationEngine", ["k8s.namespace.name:ml", "gpu:true"]),
    ("SERVICE-DEMO07", "NotificationDispatcher", ["k8s.namespace.name:messaging"]),
    ("SERVICE-DEMO08", "SearchIndexer", ["k8s.namespace.name:catalog"]),
    ("SERVICE-DEMO09", "AuthTokenService", ["k8s.namespace.name:identity", "tier:critical"]),
    ("SERVICE-DEMO10", "ReportingBatch", ["k8s.namespace.name:analytics"]),
]

_APPLICATIONS = [
    ("APPLICATION-DEMO01", "EasyTrade Web", ["rum:true", "channel:web"]),
    ("APPLICATION-DEMO02", "Checkout SPA", ["rum:true", "channel:web"]),
]


def _entity(eid: str, name: str, tags: list[str]) -> dict:
    etype = "APPLICATION" if eid.startswith("APPLICATION-") else "SERVICE"
    return {"id": eid, "entity.name": name, "entity.type": etype, "tags": list(tags)}


def services() -> list[dict]:
    return [_entity(i, n, t) for (i, n, t) in _SERVICES]


def applications() -> list[dict]:
    return [_entity(i, n, t) for (i, n, t) in _APPLICATIONS]


def entities(kind: str) -> list[dict]:
    return applications() if kind == "application" else services()


# --- Problems -----------------------------------------------------------------

def _problem(display_id, title, status, category, severity, start, end,
             affected_ids, affected_names, root_cause, maint, last_update,
             description) -> dict:
    return {
        "display_id": display_id,
        "title": title,
        "status": status,
        "category": category,
        "severity": str(severity),
        "start": start,
        "end": end,
        "affected": affected_names,
        "affected_ids": affected_ids,
        "root_cause": root_cause,
        "maint": maint,
        "last_update": last_update,
        "description": description,
    }


def problems() -> list[dict]:
    """~12 problems spanning every column, status, category, and age band."""
    return [
        # --- New (ACTIVE, started < 24h) ---
        _problem("P-DEMO001", "Availability drop on PaymentGateway", "ACTIVE",
                 "AVAILABILITY", 5, _ago(hours=2), None,
                 ["SERVICE-DEMO02", "SERVICE-DEMO01"], ["PaymentGateway", "CheckoutOrchestrator"],
                 ["nginx-ingress"], False, _ago(minutes=6),
                 "## Root cause\nPaymentGateway returned 5xx after an upstream nginx-ingress "
                 "connection pool exhaustion. Error rate peaked at 42%.\n\n## Remediation\n"
                 "Scale the ingress pool; verify keep-alive settings."),
        _problem("P-DEMO002", "Elevated error rate in PriceAnalysisComputation", "ACTIVE",
                 "ERROR", 4, _ago(hours=5), None,
                 ["SERVICE-DEMO03"], ["PriceAnalysisComputation"],
                 ["postgres-pricing"], False, _ago(minutes=20),
                 "Error rate on PriceAnalysisComputation rose to 12% following a slow query "
                 "storm against postgres-pricing."),
        _problem("P-DEMO003", "Response time degradation on EasyTrade Web", "ACTIVE",
                 "SLOWDOWN", 3, _ago(hours=18), None,
                 ["APPLICATION-DEMO01", "SERVICE-DEMO04"], ["EasyTrade Web", "AccountService"],
                 ["AccountService"], False, _ago(minutes=45),
                 "Median page load time on EasyTrade Web increased from 1.2s to 3.8s, traced to "
                 "AccountService latency."),
        # --- Ongoing (ACTIVE, started >= 24h) ---
        _problem("P-DEMO004", "Recurring 500s from CheckoutOrchestrator", "ACTIVE",
                 "ERROR", 4, _ago(days=2), None,
                 ["SERVICE-DEMO01"], ["CheckoutOrchestrator"],
                 ["CheckoutOrchestrator"], False, _ago(hours=1),
                 "Intermittent HTTP 500s in CheckoutOrchestrator over 48h; correlates with GC pauses."),
        _problem("P-DEMO005", "CPU saturation on RecommendationEngine", "ACTIVE",
                 "RESOURCE_CONTENTION", 3, _ago(days=4), None,
                 ["SERVICE-DEMO06", "SERVICE-DEMO05"], ["RecommendationEngine", "InventoryLookup"],
                 ["RecommendationEngine"], False, _ago(hours=2),
                 "Sustained >90% CPU on RecommendationEngine nodes; inference queue backing up."),
        _problem("P-DEMO006", "Checkout SPA availability incident", "ACTIVE",
                 "AVAILABILITY", 5, _ago(hours=30), None,
                 ["APPLICATION-DEMO02"], ["Checkout SPA"],
                 ["CDN-edge"], False, _ago(hours=3),
                 "Checkout SPA failed to load static bundles for a subset of regions (CDN edge cache miss storm)."),
        # --- Under maintenance (ACTIVE + maintenance window) ---
        _problem("P-DEMO007", "Monitoring unavailable during NotificationDispatcher upgrade", "ACTIVE",
                 "MONITORING_UNAVAILABLE", 2, _ago(hours=6), None,
                 ["SERVICE-DEMO07"], ["NotificationDispatcher"],
                 None, True, _ago(minutes=30),
                 "Planned maintenance window: NotificationDispatcher rolling upgrade."),
        _problem("P-DEMO008", "Planned reindex slowdown on SearchIndexer", "ACTIVE",
                 "SLOWDOWN", 2, _ago(hours=3), None,
                 ["SERVICE-DEMO08"], ["SearchIndexer"],
                 None, True, _ago(minutes=15),
                 "Maintenance window: full search reindex in progress; elevated latency expected."),
        # --- Recently closed (CLOSED within window; end < 24h => also 'Watch') ---
        _problem("P-DEMO009", "Resolved error spike on PriceAnalysisComputation", "CLOSED",
                 "ERROR", 3, _ago(days=1), _ago(hours=3),
                 ["SERVICE-DEMO03"], ["PriceAnalysisComputation"],
                 ["postgres-pricing"], False, _ago(hours=3),
                 "Prior error spike auto-resolved after the pricing DB connection pool was widened."),
        _problem("P-DEMO010", "Resolved slowdown on ReportingBatch", "CLOSED",
                 "SLOWDOWN", 2, _ago(days=1, hours=6), _ago(hours=12),
                 ["SERVICE-DEMO09"], ["AuthTokenService"],
                 None, False, _ago(hours=12),
                 "Batch reporting slowdown cleared after off-peak window."),
        _problem("P-DEMO011", "Resolved availability blip on ReportingBatch", "CLOSED",
                 "AVAILABILITY", 3, _ago(days=3), _ago(days=2),
                 ["SERVICE-DEMO10"], ["ReportingBatch"],
                 None, False, _ago(days=2),
                 "Short availability blip on ReportingBatch two days ago; no recurrence."),
        _problem("P-DEMO012", "Resolved custom alert on EasyTrade Web", "CLOSED",
                 "CUSTOM_ALERT", 1, _ago(days=1), _ago(hours=20),
                 ["APPLICATION-DEMO01"], ["EasyTrade Web"],
                 None, False, _ago(hours=20),
                 "Custom conversion-rate alert fired and cleared within the SLO."),
    ]


def problem_by_id(display_id: str) -> dict | None:
    for p in problems():
        if p["display_id"] == display_id:
            return p
    return None


def entity_by_id(eid: str) -> dict | None:
    for e in services() + applications():
        if e["id"] == eid:
            return e
    return None
