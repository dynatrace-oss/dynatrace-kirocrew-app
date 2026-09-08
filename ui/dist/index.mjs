import { jsx as n, jsxs as a, Fragment as W } from "react/jsx-runtime";
import { useState as x, useMemo as G, useEffect as P, useCallback as U, useRef as be } from "react";
import { useChatLauncher as _e } from "@kirocrew/app-sdk";
const t = {
  bg: "var(--bg)",
  bgElevated: "var(--bg-elevated)",
  panel: "var(--panel)",
  card: "var(--card)",
  cardFg: "var(--card-fg)",
  text: "var(--text)",
  textStrong: "var(--text-strong)",
  muted: "var(--muted)",
  mutedStrong: "var(--muted-strong)",
  border: "var(--border)",
  accent: "var(--accent)",
  accentFg: "var(--accent-fg)",
  accentSubtle: "var(--accent-subtle)",
  ok: "var(--ok)",
  okFg: "var(--ok-fg)",
  okSubtle: "var(--ok-subtle)",
  warn: "var(--warn)",
  warnSubtle: "var(--warn-subtle)",
  danger: "var(--danger)",
  dangerSubtle: "var(--danger-subtle)",
  radiusSm: "var(--radius-sm, 6px)",
  radiusMd: "var(--radius-md, 8px)",
  radiusLg: "var(--radius-lg, 12px)",
  shadowSm: "var(--shadow-sm)",
  shadowMd: "var(--shadow-md)",
  shadowLg: "var(--shadow-lg)",
  font: "var(--font-body, inherit)",
  mono: "var(--mono, ui-monospace, SFMono-Regular, Menlo, monospace)"
}, Ee = "rgba(0,0,0,.45)";
function Oe(e) {
  switch (e) {
    case "danger":
      return { fg: t.danger, bg: t.dangerSubtle };
    case "warn":
      return { fg: t.warn, bg: t.warnSubtle };
    case "accent":
      return { fg: t.accent, bg: t.accentSubtle };
    case "ok":
      return { fg: t.ok, bg: t.okSubtle };
    default:
      return { fg: t.muted, bg: t.bgElevated };
  }
}
function $e({
  content: e,
  children: r,
  maxWidth: o = 260
}) {
  const [i, l] = x(!1);
  return /* @__PURE__ */ a(
    "span",
    {
      style: { position: "relative", display: "inline-flex", alignItems: "center" },
      onMouseEnter: () => l(!0),
      onMouseLeave: () => l(!1),
      onFocus: () => l(!0),
      onBlur: () => l(!1),
      children: [
        r,
        i && /* @__PURE__ */ n(
          "span",
          {
            role: "tooltip",
            style: {
              position: "absolute",
              top: "100%",
              left: "50%",
              transform: "translateX(-50%)",
              marginTop: 6,
              zIndex: 50,
              maxWidth: o,
              width: "max-content",
              padding: "7px 9px",
              fontSize: 11.5,
              fontWeight: 400,
              lineHeight: 1.4,
              letterSpacing: 0,
              textTransform: "none",
              textAlign: "left",
              color: t.text,
              background: t.card,
              border: `1px solid ${t.border}`,
              borderRadius: t.radiusMd,
              boxShadow: t.shadowMd,
              whiteSpace: "normal",
              pointerEvents: "none"
            },
            children: e
          }
        )
      ]
    }
  );
}
function le({ tip: e, maxWidth: r }) {
  return /* @__PURE__ */ n($e, { content: e, maxWidth: r, children: /* @__PURE__ */ n(
    "span",
    {
      tabIndex: 0,
      "aria-label": "More information",
      style: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 14,
        height: 14,
        fontSize: 9.5,
        fontWeight: 700,
        fontStyle: "italic",
        fontFamily: t.font,
        lineHeight: 1,
        borderRadius: 9999,
        border: `1px solid ${t.border}`,
        background: t.bgElevated,
        color: t.muted,
        cursor: "help",
        userSelect: "none"
      },
      children: "i"
    }
  ) });
}
function T({
  children: e,
  onClick: r,
  variant: o = "default",
  size: i = "md",
  disabled: l,
  title: s,
  active: c,
  type: h = "button",
  style: p
}) {
  const f = {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: i === "sm" ? "4px 8px" : "6px 12px",
    fontSize: i === "sm" ? 12 : 13,
    fontWeight: 500,
    lineHeight: 1.2,
    borderRadius: t.radiusMd,
    border: `1px solid ${t.border}`,
    background: t.bgElevated,
    color: t.text,
    cursor: l ? "not-allowed" : "pointer",
    opacity: l ? 0.55 : 1,
    whiteSpace: "nowrap",
    transition: "background 120ms ease, border-color 120ms ease"
  };
  return o === "primary" ? (f.background = t.accent, f.color = t.accentFg, f.borderColor = t.accent) : o === "danger" ? (f.background = t.dangerSubtle, f.color = t.danger, f.borderColor = t.danger) : o === "ghost" && (f.background = "transparent", f.borderColor = "transparent", f.color = t.muted), c && (f.background = t.accentSubtle, f.color = t.accent, f.borderColor = t.accent), /* @__PURE__ */ n("button", { type: h, title: s, disabled: l, onClick: r, style: { ...f, ...p }, children: e });
}
function B({ tone: e, children: r }) {
  const { fg: o, bg: i } = Oe(e);
  return /* @__PURE__ */ n(
    "span",
    {
      style: {
        display: "inline-flex",
        alignItems: "center",
        padding: "2px 8px",
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: 0.2,
        borderRadius: 9999,
        background: i,
        color: o,
        textTransform: "uppercase",
        whiteSpace: "nowrap"
      },
      children: r
    }
  );
}
function J({ children: e }) {
  return /* @__PURE__ */ n(
    "span",
    {
      style: {
        display: "inline-flex",
        alignItems: "center",
        padding: "1px 7px",
        fontSize: 11,
        borderRadius: t.radiusSm,
        background: t.bgElevated,
        color: t.muted,
        border: `1px solid ${t.border}`,
        whiteSpace: "nowrap",
        maxWidth: 160,
        overflow: "hidden",
        textOverflow: "ellipsis"
      },
      children: e
    }
  );
}
function Ae({ n: e }) {
  return /* @__PURE__ */ n(
    "span",
    {
      style: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: 20,
        height: 20,
        padding: "0 6px",
        fontSize: 12,
        fontWeight: 600,
        borderRadius: 9999,
        background: t.bgElevated,
        color: t.muted,
        border: `1px solid ${t.border}`
      },
      children: e
    }
  );
}
function Be({ position: e, title: r }) {
  return /* @__PURE__ */ a(
    "span",
    {
      title: r,
      style: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: 20,
        height: 20,
        padding: "0 6px",
        fontSize: 11,
        fontWeight: 700,
        borderRadius: 9999,
        background: t.accentSubtle,
        color: t.accent,
        cursor: r ? "help" : "default"
      },
      children: [
        "#",
        e
      ]
    }
  );
}
function ve({
  value: e,
  onChange: r,
  options: o,
  title: i,
  ariaLabel: l
}) {
  return /* @__PURE__ */ n(
    "select",
    {
      value: e,
      title: i,
      "aria-label": l,
      onChange: (s) => r(s.target.value),
      style: {
        appearance: "auto",
        padding: "6px 10px",
        fontSize: 13,
        borderRadius: t.radiusMd,
        border: `1px solid ${t.border}`,
        background: t.bgElevated,
        color: t.text,
        cursor: "pointer"
      },
      children: o.map((s) => /* @__PURE__ */ n("option", { value: s.key, children: s.label }, s.key))
    }
  );
}
function Ne({
  value: e,
  onChange: r,
  options: o
}) {
  return /* @__PURE__ */ n(
    "div",
    {
      role: "tablist",
      style: {
        display: "inline-flex",
        padding: 2,
        gap: 2,
        borderRadius: t.radiusMd,
        border: `1px solid ${t.border}`,
        background: t.bgElevated
      },
      children: o.map((i) => {
        const l = i.key === e;
        return /* @__PURE__ */ n(
          "button",
          {
            role: "tab",
            "aria-selected": l,
            title: i.title,
            onClick: () => r(i.key),
            style: {
              padding: "5px 12px",
              fontSize: 13,
              fontWeight: 500,
              borderRadius: t.radiusSm,
              border: "none",
              cursor: "pointer",
              background: l ? t.accent : "transparent",
              color: l ? t.accentFg : t.muted
            },
            children: i.label
          },
          i.key
        );
      })
    }
  );
}
const He = {
  refresh: "M21 12a9 9 0 1 1-2.64-6.36M21 3v6h-6",
  settings: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z",
  search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM21 21l-4.35-4.35",
  close: "M18 6 6 18M6 6l12 12",
  external: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3",
  copy: "M20 9H11a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2ZM5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1",
  check: "M20 6 9 17l-5-5",
  warning: "M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0ZM12 9v4M12 17h.01",
  chevronRight: "m9 18 6-6-6-6",
  trash: "M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",
  spark: "M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8"
};
function R({
  name: e,
  size: r = 16,
  color: o,
  style: i
}) {
  return /* @__PURE__ */ n(
    "svg",
    {
      width: r,
      height: r,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: o || "currentColor",
      strokeWidth: 1.9,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      "aria-hidden": "true",
      style: { flexShrink: 0, ...i },
      children: /* @__PURE__ */ n("path", { d: He[e] })
    }
  );
}
function Ue(e) {
  if (!e) return "";
  try {
    return new URL(e).host;
  } catch {
    return e.replace(/^https?:\/\//, "").replace(/\/$/, "");
  }
}
function Fe({ environment: e, demo: r }) {
  const o = Ue(e);
  return /* @__PURE__ */ a("div", { style: { display: "flex", alignItems: "center", gap: 12, padding: "14px 16px 10px" }, children: [
    /* @__PURE__ */ n(
      "img",
      {
        src: "/apps/dynatrace/ui/dist/dynatrace.png",
        alt: "Dynatrace",
        width: 30,
        height: 30,
        style: { borderRadius: 6, flexShrink: 0 },
        onError: (i) => {
          i.currentTarget.style.display = "none";
        }
      }
    ),
    /* @__PURE__ */ a("div", { style: { display: "flex", flexDirection: "column", gap: 2 }, children: [
      /* @__PURE__ */ a("div", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
        /* @__PURE__ */ n("span", { style: { fontSize: 18, fontWeight: 700, color: t.textStrong }, children: "Dynatrace" }),
        r && /* @__PURE__ */ n(B, { tone: "warn", children: "Demo" })
      ] }),
      /* @__PURE__ */ n("div", { style: { fontSize: 12, color: t.muted, display: "flex", alignItems: "center", gap: 5 }, children: o ? /* @__PURE__ */ a(
        "a",
        {
          href: e,
          target: "_blank",
          rel: "noreferrer",
          style: { color: t.muted, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 },
          children: [
            o,
            /* @__PURE__ */ n(R, { name: "external", size: 11 })
          ]
        }
      ) : "Kanban control tower" })
    ] })
  ] });
}
const Pe = "/apps/dynatrace/api";
async function O(e, r) {
  const o = await fetch(Pe + e, {
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    ...r
  });
  if (!o.ok) {
    let i = "", l = `Request failed (${o.status})`, s = null;
    try {
      const h = await o.json();
      h && h.error && (i = h.error.code || "", l = h.error.message || l, s = h.error.hint ?? null);
    } catch {
    }
    const c = new Error(l);
    throw c.status = o.status, c.code = i, c.hint = s, c.apiError = !0, c;
  }
  return o.status === 204 ? null : await o.json();
}
const Ve = [
  { key: "problems", label: "Problems" },
  { key: "services", label: "Services" },
  { key: "applications", label: "Applications" }
], je = [
  { key: "smart", label: "Smart" },
  { key: "severity", label: "Severity" },
  { key: "newest", label: "Newest" },
  { key: "affected", label: "Most affected" },
  { key: "duration", label: "Longest running" }
], Ye = ["24h", "3d", "7d", "30d"], Ke = [
  { key: "new", label: "New", aliases: ["new"] },
  { key: "ongoing", label: "Ongoing", aliases: ["ongoing"] },
  {
    key: "maintenance",
    label: "Under maintenance",
    aliases: ["maintenance", "under_maintenance", "under-maintenance", "underMaintenance"]
  },
  {
    key: "closed",
    label: "Recently closed",
    aliases: ["closed", "recently_closed", "recently-closed", "recentlyClosed"]
  }
], Xe = [
  { key: "unhealthy", label: "Unhealthy", aliases: ["unhealthy"] },
  { key: "watch", label: "Watch", aliases: ["watch"] },
  { key: "healthy", label: "Healthy", aliases: ["healthy"] }
];
function Je(e) {
  return e === "problems" ? Ke : Xe;
}
function A(e) {
  return e === "problems";
}
function Ze(e, r) {
  return A(r) ? e.display_id : e.id;
}
const qe = {
  AVAILABILITY: 4,
  ERROR: 3,
  RESOURCE_CONTENTION: 2,
  SLOWDOWN: 1
};
function xe(e) {
  return qe[(e || "").toUpperCase()] ?? 0;
}
function Y(e) {
  var r, o;
  return e.affected_count ?? ((r = e.affected_ids) == null ? void 0 : r.length) ?? ((o = e.affected_names) == null ? void 0 : o.length) ?? 0;
}
function F(e) {
  return e.start && Date.parse(e.start) || 0;
}
function Z(e) {
  const r = F(e);
  if (!r) return 0;
  const o = e.end && Date.parse(e.end) || Date.now();
  return Math.max(0, o - r);
}
function ee(e) {
  const r = (e || "").toUpperCase();
  return r === "ERROR" || r === "AVAILABILITY" ? "danger" : r === "SLOWDOWN" ? "warn" : r === "RESOURCE_CONTENTION" ? "accent" : "muted";
}
function se(e) {
  const r = e.root_cause;
  return r ? Array.isArray(r) ? r.filter(Boolean).join(", ") : String(r) : "";
}
function Ge(e) {
  const r = [];
  if (Array.isArray(e.columns))
    for (const o of e.columns) Array.isArray(o.cards) && r.push(...o.cards);
  else if (e.columns && typeof e.columns == "object")
    for (const o of Object.values(e.columns)) Array.isArray(o) && r.push(...o);
  return Array.isArray(e.cards) && r.push(...e.cards), r;
}
function Qe(e) {
  if ((e.status || "").toUpperCase() === "CLOSED") return "closed";
  if (e.maintenance) return "maintenance";
  const o = F(e);
  return (o ? (Date.now() - o) / 36e5 : 0) < 24 ? "new" : "ongoing";
}
function et(e) {
  return (e.active_problems ?? 0) > 0 ? "unhealthy" : (e.recent_problems ?? 0) > 0 ? "watch" : "healthy";
}
function Le(e, r) {
  var p;
  const o = Je(r), i = /* @__PURE__ */ new Map();
  o.forEach((d) => i.set(d.key, []));
  const l = /* @__PURE__ */ new Map();
  o.forEach((d) => d.aliases.forEach((f) => l.set(f.toLowerCase(), d.key)));
  const s = /* @__PURE__ */ new Map(), c = (d, f, b, m) => {
    const u = l.get((d || "").toLowerCase());
    u && (i.get(u).push(...f), typeof b == "number" && s.set(u, { total: b, lower: m }));
  };
  let h = !1;
  if (e) {
    if (Array.isArray(e.columns))
      for (const d of e.columns)
        l.has((d.key || "").toLowerCase()) && (h = !0), c(d.key, Array.isArray(d.cards) ? d.cards : [], d.total, d.total_is_lower_bound);
    else if (e.columns && typeof e.columns == "object")
      for (const [d, f] of Object.entries(e.columns))
        l.has(d.toLowerCase()) && (h = !0), c(d, Array.isArray(f) ? f : []);
  }
  if (e && !h) {
    const d = Ge(e);
    for (const f of d) {
      const b = A(r) ? Qe(f) : et(f);
      (p = i.get(b)) == null || p.push(f);
    }
  }
  return o.map((d) => {
    var f, b;
    return {
      key: d.key,
      label: d.label,
      cards: i.get(d.key) || [],
      total: (f = s.get(d.key)) == null ? void 0 : f.total,
      totalIsLowerBound: (b = s.get(d.key)) == null ? void 0 : b.lower
    };
  });
}
function de(e) {
  return !!(e && e.fresh && Array.isArray(e.order) && e.order.length > 0);
}
function Se(e, r) {
  const o = xe(r.category) - xe(e.category);
  if (o !== 0) return o;
  const i = Y(r) - Y(e);
  return i !== 0 ? i : F(r) - F(e);
}
function tt(e, r, o) {
  const i = [...e];
  if (r === "smart" && de(o)) {
    const l = o.order, s = /* @__PURE__ */ new Map();
    l.forEach((p, d) => s.set(p, d));
    const c = i.filter((p) => s.has(p.display_id)).sort((p, d) => s.get(p.display_id) - s.get(d.display_id)), h = i.filter((p) => !s.has(p.display_id)).sort(Se);
    return [...c, ...h];
  }
  return r === "newest" ? i.sort((l, s) => F(s) - F(l)) : r === "affected" ? i.sort((l, s) => Y(s) - Y(l) || F(s) - F(l)) : r === "duration" ? i.sort((l, s) => Z(s) - Z(l)) : i.sort(Se);
}
function nt(e, r) {
  const o = [...e], i = (c) => c.active_problems ?? 0, l = (c) => c.recent_problems ?? 0, s = (c) => (c.name || c.id || "").toLowerCase();
  return r === "affected" || r === "severity" || r === "smart" ? o.sort((c, h) => i(h) - i(c) || l(h) - l(c) || s(c).localeCompare(s(h))) : o.sort((c, h) => s(c).localeCompare(s(h)));
}
function rt(e, r, o, i) {
  return A(r) ? tt(e, o, i) : nt(e, o);
}
function Re(e, r, o) {
  const i = o.trim().toLowerCase();
  if (!i) return !0;
  const l = [];
  if (A(r)) {
    const s = e;
    l.push(s.display_id, s.name || "", s.title || "", s.category || "", se(s)), s.affected_names && l.push(...s.affected_names);
  } else {
    const s = e;
    l.push(s.id, s.name || "", s.type || ""), s.tags && l.push(...s.tags);
  }
  return l.join("  ").toLowerCase().includes(i);
}
const ot = {
  problems: "Davis problems from your tenant",
  services: "Entities grouped by health, derived from active problems affecting them",
  applications: "Entities grouped by health, derived from active problems affecting them"
}, it = `Smart = a KiroCrew agent re-ranks active problems every 15 min by urgency (category, blast radius, root cause, age) and explains each position – hover a card's #N badge to see why. Falls back to Severity until the first ranking arrives ("warming up"). Other options are fixed sorts.`, at = "Time window for the problem history: bounds the query and the Recently closed column. Active problems always show.";
function lt({
  view: e,
  onView: r,
  sort: o,
  onSort: i,
  win: l,
  onWin: s,
  search: c,
  onSearch: h,
  onRefresh: p,
  onSettings: d,
  refreshing: f,
  smartFresh: b
}) {
  const m = je.map(
    (g) => g.key === "smart" && !b ? { key: g.key, label: "Smart (warming up)" } : g
  ), u = Ye.map((g) => ({ key: g, label: g })), k = Ve.map((g) => ({ ...g, title: ot[g.key] }));
  return /* @__PURE__ */ a(
    "div",
    {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        flexWrap: "wrap",
        padding: "0 16px 12px",
        borderBottom: `1px solid ${t.border}`
      },
      children: [
        /* @__PURE__ */ n(Ne, { value: e, onChange: r, options: k }),
        /* @__PURE__ */ n("span", { style: { flex: 1 } }),
        /* @__PURE__ */ a("span", { style: { display: "inline-flex", alignItems: "center", gap: 5 }, children: [
          /* @__PURE__ */ n(ve, { value: o, onChange: i, options: m, title: "Sort", ariaLabel: "Sort cards" }),
          /* @__PURE__ */ n(le, { tip: it })
        ] }),
        e === "problems" && /* @__PURE__ */ a("span", { style: { display: "inline-flex", alignItems: "center", gap: 5 }, children: [
          /* @__PURE__ */ n(ve, { value: l, onChange: s, options: u, title: "Lookback window", ariaLabel: "Lookback window" }),
          /* @__PURE__ */ n(le, { tip: at })
        ] }),
        /* @__PURE__ */ a("div", { style: { position: "relative", display: "inline-flex", alignItems: "center" }, children: [
          /* @__PURE__ */ n("span", { style: { position: "absolute", left: 8, display: "inline-flex", color: t.muted, pointerEvents: "none" }, children: /* @__PURE__ */ n(R, { name: "search", size: 14 }) }),
          /* @__PURE__ */ n(
            "input",
            {
              value: c,
              onChange: (g) => h(g.target.value),
              placeholder: "Search…",
              "aria-label": "Search cards",
              style: {
                padding: "6px 10px 6px 28px",
                fontSize: 13,
                width: 180,
                borderRadius: t.radiusMd,
                border: `1px solid ${t.border}`,
                background: t.bgElevated,
                color: t.text
              }
            }
          )
        ] }),
        /* @__PURE__ */ a(T, { onClick: p, disabled: f, title: "Refresh (bypass cache)", children: [
          /* @__PURE__ */ n(R, { name: "refresh", size: 14 }),
          "Refresh"
        ] }),
        /* @__PURE__ */ n(T, { variant: "ghost", onClick: d, title: "Settings", style: { padding: "6px 8px" }, children: /* @__PURE__ */ n(R, { name: "settings", size: 16 }) })
      ]
    }
  );
}
function st({ onLeaveDemo: e }) {
  return /* @__PURE__ */ a(
    "div",
    {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        background: t.warnSubtle,
        color: t.warn,
        padding: "8px 16px",
        fontSize: 12.5,
        borderBottom: `1px solid ${t.warn}`,
        flexShrink: 0
      },
      children: [
        /* @__PURE__ */ n(R, { name: "warning", size: 15 }),
        /* @__PURE__ */ n("span", { style: { flex: 1, fontWeight: 500 }, children: "Demo data. To connect to your own Dynatrace tenant, leave demo mode." }),
        /* @__PURE__ */ n(
          "button",
          {
            onClick: e,
            style: {
              padding: "4px 10px",
              fontSize: 12,
              fontWeight: 600,
              borderRadius: t.radiusMd,
              border: `1px solid ${t.warn}`,
              background: "transparent",
              color: t.warn,
              cursor: "pointer",
              whiteSpace: "nowrap"
            },
            children: "Leave demo mode"
          }
        )
      ]
    }
  );
}
function dt({
  label: e,
  count: r,
  total: o,
  totalIsLowerBound: i,
  tip: l,
  children: s,
  footer: c
}) {
  const p = typeof o == "number" && o > r ? `${r} of ${o}${i ? "+" : ""}` : void 0;
  return /* @__PURE__ */ a(
    "div",
    {
      style: {
        display: "flex",
        flexDirection: "column",
        minWidth: 280,
        width: 280,
        flexShrink: 0,
        borderRadius: t.radiusLg,
        border: `1px solid ${t.border}`,
        background: t.panel,
        maxHeight: "100%",
        overflow: "hidden"
      },
      children: [
        /* @__PURE__ */ a(
          "div",
          {
            style: {
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 12px",
              borderBottom: `1px solid ${t.border}`,
              position: "sticky",
              top: 0
            },
            children: [
              /* @__PURE__ */ n("span", { style: { fontSize: 12.5, fontWeight: 600, color: t.textStrong, textTransform: "uppercase", letterSpacing: 0.3 }, children: e }),
              l && /* @__PURE__ */ n(le, { tip: l }),
              /* @__PURE__ */ n("span", { style: { flex: 1 } }),
              p ? /* @__PURE__ */ n(
                "span",
                {
                  title: `Showing the ${r} most recent of ${o}${i ? "+" : ""} in this column`,
                  style: { fontSize: 11, color: t.muted, whiteSpace: "nowrap" },
                  children: p
                }
              ) : /* @__PURE__ */ n(Ae, { n: r })
            ]
          }
        ),
        /* @__PURE__ */ a("div", { style: { display: "flex", flexDirection: "column", gap: 8, padding: 10, overflowY: "auto", flex: 1 }, children: [
          r === 0 ? /* @__PURE__ */ n("div", { style: { fontSize: 12, color: t.muted, textAlign: "center", padding: "16px 0" }, children: "Nothing here" }) : s,
          c
        ] })
      ]
    }
  );
}
function ce(e) {
  if (e == null) return 0;
  if (typeof e == "number") return e < 1e12 ? e * 1e3 : e;
  const r = Date.parse(e);
  return Number.isNaN(r) ? 0 : r;
}
function te(e) {
  if (!e || e < 0) return "—";
  const r = Math.floor(e / 6e4);
  if (r < 1) return "<1m";
  const o = Math.floor(r / 1440), i = Math.floor(r % 1440 / 60), l = r % 60;
  return o > 0 ? i > 0 ? `${o}d ${i}h` : `${o}d` : i > 0 ? l > 0 ? `${i}h ${l}m` : `${i}h` : `${l}m`;
}
function he(e) {
  const r = ce(e);
  return r ? te(Date.now() - r) : "—";
}
function ct(e) {
  const r = ce(e);
  return r ? Math.max(0, Math.round((Date.now() - r) / 6e4)) : 0;
}
function Q(e) {
  const r = ce(e);
  if (!r) return "—";
  try {
    return new Date(r).toLocaleString(void 0, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  } catch {
    return new Date(r).toISOString();
  }
}
function ht({
  card: e,
  rankPosition: r,
  rationale: o,
  onClick: i
}) {
  const l = ee(e.category), s = (e.status || "").toUpperCase() === "CLOSED", c = Y(e), h = se(e), p = e.name || e.title || e.display_id;
  return /* @__PURE__ */ a(
    "div",
    {
      role: "button",
      tabIndex: 0,
      onClick: i,
      onKeyDown: (d) => {
        (d.key === "Enter" || d.key === " ") && (d.preventDefault(), i());
      },
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 8,
        padding: 12,
        borderRadius: t.radiusMd,
        border: `1px solid ${t.border}`,
        background: t.card,
        color: t.cardFg,
        cursor: "pointer",
        boxShadow: t.shadowSm
      },
      children: [
        /* @__PURE__ */ a("div", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
          /* @__PURE__ */ n("span", { style: { fontFamily: t.mono, fontSize: 11, color: t.muted }, children: e.display_id }),
          typeof r == "number" && /* @__PURE__ */ n(
            Be,
            {
              position: r,
              title: o ? `Agent rank #${r} – ${o}` : `Ranked #${r} by the smart-ranking agent`
            }
          ),
          /* @__PURE__ */ n("span", { style: { flex: 1 } }),
          e.category && /* @__PURE__ */ n(B, { tone: l, children: e.category })
        ] }),
        /* @__PURE__ */ n("div", { style: { fontSize: 13.5, fontWeight: 600, color: t.textStrong, lineHeight: 1.3 }, children: p }),
        h && /* @__PURE__ */ a("div", { style: { fontSize: 12, color: t.muted, display: "flex", gap: 5, alignItems: "baseline" }, children: [
          /* @__PURE__ */ n("span", { style: { color: t.mutedStrong, fontWeight: 500 }, children: "Root cause:" }),
          /* @__PURE__ */ n("span", { style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: h })
        ] }),
        /* @__PURE__ */ a("div", { style: { display: "flex", alignItems: "center", gap: 12, fontSize: 12, color: t.muted }, children: [
          /* @__PURE__ */ a("span", { title: "Affected entities", children: [
            c,
            " affected ",
            c === 1 ? "entity" : "entities"
          ] }),
          /* @__PURE__ */ n("span", { style: { flex: 1 } }),
          /* @__PURE__ */ a("span", { title: s ? "Duration" : "Age", style: { display: "inline-flex", alignItems: "center", gap: 4 }, children: [
            /* @__PURE__ */ n(R, { name: "spark", size: 12, color: t.muted }),
            s ? te(Z(e)) : he(e.start)
          ] })
        ] })
      ]
    }
  );
}
function ut({ card: e, onClick: r }) {
  const o = e.tags || [], i = o.slice(0, 3), l = o.length - i.length, s = e.active_problems ?? 0, c = e.recent_problems ?? 0, h = e.name || e.id;
  return /* @__PURE__ */ a(
    "div",
    {
      role: "button",
      tabIndex: 0,
      onClick: r,
      onKeyDown: (p) => {
        (p.key === "Enter" || p.key === " ") && (p.preventDefault(), r());
      },
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 8,
        padding: 12,
        borderRadius: t.radiusMd,
        border: `1px solid ${t.border}`,
        background: t.card,
        color: t.cardFg,
        cursor: "pointer",
        boxShadow: t.shadowSm
      },
      children: [
        /* @__PURE__ */ n("div", { style: { fontSize: 13.5, fontWeight: 600, color: t.textStrong, lineHeight: 1.3 }, children: h }),
        i.length > 0 && /* @__PURE__ */ a("div", { style: { display: "flex", flexWrap: "wrap", gap: 4 }, children: [
          i.map((p) => /* @__PURE__ */ n(J, { children: p }, p)),
          l > 0 && /* @__PURE__ */ a(J, { children: [
            "+",
            l
          ] })
        ] }),
        /* @__PURE__ */ a("div", { style: { display: "flex", alignItems: "center", gap: 12, fontSize: 12, color: t.muted }, children: [
          s > 0 && /* @__PURE__ */ a("span", { style: { color: t.danger, fontWeight: 600 }, children: [
            s,
            " active"
          ] }),
          c > 0 && /* @__PURE__ */ a("span", { style: { color: t.warn, fontWeight: 600 }, children: [
            c,
            " recent"
          ] }),
          s === 0 && c === 0 && /* @__PURE__ */ n("span", { style: { color: t.ok, fontWeight: 600 }, children: "Healthy" }),
          /* @__PURE__ */ n("span", { style: { flex: 1 } }),
          /* @__PURE__ */ n("span", { style: { fontFamily: t.mono, fontSize: 10.5, color: t.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 150 }, children: e.id })
        ] })
      ]
    }
  );
}
const pt = {
  new: "Active, started in the last 24h",
  ongoing: "Active for more than 24h",
  maintenance: "Active during a maintenance window",
  closed: "Closed within the selected time window",
  unhealthy: "≥1 active problem affects this entity",
  watch: "A problem affecting it closed in the last 24h",
  healthy: "No active or recent problems"
};
function gt({
  board: e,
  view: r,
  sort: o,
  search: i,
  onSelect: l
}) {
  const s = e == null ? void 0 : e.smart_rank, c = de(s), h = G(() => {
    const m = /* @__PURE__ */ new Map();
    return A(r) && c && (s != null && s.order) && s.order.forEach((u, k) => m.set(u, k + 1)), m;
  }, [r, c, s]), p = G(() => Le(e, r).map((u) => {
    const k = u.cards.filter((w) => Re(w, r, i)), g = rt(k, r, o, s);
    return {
      key: u.key,
      label: u.label,
      cards: g,
      total: u.total,
      totalIsLowerBound: u.totalIsLowerBound
    };
  }), [e, r, o, i, s]), d = 40, [f, b] = x({});
  return P(() => b({}), [e, r, o, i]), /* @__PURE__ */ a(
    "div",
    {
      style: {
        display: "flex",
        gap: 12,
        padding: "4px 16px 16px",
        overflowX: "auto",
        flex: 1,
        minHeight: 0,
        alignItems: "stretch"
      },
      children: [
        p.map((m) => {
          const u = f[m.key] ?? d, k = m.cards.slice(0, u), g = m.cards.length - k.length, w = typeof m.total == "number" ? Math.max(m.total, m.cards.length) : m.cards.length;
          return /* @__PURE__ */ n(
            dt,
            {
              label: m.label,
              count: k.length,
              total: w,
              totalIsLowerBound: m.totalIsLowerBound,
              tip: pt[m.key],
              footer: g > 0 ? /* @__PURE__ */ a(
                "button",
                {
                  onClick: () => b((v) => ({ ...v, [m.key]: u + d })),
                  style: {
                    fontSize: 12,
                    padding: "7px 0",
                    borderRadius: t.radiusSm,
                    border: `1px solid ${t.border}`,
                    background: "transparent",
                    color: t.accent,
                    cursor: "pointer"
                  },
                  children: [
                    "Show ",
                    Math.min(g, d),
                    " more (",
                    g,
                    " hidden)"
                  ]
                }
              ) : null,
              children: k.map((v) => {
                var z;
                const S = Ze(v, r);
                if (A(r)) {
                  const L = v, $ = h.get(L.display_id);
                  return /* @__PURE__ */ n(
                    ht,
                    {
                      card: L,
                      rankPosition: $,
                      rationale: $ ? (z = s == null ? void 0 : s.rationales) == null ? void 0 : z[L.display_id] : void 0,
                      onClick: () => l({ kind: "problem", id: L.display_id, card: L })
                    },
                    S
                  );
                }
                const I = v;
                return /* @__PURE__ */ n(ut, { card: I, onClick: () => l({ kind: "entity", id: I.id, card: I }) }, S);
              })
            },
            m.key
          );
        }),
        p.length === 0 && /* @__PURE__ */ n("div", { style: { margin: "auto", color: t.muted, fontSize: 13 }, children: "No columns." })
      ]
    }
  );
}
function Te(e) {
  return (e || "").replace(/\/$/, "");
}
function ft(e, r) {
  var l;
  if (e.deep_link) return e.deep_link;
  if (e.url) return e.url;
  const o = e.event_id || ((l = e.event) == null ? void 0 : l.id) || e.display_id, i = Te(r || e.environment);
  return i ? `${i}/ui/apps/dynatrace.davis.problems/problem/${encodeURIComponent(o)}` : "";
}
function mt(e, r) {
  if (e.deep_link) return e.deep_link;
  if (e.url) return e.url;
  const o = Te(r || e.environment);
  return !o || !e.id ? "" : `${o}/ui/entity/${encodeURIComponent(e.id)}`;
}
function M({ label: e, children: r }) {
  return /* @__PURE__ */ a("div", { style: { display: "flex", gap: 10, fontSize: 13, padding: "6px 0", borderBottom: `1px solid ${t.border}` }, children: [
    /* @__PURE__ */ n("div", { style: { width: 120, flexShrink: 0, color: t.muted }, children: e }),
    /* @__PURE__ */ n("div", { style: { flex: 1, color: t.text, minWidth: 0, wordBreak: "break-word" }, children: r || "—" })
  ] });
}
function _({ children: e }) {
  return /* @__PURE__ */ n("div", { style: { fontSize: 11, fontWeight: 700, letterSpacing: 0.4, textTransform: "uppercase", color: t.muted, margin: "14px 0 4px" }, children: e });
}
function Me({ href: e }) {
  return e ? /* @__PURE__ */ a(
    "a",
    {
      href: e,
      target: "_blank",
      rel: "noreferrer",
      style: { display: "inline-flex", alignItems: "center", gap: 5, fontSize: 13, color: t.accent, textDecoration: "none" },
      children: [
        "Open in Dynatrace",
        /* @__PURE__ */ n(R, { name: "external", size: 13 })
      ]
    }
  ) : null;
}
function ke({ items: e }) {
  return e.length ? /* @__PURE__ */ n("div", { style: { display: "flex", flexDirection: "column", gap: 6 }, children: e.map((r) => /* @__PURE__ */ a("div", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
    r.category && /* @__PURE__ */ n(B, { tone: ee(r.category), children: r.category }),
    /* @__PURE__ */ n("span", { style: { fontSize: 12.5 }, children: r.name || r.title || r.display_id }),
    /* @__PURE__ */ n("span", { style: { flex: 1 } }),
    /* @__PURE__ */ n("span", { style: { fontFamily: t.mono, fontSize: 10.5, color: t.muted }, children: r.display_id })
  ] }, r.display_id)) }) : /* @__PURE__ */ n("span", { style: { color: t.muted }, children: "None" });
}
function yt({ view: e, displayId: r }) {
  const [o, i] = x(null), [l, s] = x(""), [c, h] = x(""), [p, d] = x(!1), { openChat: f } = _e(), b = U(
    async (u) => {
      i(u), h(""), d(!1);
      try {
        const k = await O("/handoff", {
          method: "POST",
          body: JSON.stringify({ kind: u, view: e, display_id: r })
        }), g = k.prompt || k.message || "";
        s(g), g && f({ message: g });
      } catch (k) {
        const g = k;
        h(g.hint || g.message || "Handoff failed.");
      } finally {
        i(null);
      }
    },
    [e, r, f]
  ), m = U(() => {
    var u;
    l && ((u = navigator.clipboard) == null || u.writeText(l).then(
      () => {
        d(!0), window.setTimeout(() => d(!1), 1500);
      },
      () => d(!1)
    ));
  }, [l]);
  return /* @__PURE__ */ a("div", { style: { display: "flex", flexDirection: "column", gap: 8 }, children: [
    /* @__PURE__ */ a("div", { style: { display: "flex", gap: 8 }, children: [
      /* @__PURE__ */ a(T, { variant: "primary", disabled: o !== null, onClick: () => b("investigate"), children: [
        /* @__PURE__ */ n(R, { name: "spark", size: 14 }),
        o === "investigate" ? "Composing…" : "Investigate"
      ] }),
      /* @__PURE__ */ n(T, { disabled: o !== null, onClick: () => b("summarize"), children: o === "summarize" ? "Composing…" : "Summarize for standup" })
    ] }),
    c && /* @__PURE__ */ n("div", { style: { fontSize: 12.5, color: t.danger }, children: c }),
    l && /* @__PURE__ */ a("div", { style: { display: "flex", flexDirection: "column", gap: 6 }, children: [
      /* @__PURE__ */ a("div", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
        /* @__PURE__ */ n("span", { style: { fontSize: 12, color: t.muted, flex: 1 }, children: "Opened in a Kiro Crew chat. If it didn't open, copy the prompt below." }),
        /* @__PURE__ */ a(T, { size: "sm", onClick: m, title: "Copy prompt", children: [
          /* @__PURE__ */ n(R, { name: p ? "check" : "copy", size: 13 }),
          p ? "Copied" : "Copy"
        ] })
      ] }),
      /* @__PURE__ */ n(
        "pre",
        {
          style: {
            margin: 0,
            padding: 10,
            fontFamily: t.mono,
            fontSize: 12,
            lineHeight: 1.45,
            color: t.text,
            background: t.bgElevated,
            border: `1px solid ${t.border}`,
            borderRadius: t.radiusMd,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            maxHeight: 260,
            overflowY: "auto"
          },
          children: l
        }
      )
    ] })
  ] });
}
function bt({ detail: e, envUrl: r }) {
  const o = (e.status || "").toUpperCase() === "CLOSED", i = e.affected_entities && e.affected_entities.length ? e.affected_entities.map((l) => l.name || l.id || "").filter(Boolean) : e.affected_names || [];
  return /* @__PURE__ */ a(W, { children: [
    /* @__PURE__ */ a("div", { style: { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }, children: [
      e.category && /* @__PURE__ */ n(B, { tone: ee(e.category), children: e.category }),
      /* @__PURE__ */ n(B, { tone: o ? "muted" : "danger", children: e.status || "UNKNOWN" }),
      e.maintenance && /* @__PURE__ */ n(B, { tone: "warn", children: "Maintenance" })
    ] }),
    /* @__PURE__ */ n(_, { children: "Details" }),
    /* @__PURE__ */ n(M, { label: "Problem ID", children: /* @__PURE__ */ n("span", { style: { fontFamily: t.mono }, children: e.display_id }) }),
    /* @__PURE__ */ n(M, { label: "Started", children: Q(e.start) }),
    o && /* @__PURE__ */ n(M, { label: "Ended", children: Q(e.end) }),
    /* @__PURE__ */ n(M, { label: o ? "Duration" : "Age", children: o ? te(Z(e)) : he(e.start) }),
    /* @__PURE__ */ n(M, { label: "Root cause", children: se(e) }),
    /* @__PURE__ */ a(M, { label: "Affected", children: [
      Y(e),
      " entities"
    ] }),
    i.length > 0 && /* @__PURE__ */ a(W, { children: [
      /* @__PURE__ */ n(_, { children: "Affected entities" }),
      /* @__PURE__ */ n("div", { style: { display: "flex", flexWrap: "wrap", gap: 4 }, children: i.map((l, s) => /* @__PURE__ */ n(J, { children: l }, `${l}-${s}`)) })
    ] }),
    e.description && /* @__PURE__ */ a(W, { children: [
      /* @__PURE__ */ n(_, { children: "Analysis" }),
      /* @__PURE__ */ n("div", { style: { fontSize: 12.5, lineHeight: 1.5, color: t.text, whiteSpace: "pre-wrap", wordBreak: "break-word" }, children: e.description })
    ] }),
    /* @__PURE__ */ n(_, { children: "Links" }),
    /* @__PURE__ */ n(Me, { href: ft(e, r) }),
    /* @__PURE__ */ n(_, { children: "Agent handoff" }),
    /* @__PURE__ */ n(yt, { view: "problems", displayId: e.display_id })
  ] });
}
function vt({ detail: e, envUrl: r }) {
  const o = e.tags || [], i = e.related_problems, l = Array.isArray(i) ? i.filter((p) => (p.status || "").toUpperCase() === "ACTIVE") : (i == null ? void 0 : i.active) || [], s = Array.isArray(i) ? i.filter((p) => (p.status || "").toUpperCase() === "CLOSED") : (i == null ? void 0 : i.recent) || [], c = e.active || l, h = e.recent || s;
  return /* @__PURE__ */ a(W, { children: [
    /* @__PURE__ */ n(_, { children: "Details" }),
    /* @__PURE__ */ n(M, { label: "Name", children: e.name || e.id }),
    /* @__PURE__ */ n(M, { label: "Type", children: e.type || "—" }),
    /* @__PURE__ */ n(M, { label: "Entity ID", children: /* @__PURE__ */ n("span", { style: { fontFamily: t.mono, fontSize: 11.5 }, children: e.id }) }),
    o.length > 0 && /* @__PURE__ */ a(W, { children: [
      /* @__PURE__ */ n(_, { children: "Tags" }),
      /* @__PURE__ */ n("div", { style: { display: "flex", flexWrap: "wrap", gap: 4 }, children: o.map((p) => /* @__PURE__ */ n(J, { children: p }, p)) })
    ] }),
    /* @__PURE__ */ n(_, { children: "Active problems" }),
    /* @__PURE__ */ n(ke, { items: c }),
    /* @__PURE__ */ n(_, { children: "Recent problems" }),
    /* @__PURE__ */ n(ke, { items: h }),
    /* @__PURE__ */ n(_, { children: "Links" }),
    /* @__PURE__ */ n(Me, { href: mt(e, r) })
  ] });
}
function xt({ kind: e, card: r }) {
  if (e === "problem") {
    const l = r, s = (l.status || "").toUpperCase() === "CLOSED";
    return /* @__PURE__ */ a(W, { children: [
      /* @__PURE__ */ n(_, { children: "From the board" }),
      /* @__PURE__ */ a("div", { style: { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", margin: "2px 0 6px" }, children: [
        l.category && /* @__PURE__ */ n(B, { tone: ee(l.category), children: l.category }),
        /* @__PURE__ */ n(B, { tone: s ? "muted" : "danger", children: l.status || "UNKNOWN" }),
        l.maintenance && /* @__PURE__ */ n(B, { tone: "warn", children: "Maintenance" })
      ] }),
      /* @__PURE__ */ n(M, { label: "Problem ID", children: /* @__PURE__ */ n("span", { style: { fontFamily: t.mono }, children: l.display_id }) }),
      /* @__PURE__ */ n(M, { label: "Started", children: Q(l.start) }),
      s && /* @__PURE__ */ n(M, { label: "Ended", children: Q(l.end) }),
      /* @__PURE__ */ n(M, { label: s ? "Duration" : "Age", children: s ? te(Z(l)) : he(l.start) }),
      /* @__PURE__ */ a(M, { label: "Affected", children: [
        Y(l),
        " entities"
      ] })
    ] });
  }
  const o = r, i = o.tags || [];
  return /* @__PURE__ */ a(W, { children: [
    /* @__PURE__ */ n(_, { children: "From the board" }),
    /* @__PURE__ */ n(M, { label: "Name", children: o.name || o.id }),
    /* @__PURE__ */ n(M, { label: "Type", children: o.type || "—" }),
    i.length > 0 && /* @__PURE__ */ a(W, { children: [
      /* @__PURE__ */ n(_, { children: "Tags" }),
      /* @__PURE__ */ n("div", { style: { display: "flex", flexWrap: "wrap", gap: 4 }, children: i.map((l) => /* @__PURE__ */ n(J, { children: l }, l)) })
    ] })
  ] });
}
function St({ selection: e, envUrl: r, onClose: o }) {
  const [i, l] = x(!0), [s, c] = x(null), [h, p] = x(null), [d, f] = x(null), [b, m] = x(0);
  P(() => {
    const g = (w) => {
      w.key === "Escape" && o();
    };
    return document.addEventListener("keydown", g), () => document.removeEventListener("keydown", g);
  }, [o]), P(() => {
    let g = !0;
    l(!0), c(null), p(null), f(null);
    const w = e.kind === "problem" ? `/problems/${encodeURIComponent(e.id)}` : `/entities/${encodeURIComponent(e.id)}`;
    return O(w).then((v) => {
      g && (e.kind === "problem" ? p(v) : f(v));
    }).catch((v) => g && c(v)).finally(() => g && l(!1)), () => {
      g = !1;
    };
  }, [e, b]);
  const u = e.card, k = e.kind === "problem" ? (h == null ? void 0 : h.name) || (h == null ? void 0 : h.title) || (u == null ? void 0 : u.name) || (u == null ? void 0 : u.title) || e.id : (d == null ? void 0 : d.name) || (u == null ? void 0 : u.name) || e.id;
  return /* @__PURE__ */ a("div", { style: { position: "absolute", inset: 0, zIndex: 20 }, children: [
    /* @__PURE__ */ n("div", { onClick: o, style: { position: "absolute", inset: 0, background: Ee } }),
    /* @__PURE__ */ a(
      "div",
      {
        role: "dialog",
        "aria-modal": "true",
        style: {
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          width: "min(460px, 92%)",
          display: "flex",
          flexDirection: "column",
          background: t.panel,
          borderLeft: `1px solid ${t.border}`,
          boxShadow: t.shadowLg
        },
        children: [
          /* @__PURE__ */ a("div", { style: { display: "flex", alignItems: "flex-start", gap: 10, padding: "14px 16px", borderBottom: `1px solid ${t.border}` }, children: [
            /* @__PURE__ */ n("div", { style: { flex: 1, fontSize: 15, fontWeight: 700, color: t.textStrong, lineHeight: 1.3 }, children: k }),
            /* @__PURE__ */ n(T, { variant: "ghost", onClick: o, title: "Close (Esc)", style: { padding: 6 }, children: /* @__PURE__ */ n(R, { name: "close", size: 16 }) })
          ] }),
          /* @__PURE__ */ a("div", { style: { padding: "10px 16px 24px", overflowY: "auto", flex: 1 }, children: [
            i && /* @__PURE__ */ n("div", { style: { fontSize: 13, color: t.muted, padding: "20px 0" }, children: "Loading…" }),
            s && !i && /* @__PURE__ */ a("div", { style: { display: "flex", flexDirection: "column" }, children: [
              /* @__PURE__ */ a("div", { style: { display: "flex", flexDirection: "column", gap: 8, padding: "10px 0 4px" }, children: [
                /* @__PURE__ */ n("div", { style: { fontSize: 13.5, fontWeight: 600, color: t.text }, children: "Couldn’t load live details from Dynatrace" }),
                (s.hint || s.message) && /* @__PURE__ */ n("div", { style: { fontSize: 11.5, color: t.muted, lineHeight: 1.4 }, children: s.hint || s.message }),
                /* @__PURE__ */ n("div", { children: /* @__PURE__ */ a(T, { size: "sm", onClick: () => m((g) => g + 1), title: "Retry loading details", children: [
                  /* @__PURE__ */ n(R, { name: "refresh", size: 13 }),
                  "Retry"
                ] }) })
              ] }),
              u && /* @__PURE__ */ n(xt, { kind: e.kind, card: u })
            ] }),
            !i && !s && h && /* @__PURE__ */ n(bt, { detail: h, envUrl: r }),
            !i && !s && d && /* @__PURE__ */ n(vt, { detail: d, envUrl: r })
          ] })
        ]
      }
    )
  ] });
}
const we = /^https:\/\/[a-z0-9-]+\.(apps\.dynatrace\.com|live\.dynatrace\.com|apps\.dynatracelabs\.com)\/?$/;
function K({ children: e }) {
  return /* @__PURE__ */ n("div", { style: { fontSize: 11, fontWeight: 700, letterSpacing: 0.4, textTransform: "uppercase", color: t.muted, marginBottom: 6 }, children: e });
}
function X({ children: e, tone: r }) {
  const o = r === "ok" ? t.ok : r === "warn" ? t.warn : t.border;
  return /* @__PURE__ */ n("div", { style: { display: "flex", flexDirection: "column", gap: 8, padding: 12, borderRadius: t.radiusMd, border: `1px solid ${o}`, background: t.bgElevated, marginBottom: 14 }, children: e });
}
const q = {
  fontSize: 13,
  padding: "8px 10px",
  borderRadius: t.radiusSm,
  border: `1px solid ${t.border}`,
  background: t.bg,
  color: t.text,
  width: "100%",
  boxSizing: "border-box"
};
function kt({
  status: e,
  onClose: r,
  onChanged: o
}) {
  const [i, l] = x(null), [s, c] = x(""), [h, p] = x(""), [d, f] = x(""), [b, m] = x(""), [u, k] = x(null), [g, w] = x(""), [v, S] = x(!1), I = U(() => {
    O("/settings").then(l).catch(() => l(null));
  }, []);
  P(() => I(), [I]), P(() => {
    const y = (E) => {
      E.key === "Escape" && r();
    };
    return document.addEventListener("keydown", y), () => document.removeEventListener("keydown", y);
  }, [r]);
  const z = !!(e != null && e.configured) && !(e != null && e.demo), L = i != null && !i.dtctl_installed, $ = async () => {
    const y = s.trim().replace(/\/$/, "");
    if (!we.test(y + "")) {
      k({ message: "Enter your environment URL first.", hint: "It looks like https://abc12345.apps.dynatrace.com — the address you use to open Dynatrace." });
      return;
    }
    m("login"), k(null), w("");
    try {
      await O("/settings/login", { method: "POST", body: JSON.stringify({ environment: y }) }), w("Signed in. This tenant is now connected."), S(!1), I(), o();
    } catch (E) {
      const N = E;
      k({ message: N.message, hint: N.hint });
    } finally {
      m("");
    }
  }, C = async () => {
    if (!h.trim() || !we.test(d.trim().replace(/\/$/, ""))) {
      k({ message: "Both the token and the environment URL are needed for this option.", hint: 'No token? Use "Sign in with Dynatrace" instead — it needs no token at all.' });
      return;
    }
    m("token"), k(null), w("");
    try {
      await O("/settings/token", {
        method: "POST",
        body: JSON.stringify({ token: h.trim(), environment: d.trim().replace(/\/$/, "") })
      }), p(""), w("Token saved and validated."), S(!1), I(), o();
    } catch (y) {
      const E = y;
      k({ message: E.message, hint: E.hint });
    } finally {
      m("");
    }
  }, V = async (y) => {
    m("ctx"), k(null), w("");
    try {
      await O("/settings/context", { method: "POST", body: JSON.stringify({ context: y }) }), w(y ? `Tenant pinned to "${y}".` : "Using the dtctl active context."), I(), o();
    } catch (E) {
      const N = E;
      k({ message: N.message, hint: N.hint });
    } finally {
      m("");
    }
  }, j = async () => {
    m("remove"), k(null);
    try {
      await O("/settings/disconnect", { method: "POST" }), w("Signed out. This app is disconnected — your dtctl logins are untouched."), I(), o();
    } catch (y) {
      const E = y;
      k({ message: E.message, hint: E.hint });
    } finally {
      m("");
    }
  }, D = /* @__PURE__ */ a(W, { children: [
    /* @__PURE__ */ n(K, { children: "Option 1 · Sign in with Dynatrace (recommended)" }),
    /* @__PURE__ */ a(X, { children: [
      /* @__PURE__ */ n("div", { style: { fontSize: 12.5, color: t.muted }, children: "No token needed. Enter your environment URL and sign in — your browser opens the Dynatrace login, and the session is stored securely in your OS keychain." }),
      /* @__PURE__ */ n(
        "input",
        {
          value: s,
          onChange: (y) => c(y.target.value),
          placeholder: "https://abc12345.apps.dynatrace.com",
          style: q,
          disabled: b === "login"
        }
      ),
      /* @__PURE__ */ a("div", { style: { display: "flex", alignItems: "center", gap: 10 }, children: [
        /* @__PURE__ */ n(T, { variant: "primary", onClick: () => void $(), disabled: b !== "" || L, children: b === "login" ? "Waiting for browser sign-in…" : "Sign in with Dynatrace" }),
        b === "login" && /* @__PURE__ */ n("span", { style: { fontSize: 12, color: t.muted }, children: "Complete the login in the browser window that opened." })
      ] })
    ] }),
    /* @__PURE__ */ n(K, { children: "Option 2 · Use an access token" }),
    /* @__PURE__ */ a(X, { children: [
      /* @__PURE__ */ n("div", { style: { fontSize: 12.5, color: t.muted }, children: "For automation or when SSO isn't available. Needs BOTH a platform token and the environment URL. Validated live before saving; stored owner-only, never logged or echoed." }),
      /* @__PURE__ */ n("input", { value: h, onChange: (y) => p(y.target.value), placeholder: "dt0c01.XXXX…", style: q }),
      /* @__PURE__ */ n(
        "input",
        {
          value: d,
          onChange: (y) => f(y.target.value),
          placeholder: "https://abc12345.apps.dynatrace.com",
          style: q
        }
      ),
      /* @__PURE__ */ n("div", { children: /* @__PURE__ */ n(T, { onClick: () => void C(), disabled: b !== "" || L, children: b === "token" ? "Validating…" : "Save token" }) })
    ] })
  ] });
  return /* @__PURE__ */ n(
    "div",
    {
      onClick: r,
      style: { position: "absolute", inset: 0, background: Ee, display: "flex", justifyContent: "flex-end", zIndex: 40 },
      children: /* @__PURE__ */ a(
        "div",
        {
          onClick: (y) => y.stopPropagation(),
          style: { width: 460, maxWidth: "92%", height: "100%", overflowY: "auto", background: t.panel, borderLeft: `1px solid ${t.border}`, padding: 18, boxSizing: "border-box" },
          children: [
            /* @__PURE__ */ a("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }, children: [
              /* @__PURE__ */ n(R, { name: "settings", size: 17 }),
              /* @__PURE__ */ n("span", { style: { fontSize: 16, fontWeight: 700, color: t.textStrong, flex: 1 }, children: "Settings" }),
              /* @__PURE__ */ n(T, { variant: "ghost", onClick: r, title: "Close", children: /* @__PURE__ */ n(R, { name: "close", size: 15 }) })
            ] }),
            u && /* @__PURE__ */ a("div", { style: { marginBottom: 12, fontSize: 12.5, color: t.danger }, children: [
              u.message,
              u.hint && /* @__PURE__ */ n("div", { style: { color: t.muted, marginTop: 3 }, children: u.hint })
            ] }),
            g && /* @__PURE__ */ n("div", { style: { marginBottom: 12, fontSize: 12.5, color: t.ok }, children: g }),
            L && /* @__PURE__ */ a(W, { children: [
              /* @__PURE__ */ n(K, { children: "First: install dtctl" }),
              /* @__PURE__ */ a(X, { tone: "warn", children: [
                /* @__PURE__ */ a("div", { style: { fontSize: 12.5, color: t.text }, children: [
                  "This app reads Dynatrace through ",
                  /* @__PURE__ */ n("b", { children: "dtctl" }),
                  ", the open-source Dynatrace CLI — it isn't installed on this machine yet. Install it, then come back here:"
                ] }),
                /* @__PURE__ */ n("pre", { style: { margin: 0, padding: 10, fontFamily: t.mono, fontSize: 12, background: t.bg, borderRadius: t.radiusSm, border: `1px solid ${t.border}`, overflowX: "auto" }, children: "brew install dynatrace-oss/tap/dtctl" }),
                /* @__PURE__ */ a("div", { style: { fontSize: 12, color: t.muted }, children: [
                  "Or download a binary from",
                  " ",
                  /* @__PURE__ */ n("a", { href: "https://github.com/dynatrace-oss/dtctl", target: "_blank", rel: "noreferrer", style: { color: t.accent }, children: "github.com/dynatrace-oss/dtctl" }),
                  "."
                ] }),
                /* @__PURE__ */ n("div", { children: /* @__PURE__ */ n(T, { onClick: I, children: "I installed it — check again" }) })
              ] })
            ] }),
            z && !L && /* @__PURE__ */ a(W, { children: [
              /* @__PURE__ */ n(K, { children: "Connection" }),
              /* @__PURE__ */ a(X, { tone: "ok", children: [
                /* @__PURE__ */ a("div", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
                  /* @__PURE__ */ n(R, { name: "check", size: 14, color: t.ok }),
                  /* @__PURE__ */ n("span", { style: { fontSize: 13, fontWeight: 600, color: t.textStrong }, children: "Connected" }),
                  /* @__PURE__ */ n(B, { tone: "muted", children: (i == null ? void 0 : i.source) === "token" || (e == null ? void 0 : e.source) === "token" || (e == null ? void 0 : e.source) === "app" ? "access token" : (e == null ? void 0 : e.source) === "env" ? "env vars" : "Dynatrace sign-in" })
                ] }),
                /* @__PURE__ */ n("div", { style: { fontSize: 12.5, color: t.muted, wordBreak: "break-all" }, children: e == null ? void 0 : e.environment }),
                /* @__PURE__ */ n("div", { children: /* @__PURE__ */ n(T, { variant: "danger", onClick: () => void j(), disabled: b !== "", children: b === "remove" ? "Signing out…" : "Sign out" }) })
              ] }),
              i && i.contexts.length > 1 && /* @__PURE__ */ a(W, { children: [
                /* @__PURE__ */ n(K, { children: "Tenant" }),
                /* @__PURE__ */ a(X, { children: [
                  /* @__PURE__ */ n("div", { style: { fontSize: 12.5, color: t.muted }, children: "You're signed in to more than one tenant. Pick which one this board reads." }),
                  /* @__PURE__ */ a(
                    "select",
                    {
                      value: i.selected_context,
                      disabled: b === "ctx",
                      onChange: (y) => void V(y.target.value),
                      style: { ...q },
                      children: [
                        /* @__PURE__ */ a("option", { value: "", children: [
                          "dtctl active context",
                          i.contexts.find((y) => y.active) ? ` (${i.contexts.find((y) => y.active).name})` : ""
                        ] }),
                        i.contexts.map((y) => /* @__PURE__ */ a("option", { value: y.name, children: [
                          y.name,
                          " — ",
                          y.environment.replace(/^https?:\/\//, "")
                        ] }, y.name))
                      ]
                    }
                  )
                ] })
              ] }),
              v ? D : /* @__PURE__ */ n(
                "button",
                {
                  onClick: () => S(!0),
                  style: { fontSize: 12.5, color: t.accent, background: "none", border: "none", padding: 0, cursor: "pointer" },
                  children: "Connect a different tenant or switch method…"
                }
              )
            ] }),
            !z && !L && i && /* @__PURE__ */ a(W, { children: [
              /* @__PURE__ */ a("div", { style: { fontSize: 13, color: t.text, marginBottom: 12 }, children: [
                "Connect the app to your Dynatrace tenant. You need ",
                /* @__PURE__ */ n("b", { children: "one" }),
                " of the two options below — not both."
              ] }),
              D
            ] }),
            !i && /* @__PURE__ */ n("div", { style: { fontSize: 12.5, color: t.muted }, children: "Loading settings…" })
          ]
        }
      )
    }
  );
}
function ne({
  icon: e = "warning",
  title: r,
  body: o,
  action: i
}) {
  return /* @__PURE__ */ a(
    "div",
    {
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        gap: 10,
        padding: "48px 24px",
        margin: "auto",
        maxWidth: 420,
        color: t.muted
      },
      children: [
        /* @__PURE__ */ n(
          "div",
          {
            style: {
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 44,
              height: 44,
              borderRadius: 9999,
              background: t.bgElevated,
              color: t.muted
            },
            children: /* @__PURE__ */ n(R, { name: e, size: 22 })
          }
        ),
        /* @__PURE__ */ n("div", { style: { fontSize: 15, fontWeight: 600, color: t.textStrong }, children: r }),
        /* @__PURE__ */ n("div", { style: { fontSize: 13, lineHeight: 1.5 }, children: o }),
        i && /* @__PURE__ */ n("div", { style: { marginTop: 4 }, children: /* @__PURE__ */ n(T, { variant: "primary", onClick: i.onClick, children: i.label }) })
      ]
    }
  );
}
const Ce = /^https:\/\/[a-z0-9-]+\.(apps\.dynatrace\.com|live\.dynatrace\.com|apps\.dynatracelabs\.com)\/?$/;
function re({ children: e }) {
  return /* @__PURE__ */ n(
    "div",
    {
      style: {
        fontSize: 10.5,
        fontWeight: 700,
        letterSpacing: 0.5,
        textTransform: "uppercase",
        color: t.muted,
        marginBottom: 4
      },
      children: e
    }
  );
}
function oe({
  n: e,
  active: r,
  done: o
}) {
  const i = o ? t.ok : r ? t.accent : t.bgElevated, l = o || r ? o ? t.okFg : t.accentFg : t.muted, s = o ? t.ok : r ? t.accent : t.border;
  return /* @__PURE__ */ n(
    "span",
    {
      style: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 28,
        height: 28,
        borderRadius: 9999,
        background: i,
        color: l,
        border: `2px solid ${s}`,
        fontSize: 12,
        fontWeight: 700,
        flexShrink: 0,
        transition: "all 200ms ease"
      },
      children: o ? /* @__PURE__ */ n(R, { name: "check", size: 13 }) : e
    }
  );
}
function ze({ done: e }) {
  return /* @__PURE__ */ n(
    "div",
    {
      style: {
        width: 2,
        height: 20,
        background: e ? t.ok : t.border,
        margin: "3px auto",
        borderRadius: 9999,
        transition: "background 200ms ease"
      }
    }
  );
}
const ie = {
  fontSize: 13,
  padding: "9px 11px",
  borderRadius: t.radiusSm,
  border: `1px solid ${t.border}`,
  background: t.bg,
  color: t.text,
  width: "100%",
  boxSizing: "border-box",
  outline: "none"
};
function ae({
  kind: e,
  message: r,
  hint: o
}) {
  const i = e === "error" ? t.danger : e === "ok" ? t.ok : t.warn, l = e === "error" ? t.dangerSubtle : e === "ok" ? t.okSubtle : t.warnSubtle;
  return /* @__PURE__ */ a(
    "div",
    {
      style: {
        padding: "10px 12px",
        borderRadius: t.radiusMd,
        background: l,
        color: i,
        fontSize: 12.5,
        lineHeight: 1.5
      },
      children: [
        r,
        o && /* @__PURE__ */ n("div", { style: { marginTop: 4, color: t.muted, fontSize: 12 }, children: o })
      ]
    }
  );
}
function De({
  active: e,
  onClick: r,
  label: o,
  sublabel: i
}) {
  return /* @__PURE__ */ a(
    "button",
    {
      onClick: r,
      style: {
        flex: 1,
        padding: "10px 12px",
        borderRadius: t.radiusMd,
        border: `1.5px solid ${e ? t.accent : t.border}`,
        background: e ? t.accentSubtle : t.bg,
        color: e ? t.accent : t.muted,
        cursor: "pointer",
        textAlign: "left",
        transition: "all 150ms ease"
      },
      children: [
        /* @__PURE__ */ n("div", { style: { fontSize: 13, fontWeight: 700, color: e ? t.accent : t.textStrong }, children: o }),
        /* @__PURE__ */ n("div", { style: { fontSize: 11.5, color: t.muted, marginTop: 2 }, children: i })
      ]
    }
  );
}
function Ie({
  onConnected: e,
  reauth: r = !1,
  onExploreDemo: o
}) {
  const [i, l] = x(null), [s, c] = x(!r), [h, p] = x("sso"), [d, f] = x(""), [b, m] = x(""), [u, k] = x(""), [g, w] = x(!1), [v, S] = x(null), [I, z] = x(!1), L = U(() => {
    r || (c(!0), O("/settings").then((D) => {
      l(D), c(!1);
    }).catch(() => {
      l(null), c(!1);
    }));
  }, [r]);
  P(() => {
    L();
  }, [L]);
  const $ = !r && i != null && !i.dtctl_installed, C = I ? 2 : $ ? 0 : 1, V = async () => {
    const D = d.trim().replace(/\/$/, "");
    if (!Ce.test(D)) {
      S({
        message: "Enter a valid environment URL.",
        hint: "It looks like https://abc12345.apps.dynatrace.com — the address you use to open Dynatrace."
      });
      return;
    }
    w(!0), S(null);
    try {
      await O("/settings/login", { method: "POST", body: JSON.stringify({ environment: D }) }), z(!0), e();
    } catch (y) {
      const E = y;
      S({ message: E.message, hint: E.hint });
    } finally {
      w(!1);
    }
  }, j = async () => {
    const D = u.trim().replace(/\/$/, "");
    if (!b.trim() || !Ce.test(D)) {
      S({
        message: "Both a token and a valid environment URL are required.",
        hint: "Don't have a token? Switch to the SSO option above — it doesn't need one."
      });
      return;
    }
    w(!0), S(null);
    try {
      await O("/settings/token", {
        method: "POST",
        body: JSON.stringify({ token: b.trim(), environment: D })
      }), z(!0), e();
    } catch (y) {
      const E = y;
      S({ message: E.message, hint: E.hint });
    } finally {
      w(!1);
    }
  };
  return /* @__PURE__ */ a(
    "div",
    {
      style: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 24px 48px",
        overflowY: "auto",
        minHeight: 0
      },
      children: [
        r ? /* @__PURE__ */ a(
          "div",
          {
            style: {
              width: "100%",
              maxWidth: 520,
              marginBottom: 20,
              padding: "14px 18px",
              borderRadius: t.radiusMd,
              border: `1px solid ${t.warn}`,
              background: t.warnSubtle,
              display: "flex",
              alignItems: "flex-start",
              gap: 12
            },
            children: [
              /* @__PURE__ */ n(R, { name: "warning", size: 17, color: t.warn, style: { marginTop: 1, flexShrink: 0 } }),
              /* @__PURE__ */ a("div", { children: [
                /* @__PURE__ */ n("div", { style: { fontSize: 13.5, fontWeight: 700, color: t.textStrong, marginBottom: 4 }, children: "Your Dynatrace session expired" }),
                /* @__PURE__ */ n("div", { style: { fontSize: 12.5, color: t.muted, lineHeight: 1.55 }, children: "Sign in again below to reconnect — it only takes a moment and your settings are preserved. Your board will reload automatically once you're back in." })
              ] })
            ]
          }
        ) : /* @__PURE__ */ a(
          "div",
          {
            style: {
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
              marginBottom: 32,
              textAlign: "center"
            },
            children: [
              /* @__PURE__ */ a("svg", { width: "48", height: "48", viewBox: "0 0 80 80", fill: "none", "aria-hidden": "true", children: [
                /* @__PURE__ */ n("circle", { cx: "40", cy: "40", r: "36", stroke: t.accent, strokeWidth: "4" }),
                /* @__PURE__ */ n("path", { d: "M24 56 L44 20 L56 20 L36 56 Z", fill: t.accent })
              ] }),
              /* @__PURE__ */ a("div", { children: [
                /* @__PURE__ */ n(
                  "div",
                  {
                    style: { fontSize: 21, fontWeight: 700, color: t.textStrong, lineHeight: 1.25, marginBottom: 5 },
                    children: "Welcome to Dynatrace"
                  }
                ),
                /* @__PURE__ */ a("div", { style: { fontSize: 13.5, color: t.muted, maxWidth: 380, lineHeight: 1.55 }, children: [
                  "Connect your tenant to start using the Investigator Agent — or",
                  " ",
                  /* @__PURE__ */ n(
                    "a",
                    {
                      href: "https://www.dynatrace.com/signup/",
                      target: "_blank",
                      rel: "noreferrer",
                      style: { color: t.accent, textDecoration: "none" },
                      children: "start a free trial ↗"
                    }
                  ),
                  " ",
                  "if you're new."
                ] })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ a(
          "div",
          {
            style: {
              width: "100%",
              maxWidth: 520,
              borderRadius: t.radiusLg,
              border: `1px solid ${t.border}`,
              background: t.bgElevated,
              padding: "24px 28px",
              display: "flex",
              flexDirection: "column",
              gap: 0
            },
            children: [
              /* @__PURE__ */ a("div", { style: { display: "flex", gap: 14 }, children: [
                /* @__PURE__ */ a("div", { style: { display: "flex", flexDirection: "column", alignItems: "center" }, children: [
                  /* @__PURE__ */ n(oe, { n: 1, active: C === 0, done: C > 0 }),
                  /* @__PURE__ */ n(ze, { done: C > 0 })
                ] }),
                /* @__PURE__ */ a("div", { style: { flex: 1, paddingBottom: 20 }, children: [
                  /* @__PURE__ */ a(
                    "div",
                    {
                      style: {
                        fontSize: 14,
                        fontWeight: 700,
                        color: C === 0 ? t.textStrong : t.muted,
                        marginBottom: C === 0 ? 10 : 0,
                        lineHeight: 1.3
                      },
                      children: [
                        "Install dtctl",
                        C > 0 && /* @__PURE__ */ n(
                          "span",
                          {
                            style: { marginLeft: 8, fontSize: 11.5, fontWeight: 400, color: t.ok },
                            children: "Installed"
                          }
                        )
                      ]
                    }
                  ),
                  C === 0 && /* @__PURE__ */ n("div", { style: { display: "flex", flexDirection: "column", gap: 10 }, children: s ? /* @__PURE__ */ n("div", { style: { fontSize: 12.5, color: t.muted }, children: "Checking for dtctl…" }) : /* @__PURE__ */ a(W, { children: [
                    /* @__PURE__ */ a("div", { style: { fontSize: 13, color: t.text, lineHeight: 1.5 }, children: [
                      "This app reads Dynatrace through ",
                      /* @__PURE__ */ n("strong", { children: "dtctl" }),
                      ", the open-source Dynatrace CLI. It takes about 30 seconds to install."
                    ] }),
                    /* @__PURE__ */ n(
                      "div",
                      {
                        style: {
                          padding: "10px 12px",
                          fontFamily: t.mono,
                          fontSize: 12.5,
                          background: t.bg,
                          borderRadius: t.radiusSm,
                          border: `1px solid ${t.border}`,
                          color: t.text,
                          userSelect: "all"
                        },
                        children: "brew install dynatrace-oss/tap/dtctl"
                      }
                    ),
                    /* @__PURE__ */ a("div", { style: { fontSize: 12, color: t.muted }, children: [
                      "No Homebrew?",
                      " ",
                      /* @__PURE__ */ n(
                        "a",
                        {
                          href: "https://github.com/dynatrace-oss/dtctl",
                          target: "_blank",
                          rel: "noreferrer",
                          style: { color: t.accent, textDecoration: "none" },
                          children: "Download a binary from GitHub ↗"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ n("div", { children: /* @__PURE__ */ n(T, { onClick: L, children: "I installed it — check again" }) })
                  ] }) })
                ] })
              ] }),
              /* @__PURE__ */ a("div", { style: { display: "flex", gap: 14 }, children: [
                /* @__PURE__ */ a("div", { style: { display: "flex", flexDirection: "column", alignItems: "center" }, children: [
                  /* @__PURE__ */ n(oe, { n: 2, active: C === 1, done: C > 1 }),
                  /* @__PURE__ */ n(ze, { done: C > 1 })
                ] }),
                /* @__PURE__ */ a("div", { style: { flex: 1, paddingBottom: 20 }, children: [
                  /* @__PURE__ */ a(
                    "div",
                    {
                      style: {
                        fontSize: 14,
                        fontWeight: 700,
                        color: C === 1 ? t.textStrong : t.muted,
                        marginBottom: C === 1 ? 14 : 0,
                        lineHeight: 1.3
                      },
                      children: [
                        "Connect your tenant",
                        C > 1 && /* @__PURE__ */ n("span", { style: { marginLeft: 8, fontSize: 11.5, fontWeight: 400, color: t.ok }, children: "Connected" })
                      ]
                    }
                  ),
                  C === 1 && /* @__PURE__ */ a("div", { style: { display: "flex", flexDirection: "column", gap: 14 }, children: [
                    /* @__PURE__ */ a("div", { style: { display: "flex", gap: 8 }, children: [
                      /* @__PURE__ */ n(
                        De,
                        {
                          active: h === "sso",
                          onClick: () => {
                            p("sso"), S(null);
                          },
                          label: "Sign in with Dynatrace",
                          sublabel: "Recommended · no token needed"
                        }
                      ),
                      /* @__PURE__ */ n(
                        De,
                        {
                          active: h === "token",
                          onClick: () => {
                            p("token"), S(null);
                          },
                          label: "Access token",
                          sublabel: "For automation or no SSO"
                        }
                      )
                    ] }),
                    h === "sso" && /* @__PURE__ */ a("div", { style: { display: "flex", flexDirection: "column", gap: 8 }, children: [
                      /* @__PURE__ */ n(re, { children: "Your environment URL" }),
                      /* @__PURE__ */ n(
                        "input",
                        {
                          value: d,
                          onChange: (D) => f(D.target.value),
                          placeholder: "https://abc12345.apps.dynatrace.com",
                          style: ie,
                          disabled: g,
                          autoFocus: !0,
                          onKeyDown: (D) => {
                            D.key === "Enter" && V();
                          }
                        }
                      ),
                      /* @__PURE__ */ n("div", { style: { fontSize: 12, color: t.muted }, children: "This is the URL you open in your browser to use Dynatrace." }),
                      v && /* @__PURE__ */ n(ae, { kind: "error", message: v.message, hint: v.hint }),
                      g && /* @__PURE__ */ n(
                        ae,
                        {
                          kind: "warn",
                          message: "A browser window opened — complete the Dynatrace login there.",
                          hint: "This may take a moment. Don't close this page."
                        }
                      ),
                      /* @__PURE__ */ n(
                        T,
                        {
                          variant: "primary",
                          onClick: () => void V(),
                          disabled: g,
                          style: { alignSelf: "flex-start" },
                          children: g ? "Waiting for browser sign-in…" : "Sign in with Dynatrace"
                        }
                      )
                    ] }),
                    h === "token" && /* @__PURE__ */ a("div", { style: { display: "flex", flexDirection: "column", gap: 8 }, children: [
                      /* @__PURE__ */ n(re, { children: "Access token" }),
                      /* @__PURE__ */ n(
                        "input",
                        {
                          value: b,
                          onChange: (D) => m(D.target.value),
                          placeholder: "dt0c01.XXXX…",
                          style: ie,
                          disabled: g,
                          autoFocus: !0
                        }
                      ),
                      /* @__PURE__ */ n(re, { children: "Environment URL" }),
                      /* @__PURE__ */ n(
                        "input",
                        {
                          value: u,
                          onChange: (D) => k(D.target.value),
                          placeholder: "https://abc12345.apps.dynatrace.com",
                          style: ie,
                          disabled: g,
                          onKeyDown: (D) => {
                            D.key === "Enter" && j();
                          }
                        }
                      ),
                      /* @__PURE__ */ n("div", { style: { fontSize: 12, color: t.muted }, children: "Tokens are validated live and stored owner-only — never logged or echoed." }),
                      v && /* @__PURE__ */ n(ae, { kind: "error", message: v.message, hint: v.hint }),
                      /* @__PURE__ */ n(
                        T,
                        {
                          variant: "primary",
                          onClick: () => void j(),
                          disabled: g,
                          style: { alignSelf: "flex-start" },
                          children: g ? "Validating…" : "Save token"
                        }
                      )
                    ] })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ a("div", { style: { display: "flex", gap: 14 }, children: [
                /* @__PURE__ */ n("div", { style: { display: "flex", flexDirection: "column", alignItems: "center" }, children: /* @__PURE__ */ n(oe, { n: 3, active: C === 2, done: C === 2 }) }),
                /* @__PURE__ */ a("div", { style: { flex: 1 }, children: [
                  /* @__PURE__ */ n(
                    "div",
                    {
                      style: {
                        fontSize: 14,
                        fontWeight: 700,
                        color: C === 2 ? t.textStrong : t.muted,
                        marginBottom: C === 2 ? 12 : 0,
                        lineHeight: 1.3
                      },
                      children: "You're connected"
                    }
                  ),
                  C === 2 && /* @__PURE__ */ a("div", { style: { display: "flex", flexDirection: "column", gap: 10 }, children: [
                    /* @__PURE__ */ n("div", { style: { fontSize: 13, color: t.text, lineHeight: 1.55 }, children: "Your Dynatrace tenant is connected. The Investigator Agent is loading your problems, services, and applications now." }),
                    /* @__PURE__ */ n("div", { children: /* @__PURE__ */ a(T, { variant: "primary", onClick: e, children: [
                      /* @__PURE__ */ n(R, { name: "spark", size: 14 }),
                      "Open Investigator Agent"
                    ] }) })
                  ] })
                ] })
              ] })
            ]
          }
        ),
        !r && /* @__PURE__ */ a(
          "div",
          {
            style: {
              marginTop: 20,
              fontSize: 12,
              color: t.muted,
              textAlign: "center",
              maxWidth: 480,
              lineHeight: 1.5
            },
            children: [
              "New to Dynatrace?",
              " ",
              /* @__PURE__ */ n(
                "a",
                {
                  href: "https://www.dynatrace.com/signup/",
                  target: "_blank",
                  rel: "noreferrer",
                  style: { color: t.accent, textDecoration: "none" },
                  children: "Start a free 15-day trial ↗"
                }
              ),
              " ",
              "— no credit card required."
            ]
          }
        ),
        !r && o && /* @__PURE__ */ n(
          "button",
          {
            onClick: o,
            style: {
              marginTop: 14,
              background: "none",
              border: "none",
              color: t.muted,
              fontSize: 12.5,
              cursor: "pointer",
              textDecoration: "underline",
              textUnderlineOffset: 3
            },
            children: "Just looking? Explore with demo data"
          }
        )
      ]
    }
  );
}
const wt = 6e4;
function Ct(e, r) {
  const [o, i] = x(null), [l, s] = x(null), [c, h] = x(!0), [p, d] = x(null), f = be(e), b = be(r);
  f.current = e, b.current = r;
  const m = U(async () => {
    try {
      i(await O("/status"));
    } catch {
    }
  }, []), u = U(async (w, v, S) => {
    try {
      const I = new URLSearchParams({ view: w, window: v });
      S && I.set("refresh", "1");
      const z = await O("/board?" + I.toString());
      if (w !== f.current || v !== b.current) return;
      s(z), d(null), h(!1);
    } catch (I) {
      if (w !== f.current || v !== b.current) return;
      d(I), h(!1);
    }
  }, []);
  P(() => {
    s(null), d(null), h(!0), u(e, r, !1), m();
  }, [e, r, u, m]), P(() => {
    const w = () => {
      document.visibilityState === "visible" && (u(f.current, b.current, !1), m());
    }, v = window.setInterval(w, wt), S = () => {
      document.visibilityState === "visible" && w();
    };
    return document.addEventListener("visibilitychange", S), () => {
      window.clearInterval(v), document.removeEventListener("visibilitychange", S);
    };
  }, [u, m]);
  const k = U(async () => {
    h(!0), await Promise.all([u(f.current, b.current, !0), m()]);
  }, [u, m]), g = U(async () => {
    s(null), d(null), h(!0), await Promise.all([u(f.current, b.current, !0), m()]);
  }, [u, m]);
  return { status: o, board: l, loading: c, error: p, refresh: k, reloadStatus: m, reload: g };
}
function Et() {
  const [e, r] = x("problems"), [o, i] = x("smart"), [l, s] = x("7d"), [c, h] = x(""), [p, d] = x(null), [f, b] = x(!1), [m, u] = x(!1), k = new URLSearchParams(window.location.search).get("preview"), g = k === "landing", w = k === "reauth", { status: v, board: S, loading: I, error: z, refresh: L, reload: $ } = Ct(e, l), C = (S == null ? void 0 : S.demo) ?? (v == null ? void 0 : v.demo) ?? !1, V = (!!(v != null && v.configured) || !!(S && !C) || m) && !g && !w, j = !!(z && !S && (z.code === "auth_expired" || /sign-in|invalid_grant|invalidated/i.test((z.message || "") + (z.hint || "")))), D = g || w || !V && !!v || j, y = S == null ? void 0 : S.smart_rank, E = A(e) && de(y), { unfilteredTotal: N, filteredTotal: ue } = G(() => {
    const H = Le(S, e);
    let fe = 0, me = 0;
    for (const ye of H)
      fe += ye.cards.length, me += ye.cards.filter((We) => Re(We, e, c)).length;
    return { unfilteredTotal: fe, filteredTotal: me };
  }, [S, e, c]), pe = G(() => {
    if (!A(e) || o !== "smart") return "";
    if (E) {
      const H = ct(y == null ? void 0 : y.ranked_at);
      return `Smart order · ranked ${H <= 0 ? "moments" : `${H} min`} ago by agent`;
    }
    return "Smart ranking pending · showing severity order · the ranking agent runs every 15 min";
  }, [e, o, E, y]), ge = V && (!z || S) && N > 0 && ue > 0;
  if (D) {
    const H = w || j && !g;
    return /* @__PURE__ */ n("div", { style: { position: "relative", display: "flex", flexDirection: "column", height: "100%", minHeight: 0, background: t.bg, color: t.text, fontFamily: t.font }, children: H ? /* @__PURE__ */ n(Ie, { reauth: !0, onConnected: () => void $() }) : /* @__PURE__ */ n(Ie, { onConnected: () => void $(), onExploreDemo: () => u(!0) }) });
  }
  return /* @__PURE__ */ a("div", { style: { position: "relative", display: "flex", flexDirection: "column", height: "100%", minHeight: 0, background: t.bg, color: t.text, fontFamily: t.font }, children: [
    C && /* @__PURE__ */ n(st, { onLeaveDemo: () => u(!1) }),
    /* @__PURE__ */ n(Fe, { environment: v == null ? void 0 : v.environment, demo: C }),
    /* @__PURE__ */ n(
      lt,
      {
        view: e,
        onView: (H) => {
          r(H), d(null);
        },
        sort: o,
        onSort: i,
        win: l,
        onWin: s,
        search: c,
        onSearch: h,
        onRefresh: () => void L(),
        onSettings: () => b(!0),
        refreshing: I,
        smartFresh: E
      }
    ),
    pe && ge && /* @__PURE__ */ n("div", { style: { fontSize: 11.5, color: t.muted, padding: "8px 16px 0" }, children: pe }),
    z && S && ge && /* @__PURE__ */ a("div", { style: { fontSize: 11.5, color: t.warn, padding: "8px 16px 0", display: "flex", alignItems: "center", gap: 6 }, children: [
      /* @__PURE__ */ n(
        "span",
        {
          style: { display: "inline-block", width: 6, height: 6, borderRadius: 9999, background: t.warn },
          "aria-hidden": !0
        }
      ),
      "Showing last loaded data · couldn’t refresh (",
      z.hint || z.message,
      ")"
    ] }),
    z && !S ? /* @__PURE__ */ n(
      ne,
      {
        icon: "warning",
        title: "Couldn't load the board",
        body: z.hint || z.message,
        action: { label: "Retry", onClick: () => void L() }
      }
    ) : I && !S ? /* @__PURE__ */ n("div", { style: { margin: "auto", color: t.muted, fontSize: 13, padding: 40 }, children: "Loading board…" }) : N === 0 ? /* @__PURE__ */ n(
      ne,
      {
        icon: "spark",
        title: "Nothing in this window",
        body: A(e) ? "No problems in the selected lookback window. Try widening it (e.g. 30d)." : "No entities found for this view.",
        action: A(e) && l !== "30d" ? { label: "Widen to 30d", onClick: () => s("30d") } : void 0
      }
    ) : ue === 0 ? /* @__PURE__ */ n(
      ne,
      {
        icon: "search",
        title: "No matches",
        body: `Nothing matches “${c}”.`,
        action: { label: "Clear search", onClick: () => h("") }
      }
    ) : /* @__PURE__ */ n(gt, { board: S, view: e, sort: o, search: c, onSelect: d }),
    p && /* @__PURE__ */ n(St, { selection: p, envUrl: v == null ? void 0 : v.environment, onClose: () => d(null) }),
    f && /* @__PURE__ */ n(
      kt,
      {
        status: v,
        onClose: () => b(!1),
        onChanged: () => void $()
      }
    )
  ] });
}
export {
  Et as default
};
