import { T } from '../theme'
import { Button, InfoDot, SegmentedControl, Select } from './primitives'
import { Icon } from './Icon'
import { SORTS, VIEWS, WINDOWS } from '../api'
import type { SortKey, ViewKey, WindowKey } from '../api'

const VIEW_TITLES: Record<ViewKey, string> = {
  problems: 'Davis problems from your tenant',
  services: 'Entities grouped by health, derived from active problems affecting them',
  applications: 'Entities grouped by health, derived from active problems affecting them',
}

const SORT_TIP =
  'Smart = a KiroCrew agent re-ranks active problems every 15 min by urgency ' +
  '(category, blast radius, root cause, age) and explains each position – hover a ' +
  "card's #N badge to see why. Falls back to Severity until the first ranking " +
  'arrives ("warming up"). Other options are fixed sorts.'

const WINDOW_TIP =
  'Time window for the problem history: bounds the query and the Recently closed ' +
  'column. Active problems always show.'

export function Toolbar({
  view,
  onView,
  sort,
  onSort,
  win,
  onWin,
  search,
  onSearch,
  onRefresh,
  onSettings,
  refreshing,
  smartFresh,
}: {
  view: ViewKey
  onView: (v: ViewKey) => void
  sort: SortKey
  onSort: (s: SortKey) => void
  win: WindowKey
  onWin: (w: WindowKey) => void
  search: string
  onSearch: (q: string) => void
  onRefresh: () => void
  onSettings: () => void
  refreshing: boolean
  smartFresh: boolean
}) {
  const sortOptions = SORTS.map((s) =>
    s.key === 'smart' && !smartFresh ? { key: s.key, label: 'Smart (warming up)' } : s,
  )
  const windowOptions = WINDOWS.map((w) => ({ key: w, label: w }))
  const viewOptions = VIEWS.map((v) => ({ ...v, title: VIEW_TITLES[v.key] }))

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        flexWrap: 'wrap',
        padding: '0 16px 12px',
        borderBottom: `1px solid ${T.border}`,
      }}
    >
      <SegmentedControl value={view} onChange={onView} options={viewOptions} />

      <span style={{ flex: 1 }} />

      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
        <Select<SortKey> value={sort} onChange={onSort} options={sortOptions} title="Sort" ariaLabel="Sort cards" />
        <InfoDot tip={SORT_TIP} />
      </span>

      {view === 'problems' && (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
          <Select<WindowKey> value={win} onChange={onWin} options={windowOptions} title="Lookback window" ariaLabel="Lookback window" />
          <InfoDot tip={WINDOW_TIP} />
        </span>
      )}

      <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
        <span style={{ position: 'absolute', left: 8, display: 'inline-flex', color: T.muted, pointerEvents: 'none' }}>
          <Icon name="search" size={14} />
        </span>
        <input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search…"
          aria-label="Search cards"
          style={{
            padding: '6px 10px 6px 28px',
            fontSize: 13,
            width: 180,
            borderRadius: T.radiusMd,
            border: `1px solid ${T.border}`,
            background: T.bgElevated,
            color: T.text,
          }}
        />
      </div>

      <Button onClick={onRefresh} disabled={refreshing} title="Refresh (bypass cache)">
        <Icon name="refresh" size={14} />
        Refresh
      </Button>

      <Button variant="ghost" onClick={onSettings} title="Settings" style={{ padding: '6px 8px' }}>
        <Icon name="settings" size={16} />
      </Button>
    </div>
  )
}
