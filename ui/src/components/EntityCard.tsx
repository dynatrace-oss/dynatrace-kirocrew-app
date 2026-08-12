import { T } from '../theme'
import { Tag } from './primitives'
import type { EntityCard as EntityCardT } from '../api'

export function EntityCard({ card, onClick }: { card: EntityCardT; onClick: () => void }) {
  const tags = card.tags || []
  const shown = tags.slice(0, 3)
  const overflow = tags.length - shown.length
  const active = card.active_problems ?? 0
  const recent = card.recent_problems ?? 0
  const name = card.name || card.id

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
      <div style={{ fontSize: 13.5, fontWeight: 600, color: T.textStrong, lineHeight: 1.3 }}>{name}</div>

      {shown.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {shown.map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
          {overflow > 0 && <Tag>+{overflow}</Tag>}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 12, color: T.muted }}>
        {active > 0 && <span style={{ color: T.danger, fontWeight: 600 }}>{active} active</span>}
        {recent > 0 && <span style={{ color: T.warn, fontWeight: 600 }}>{recent} recent</span>}
        {active === 0 && recent === 0 && <span style={{ color: T.ok, fontWeight: 600 }}>Healthy</span>}
        <span style={{ flex: 1 }} />
        <span style={{ fontFamily: T.mono, fontSize: 10.5, color: T.muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 150 }}>
          {card.id}
        </span>
      </div>
    </div>
  )
}
