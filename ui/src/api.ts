// Core client + shared types + pure helpers for the Dynatrace board UI.
// The private @kirocrew/app-sdk is not installable in this build environment,
// so we talk to the gateway-served backend through the documented relative base
// Relative base so the app works behind the gateway proxy on any host.

export const API_BASE = '/apps/dynatrace/api'

export interface ApiError extends Error {
  status?: number
  code?: string
  hint?: string | null
  apiError?: boolean
}

export async function api<T = unknown>(path: string, opts?: RequestInit): Promise<T> {
  const r = await fetch(API_BASE + path, {
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  })
  if (!r.ok) {
    let code = ''
    let message = `Request failed (${r.status})`
    let hint: string | null = null
    try {
      const j = (await r.json()) as { error?: { code?: string; message?: string; hint?: string | null } }
      if (j && j.error) {
        code = j.error.code || ''
        message = j.error.message || message
        hint = j.error.hint ?? null
      }
    } catch {
      /* non-JSON error body */
    }
    const e = new Error(message) as ApiError
    e.status = r.status
    e.code = code
    e.hint = hint
    e.apiError = true
    throw e
  }
  if (r.status === 204) return null as T
  return (await r.json()) as T
}

// ---------------------------------------------------------------------------
// Types (coded defensively — every backend field is optional and re-derivable)
// ---------------------------------------------------------------------------

export type ViewKey = 'problems' | 'services' | 'applications'
export type SortKey = 'smart' | 'severity' | 'newest' | 'affected' | 'duration'
export type WindowKey = '24h' | '3d' | '7d' | '30d'

export const VIEWS: { key: ViewKey; label: string }[] = [
  { key: 'problems', label: 'Problems' },
  { key: 'services', label: 'Services' },
  { key: 'applications', label: 'Applications' },
]

export const SORTS: { key: SortKey; label: string }[] = [
  { key: 'smart', label: 'Smart' },
  { key: 'severity', label: 'Severity' },
  { key: 'newest', label: 'Newest' },
  { key: 'affected', label: 'Most affected' },
  { key: 'duration', label: 'Longest running' },
]

export const WINDOWS: WindowKey[] = ['24h', '3d', '7d', '30d']

export interface Status {
  configured?: boolean
  source?: string
  masked?: string
  environment?: string
  demo?: boolean
}

export interface SmartRank {
  fresh?: boolean
  ranked_at?: string | number
  order?: string[]
  rationales?: Record<string, string>
}

export interface ProblemCard {
  display_id: string
  name?: string
  title?: string
  category?: string
  status?: string
  severity?: string | number
  start?: string
  end?: string | null
  affected_ids?: string[]
  affected_names?: string[]
  affected_count?: number
  root_cause?: string | string[]
  maintenance?: boolean
  last_update?: string
  column?: string
}

export interface EntityCard {
  id: string
  name?: string
  type?: string
  tags?: string[]
  active_problems?: number
  recent_problems?: number
  column?: string
}

export type BoardCard = ProblemCard | EntityCard

export interface RawColumn {
  key: string
  label?: string
  cards?: BoardCard[]
}

export interface BoardResponse {
  view?: ViewKey
  window?: WindowKey
  demo?: boolean
  columns?: RawColumn[] | Record<string, BoardCard[]>
  cards?: BoardCard[]
  smart_rank?: SmartRank
}

export interface ProblemDetail extends ProblemCard {
  description?: string
  event_id?: string
  event?: { id?: string }
  affected_entities?: { id?: string; name?: string; type?: string }[]
  environment?: string
  deep_link?: string
  url?: string
}

export interface RelatedProblem {
  display_id: string
  name?: string
  title?: string
  category?: string
  status?: string
  start?: string
}

export interface EntityDetail extends EntityCard {
  environment?: string
  deep_link?: string
  url?: string
  related_problems?: RelatedProblem[] | { active?: RelatedProblem[]; recent?: RelatedProblem[] }
  active?: RelatedProblem[]
  recent?: RelatedProblem[]
}

export interface HandoffResponse {
  prompt?: string
  message?: string
  slotKey?: string
  seeded?: boolean
}

// ---------------------------------------------------------------------------
// Column definitions (client-side labels + order) per view
// ---------------------------------------------------------------------------

export interface ColumnDef {
  key: string
  label: string
  aliases: string[]
}

export const PROBLEM_COLUMNS: ColumnDef[] = [
  { key: 'new', label: 'New', aliases: ['new'] },
  { key: 'ongoing', label: 'Ongoing', aliases: ['ongoing'] },
  {
    key: 'maintenance',
    label: 'Under maintenance',
    aliases: ['maintenance', 'under_maintenance', 'under-maintenance', 'underMaintenance'],
  },
  {
    key: 'closed',
    label: 'Recently closed',
    aliases: ['closed', 'recently_closed', 'recently-closed', 'recentlyClosed'],
  },
]

export const ENTITY_COLUMNS: ColumnDef[] = [
  { key: 'unhealthy', label: 'Unhealthy', aliases: ['unhealthy'] },
  { key: 'watch', label: 'Watch', aliases: ['watch'] },
  { key: 'healthy', label: 'Healthy', aliases: ['healthy'] },
]

export function columnDefsFor(view: ViewKey): ColumnDef[] {
  return view === 'problems' ? PROBLEM_COLUMNS : ENTITY_COLUMNS
}

// ---------------------------------------------------------------------------
// Pure helpers: identity, severity, timing, category tone
// ---------------------------------------------------------------------------

export function isProblemView(view: ViewKey): boolean {
  return view === 'problems'
}

export function cardId(card: BoardCard, view: ViewKey): string {
  return isProblemView(view) ? (card as ProblemCard).display_id : (card as EntityCard).id
}

export function cardName(card: BoardCard, view: ViewKey): string {
  if (isProblemView(view)) {
    const p = card as ProblemCard
    return p.name || p.title || p.display_id
  }
  const e = card as EntityCard
  return e.name || e.id
}

export const SEVERITY_WEIGHT: Record<string, number> = {
  AVAILABILITY: 4,
  ERROR: 3,
  RESOURCE_CONTENTION: 2,
  SLOWDOWN: 1,
}

export function catWeight(cat?: string): number {
  return SEVERITY_WEIGHT[(cat || '').toUpperCase()] ?? 0
}

export function affectedCount(c: ProblemCard): number {
  return c.affected_count ?? c.affected_ids?.length ?? c.affected_names?.length ?? 0
}

export function startMs(c: ProblemCard): number {
  return c.start ? Date.parse(c.start) || 0 : 0
}

export function durationMs(c: ProblemCard): number {
  const s = startMs(c)
  if (!s) return 0
  const e = c.end ? Date.parse(c.end) || Date.now() : Date.now()
  return Math.max(0, e - s)
}

export type Tone = 'danger' | 'warn' | 'accent' | 'ok' | 'muted'

export function categoryTone(cat?: string): Tone {
  const c = (cat || '').toUpperCase()
  if (c === 'ERROR' || c === 'AVAILABILITY') return 'danger'
  if (c === 'SLOWDOWN') return 'warn'
  if (c === 'RESOURCE_CONTENTION') return 'accent'
  return 'muted'
}

export function rootCauseText(c: ProblemCard): string {
  const rc = c.root_cause
  if (!rc) return ''
  return Array.isArray(rc) ? rc.filter(Boolean).join(', ') : String(rc)
}

// ---------------------------------------------------------------------------
// Column normalization + client-side bucketing fallback
// ---------------------------------------------------------------------------

export interface NormalizedColumn {
  key: string
  label: string
  cards: BoardCard[]
  total?: number
  totalIsLowerBound?: boolean
}

function collectAllCards(board: BoardResponse): BoardCard[] {
  const out: BoardCard[] = []
  if (Array.isArray(board.columns)) {
    for (const col of board.columns) if (Array.isArray(col.cards)) out.push(...col.cards)
  } else if (board.columns && typeof board.columns === 'object') {
    for (const v of Object.values(board.columns)) if (Array.isArray(v)) out.push(...v)
  }
  if (Array.isArray(board.cards)) out.push(...board.cards)
  return out
}

function deriveProblemColumn(c: ProblemCard): string {
  const status = (c.status || '').toUpperCase()
  if (status === 'CLOSED') return 'closed'
  if (c.maintenance) return 'maintenance'
  const s = startMs(c)
  const ageH = s ? (Date.now() - s) / 3_600_000 : 0
  return ageH < 24 ? 'new' : 'ongoing'
}

function deriveEntityColumn(c: EntityCard): string {
  if ((c.active_problems ?? 0) > 0) return 'unhealthy'
  if ((c.recent_problems ?? 0) > 0) return 'watch'
  return 'healthy'
}

/**
 * Normalize the board response into the view's ordered columns.
 * Accepts columns as an array (with keys) or a keyed object; if the backend
 * only returns a flat card list, buckets client-side per DESIGN definitions.
 */
export function normalizeColumns(board: BoardResponse | null, view: ViewKey): NormalizedColumn[] {
  const defs = columnDefsFor(view)
  const byKey = new Map<string, BoardCard[]>()
  defs.forEach((d) => byKey.set(d.key, []))

  const aliasToKey = new Map<string, string>()
  defs.forEach((d) => d.aliases.forEach((a) => aliasToKey.set(a.toLowerCase(), d.key)))

  const totals = new Map<string, { total?: number; lower?: boolean }>()
  const pushInto = (rawKey: string, cards: BoardCard[], total?: number, lower?: boolean) => {
    const key = aliasToKey.get((rawKey || '').toLowerCase())
    if (!key) return
    byKey.get(key)!.push(...cards)
    if (typeof total === 'number') totals.set(key, { total, lower })
  }

  let matchedAny = false
  if (board) {
    if (Array.isArray(board.columns)) {
      for (const col of board.columns) {
        if (aliasToKey.has((col.key || '').toLowerCase())) matchedAny = true
        pushInto(col.key, Array.isArray(col.cards) ? col.cards : [], (col as { total?: number }).total, (col as { total_is_lower_bound?: boolean }).total_is_lower_bound)
      }
    } else if (board.columns && typeof board.columns === 'object') {
      for (const [k, v] of Object.entries(board.columns)) {
        if (aliasToKey.has(k.toLowerCase())) matchedAny = true
        pushInto(k, Array.isArray(v) ? v : [])
      }
    }
  }

  // Fallback: nothing matched the expected keys → bucket every card client-side.
  if (board && !matchedAny) {
    const all = collectAllCards(board)
    for (const card of all) {
      const key = isProblemView(view)
        ? deriveProblemColumn(card as ProblemCard)
        : deriveEntityColumn(card as EntityCard)
      byKey.get(key)?.push(card)
    }
  }

  return defs.map((d) => ({ key: d.key, label: d.label, cards: byKey.get(d.key) || [],
    total: totals.get(d.key)?.total, totalIsLowerBound: totals.get(d.key)?.lower }))
}

// ---------------------------------------------------------------------------
// Sorting
// ---------------------------------------------------------------------------

export function isSmartFresh(rank?: SmartRank): boolean {
  return Boolean(rank && rank.fresh && Array.isArray(rank.order) && rank.order.length > 0)
}

function severityCompare(a: ProblemCard, b: ProblemCard): number {
  const w = catWeight(b.category) - catWeight(a.category)
  if (w !== 0) return w
  const af = affectedCount(b) - affectedCount(a)
  if (af !== 0) return af
  return startMs(b) - startMs(a)
}

function sortProblems(cards: ProblemCard[], sort: SortKey, rank?: SmartRank): ProblemCard[] {
  const arr = [...cards]
  if (sort === 'smart' && isSmartFresh(rank)) {
    const order = rank!.order!
    const pos = new Map<string, number>()
    order.forEach((id, i) => pos.set(id, i))
    const ranked = arr.filter((c) => pos.has(c.display_id)).sort((a, b) => pos.get(a.display_id)! - pos.get(b.display_id)!)
    const unranked = arr.filter((c) => !pos.has(c.display_id)).sort(severityCompare)
    return [...ranked, ...unranked]
  }
  if (sort === 'newest') return arr.sort((a, b) => startMs(b) - startMs(a))
  if (sort === 'affected') return arr.sort((a, b) => affectedCount(b) - affectedCount(a) || startMs(b) - startMs(a))
  if (sort === 'duration') return arr.sort((a, b) => durationMs(b) - durationMs(a))
  // 'severity' and smart-fallback
  return arr.sort(severityCompare)
}

function sortEntities(cards: EntityCard[], sort: SortKey): EntityCard[] {
  const arr = [...cards]
  const active = (c: EntityCard) => c.active_problems ?? 0
  const recent = (c: EntityCard) => c.recent_problems ?? 0
  const name = (c: EntityCard) => (c.name || c.id || '').toLowerCase()
  if (sort === 'affected' || sort === 'severity' || sort === 'smart') {
    return arr.sort((a, b) => active(b) - active(a) || recent(b) - recent(a) || name(a).localeCompare(name(b)))
  }
  // 'newest' / 'duration' have no entity analogue → stable name order
  return arr.sort((a, b) => name(a).localeCompare(name(b)))
}

export function sortCards(cards: BoardCard[], view: ViewKey, sort: SortKey, rank?: SmartRank): BoardCard[] {
  return isProblemView(view)
    ? (sortProblems(cards as ProblemCard[], sort, rank) as BoardCard[])
    : (sortEntities(cards as EntityCard[], sort) as BoardCard[])
}

// ---------------------------------------------------------------------------
// Search filter
// ---------------------------------------------------------------------------

export function matchesSearch(card: BoardCard, view: ViewKey, q: string): boolean {
  const needle = q.trim().toLowerCase()
  if (!needle) return true
  const hay: string[] = []
  if (isProblemView(view)) {
    const p = card as ProblemCard
    hay.push(p.display_id, p.name || '', p.title || '', p.category || '', rootCauseText(p))
    if (p.affected_names) hay.push(...p.affected_names)
  } else {
    const e = card as EntityCard
    hay.push(e.id, e.name || '', e.type || '')
    if (e.tags) hay.push(...e.tags)
  }
  return hay.join(' \u0001 ').toLowerCase().includes(needle)
}
