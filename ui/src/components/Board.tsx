import { useEffect, useMemo, useState } from 'react'
import { T } from '../theme'
import { ColumnView } from './ColumnView'
import { ProblemCard } from './ProblemCard'
import { EntityCard } from './EntityCard'
import {
  cardId,
  isProblemView,
  isSmartFresh,
  matchesSearch,
  normalizeColumns,
  sortCards,
} from '../api'
import type { BoardCard, BoardResponse, EntityCard as EntityCardT, ProblemCard as ProblemCardT, SortKey, ViewKey } from '../api'

export interface Selection {
  kind: 'problem' | 'entity'
  id: string
  // The board card that opened the drawer, so the drawer can still show facts
  // (title, category, status, etc.) even if the live detail fetch fails.
  card?: ProblemCardT | EntityCardT
}

// Per-column explainers, keyed by the normalized column key.
const COLUMN_TIPS: Record<string, string> = {
  new: 'Active, started in the last 24h',
  ongoing: 'Active for more than 24h',
  maintenance: 'Active during a maintenance window',
  closed: 'Closed within the selected time window',
  unhealthy: '≥1 active problem affects this entity',
  watch: 'A problem affecting it closed in the last 24h',
  healthy: 'No active or recent problems',
}

export function Board({
  board,
  view,
  sort,
  search,
  onSelect,
}: {
  board: BoardResponse | null
  view: ViewKey
  sort: SortKey
  search: string
  onSelect: (sel: Selection) => void
}) {
  const rank = board?.smart_rank
  const smartFresh = isSmartFresh(rank)

  // smart-rank position lookup (1-based) for the badge, problems view only
  const rankPos = useMemo(() => {
    const m = new Map<string, number>()
    if (isProblemView(view) && smartFresh && rank?.order) {
      rank.order.forEach((id, i) => m.set(id, i + 1))
    }
    return m
  }, [view, smartFresh, rank])

  const columns = useMemo(() => {
    const cols = normalizeColumns(board, view)
    return cols.map((c) => {
      const filtered = c.cards.filter((card) => matchesSearch(card, view, search))
      const sorted = sortCards(filtered, view, sort, rank)
      return {
        key: c.key,
        label: c.label,
        cards: sorted,
        total: c.total,
        totalIsLowerBound: c.totalIsLowerBound,
      }
    })
  }, [board, view, sort, search, rank])

  // Progressive rendering: mounting hundreds of cards per column makes big
  // boards (30d window, healthy-services column) sluggish. Render the first
  // chunk and grow per column on demand.
  const CHUNK = 40
  const [visible, setVisible] = useState<Record<string, number>>({})
  useEffect(() => setVisible({}), [board, view, sort, search])

  return (
    <div
      style={{
        display: 'flex',
        gap: 12,
        padding: '4px 16px 16px',
        overflowX: 'auto',
        flex: 1,
        minHeight: 0,
        alignItems: 'stretch',
      }}
    >
      {columns.map((col) => {
        const shown = visible[col.key] ?? CHUNK
        const cards = col.cards.slice(0, shown)
        const remaining = col.cards.length - cards.length
        // Server total (bucket size before payload capping) wins over the
        // client count when present.
        const total = typeof col.total === 'number' ? Math.max(col.total, col.cards.length) : col.cards.length
        return (
          <ColumnView
            key={col.key}
            label={col.label}
            count={cards.length}
            total={total}
            totalIsLowerBound={col.totalIsLowerBound}
            tip={COLUMN_TIPS[col.key]}
            footer={
              remaining > 0 ? (
                <button
                  onClick={() => setVisible((v) => ({ ...v, [col.key]: shown + CHUNK }))}
                  style={{
                    fontSize: 12,
                    padding: '7px 0',
                    borderRadius: T.radiusSm,
                    border: `1px solid ${T.border}`,
                    background: 'transparent',
                    color: T.accent,
                    cursor: 'pointer',
                  }}
                >
                  Show {Math.min(remaining, CHUNK)} more ({remaining} hidden)
                </button>
              ) : null
            }
          >
            {cards.map((card: BoardCard) => {
              const id = cardId(card, view)
              if (isProblemView(view)) {
                const p = card as ProblemCardT
                const pos = rankPos.get(p.display_id)
                return (
                  <ProblemCard
                    key={id}
                    card={p}
                    rankPosition={pos}
                    rationale={pos ? rank?.rationales?.[p.display_id] : undefined}
                    onClick={() => onSelect({ kind: 'problem', id: p.display_id, card: p })}
                  />
                )
              }
              const e = card as EntityCardT
              return <EntityCard key={id} card={e} onClick={() => onSelect({ kind: 'entity', id: e.id, card: e })} />
            })}
          </ColumnView>
        )
      })}
      {columns.length === 0 && (
        <div style={{ margin: 'auto', color: T.muted, fontSize: 13 }}>No columns.</div>
      )}
    </div>
  )
}
