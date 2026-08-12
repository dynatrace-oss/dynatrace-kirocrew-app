// Small, dependency-free time/duration formatting helpers.

function toMs(v?: string | number | null): number {
  if (v == null) return 0
  if (typeof v === 'number') return v < 1e12 ? v * 1000 : v // seconds vs ms heuristic
  const p = Date.parse(v)
  return Number.isNaN(p) ? 0 : p
}

/** Compact duration like "2h 15m", "3d 4h", "45m", "<1m". */
export function fmtDuration(ms: number): string {
  if (!ms || ms < 0) return '—'
  const mins = Math.floor(ms / 60000)
  if (mins < 1) return '<1m'
  const d = Math.floor(mins / 1440)
  const h = Math.floor((mins % 1440) / 60)
  const m = mins % 60
  if (d > 0) return h > 0 ? `${d}d ${h}h` : `${d}d`
  if (h > 0) return m > 0 ? `${h}h ${m}m` : `${h}h`
  return `${m}m`
}

/** Age from an ISO start to now, formatted compactly. */
export function fmtAge(start?: string): string {
  const s = toMs(start)
  if (!s) return '—'
  return fmtDuration(Date.now() - s)
}

/** "5 min ago", "2 hr ago", "3 days ago", "just now". */
export function fmtAgo(v?: string | number | null): string {
  const t = toMs(v)
  if (!t) return ''
  const secs = Math.floor((Date.now() - t) / 1000)
  if (secs < 45) return 'just now'
  const mins = Math.round(secs / 60)
  if (mins < 60) return `${mins} min ago`
  const hrs = Math.round(mins / 60)
  if (hrs < 24) return `${hrs} hr ago`
  const days = Math.round(hrs / 24)
  return `${days} day${days === 1 ? '' : 's'} ago`
}

/** Minutes since a timestamp (for the "ranked N min ago" caption). */
export function minsSince(v?: string | number | null): number {
  const t = toMs(v)
  if (!t) return 0
  return Math.max(0, Math.round((Date.now() - t) / 60000))
}

/** Locale date-time for detail panels; empty string when absent. */
export function fmtDateTime(v?: string | null): string {
  const t = toMs(v)
  if (!t) return '—'
  try {
    return new Date(t).toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return new Date(t).toISOString()
  }
}
