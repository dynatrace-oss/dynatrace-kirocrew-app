import { T } from '../theme'
import { Chip, RankBadge } from './primitives'
import { Icon } from './Icon'
import { affectedCount, categoryTone, durationMs, rootCauseText } from '../api'
import type { ProblemCard as ProblemCardT } from '../api'
import { fmtAge, fmtDuration } from '../format'

export function ProblemCard({
  card,
  rankPosition,
  rationale,
  onClick,
}: {
  card: ProblemCardT
  rankPosition?: number
  rationale?: string
  onClick: () => void
}) {
  const tone = categoryTone(card.category)
  const closed = (card.status || '').toUpperCase() === 'CLOSED'
  const affected = affectedCount(card)
  const rc = rootCauseText(card)
  const title = card.name || card.title || card.display_id

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        padding: 12,
        borderRadius: T.radiusMd,
        border: `1px solid ${T.border}`,
        background: T.card,
        color: T.cardFg,
        cursor: 'pointer',
        boxShadow: T.shadowSm,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontFamily: T.mono, fontSize: 11, color: T.muted }}>{card.display_id}</span>
        {typeof rankPosition === 'number' && (
          <RankBadge
            position={rankPosition}
            title={
              rationale
                ? `Agent rank #${rankPosition} – ${rationale}`
                : `Ranked #${rankPosition} by the smart-ranking agent`
            }
          />
        )}
        <span style={{ flex: 1 }} />
        {card.category && <Chip tone={tone}>{card.category}</Chip>}
      </div>

      <div style={{ fontSize: 13.5, fontWeight: 600, color: T.textStrong, lineHeight: 1.3 }}>{title}</div>

      {rc && (
        <div style={{ fontSize: 12, color: T.muted, display: 'flex', gap: 5, alignItems: 'baseline' }}>
          <span style={{ color: T.mutedStrong, fontWeight: 500 }}>Root cause:</span>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{rc}</span>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 12, color: T.muted }}>
        <span title="Affected entities">
          {affected} affected {affected === 1 ? 'entity' : 'entities'}
        </span>
        <span style={{ flex: 1 }} />
        <span title={closed ? 'Duration' : 'Age'} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <Icon name="spark" size={12} color={T.muted} />
          {closed ? fmtDuration(durationMs(card)) : fmtAge(card.start)}
        </span>
      </div>
    </div>
  )
}
