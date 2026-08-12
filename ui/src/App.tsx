import { useMemo, useState } from 'react'
import { T } from './theme'
import { PageHeader } from './components/PageHeader'
import { Toolbar } from './components/Toolbar'
import { DemoBanner } from './components/DemoBanner'
import { Board } from './components/Board'
import type { Selection } from './components/Board'
import { Drawer } from './components/Drawer'
import { SettingsOverlay } from './components/SettingsOverlay'
import { EmptyState } from './components/EmptyState'
import { useBoard } from './useBoard'
import { isProblemView, isSmartFresh, matchesSearch, normalizeColumns } from './api'
import type { SortKey, ViewKey, WindowKey } from './api'
import { minsSince } from './format'

export default function Dynatrace() {
  const [view, setView] = useState<ViewKey>('problems')
  const [sort, setSort] = useState<SortKey>('smart')
  const [win, setWin] = useState<WindowKey>('7d')
  const [search, setSearch] = useState('')
  const [selection, setSelection] = useState<Selection | null>(null)
  const [settingsOpen, setSettingsOpen] = useState(false)

  const { status, board, loading, error, refresh, reloadStatus } = useBoard(view, win)

  const demo = board?.demo ?? status?.demo ?? false
  // A loaded board always wins over a transient "not configured" status probe.
  const hasAccess = Boolean(status?.configured) || demo || Boolean(board)
  const rank = board?.smart_rank
  const smartFresh = isProblemView(view) && isSmartFresh(rank)

  // totals for empty-state selection
  const { unfilteredTotal, filteredTotal } = useMemo(() => {
    const cols = normalizeColumns(board, view)
    let raw = 0
    let filt = 0
    for (const c of cols) {
      raw += c.cards.length
      filt += c.cards.filter((card) => matchesSearch(card, view, search)).length
    }
    return { unfilteredTotal: raw, filteredTotal: filt }
  }, [board, view, search])

  const smartCaption = useMemo(() => {
    if (!isProblemView(view) || sort !== 'smart') return ''
    if (smartFresh) {
      const m = minsSince(rank?.ranked_at)
      return `Smart order · ranked ${m <= 0 ? 'moments' : `${m} min`} ago by agent`
    }
    return 'Smart ranking pending · showing severity order · the ranking agent runs every 15 min'
  }, [view, sort, smartFresh, rank])

  const showBoard = hasAccess && (!error || board) && unfilteredTotal > 0 && filteredTotal > 0

  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, background: T.bg, color: T.text, fontFamily: T.font }}>
      {demo && <DemoBanner onSettings={() => setSettingsOpen(true)} />}

      <PageHeader environment={status?.environment} demo={demo} />

      <Toolbar
        view={view}
        onView={(v) => {
          setView(v)
          setSelection(null)
        }}
        sort={sort}
        onSort={setSort}
        win={win}
        onWin={setWin}
        search={search}
        onSearch={setSearch}
        onRefresh={() => void refresh()}
        onSettings={() => setSettingsOpen(true)}
        refreshing={loading}
        smartFresh={smartFresh}
      />

      {smartCaption && showBoard && (
        <div style={{ fontSize: 11.5, color: T.muted, padding: '8px 16px 0' }}>{smartCaption}</div>
      )}

      {/* Subtle stale indicator: a refresh/poll failed but we still have the last
          good board, so keep showing it rather than blanking. */}
      {error && board && showBoard && (
        <div style={{ fontSize: 11.5, color: T.warn, padding: '8px 16px 0', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span
            style={{ display: 'inline-block', width: 6, height: 6, borderRadius: 9999, background: T.warn }}
            aria-hidden
          />
          Showing last loaded data · couldn’t refresh ({error.hint || error.message})
        </div>
      )}

      {/* Body */}
      {!hasAccess && status ? (
        <EmptyState
          icon="settings"
          title="Connect Dynatrace"
          body="No Dynatrace credentials are configured. Add an access token in Settings to load your tenant."
          action={{ label: 'Open Settings', onClick: () => setSettingsOpen(true) }}
        />
      ) : error && !board && (error.code === 'auth_expired' || /sign-in|invalid_grant|invalidated/i.test((error.message || '') + (error.hint || ''))) ? (
        <EmptyState
          icon="warning"
          title="Dynatrace sign-in expired"
          body="Your sign-in was invalidated and needs a quick renewal — open Settings and click 'Sign in with Dynatrace' to reconnect in the browser."
          action={{ label: 'Open Settings', onClick: () => setSettingsOpen(true) }}
        />
      ) : error && !board ? (
        <EmptyState
          icon="warning"
          title="Couldn't load the board"
          body={error.hint || error.message}
          action={{ label: 'Retry', onClick: () => void refresh() }}
        />
      ) : loading && !board ? (
        <div style={{ margin: 'auto', color: T.muted, fontSize: 13, padding: 40 }}>Loading board…</div>
      ) : unfilteredTotal === 0 ? (
        <EmptyState
          icon="spark"
          title="Nothing in this window"
          body={
            isProblemView(view)
              ? 'No problems in the selected lookback window. Try widening it (e.g. 30d).'
              : 'No entities found for this view.'
          }
          action={
            isProblemView(view) && win !== '30d'
              ? { label: 'Widen to 30d', onClick: () => setWin('30d') }
              : undefined
          }
        />
      ) : filteredTotal === 0 ? (
        <EmptyState
          icon="search"
          title="No matches"
          body={`Nothing matches “${search}”.`}
          action={{ label: 'Clear search', onClick: () => setSearch('') }}
        />
      ) : (
        <Board board={board} view={view} sort={sort} search={search} onSelect={setSelection} />
      )}

      {selection && (
        <Drawer selection={selection} envUrl={status?.environment} onClose={() => setSelection(null)} />
      )}

      {settingsOpen && (
        <SettingsOverlay
          status={status}
          onClose={() => setSettingsOpen(false)}
          onChanged={() => void reloadStatus()}
        />
      )}
    </div>
  )
}
