import type { ReactNode } from 'react'
import { T } from '../theme'
import { CountBadge, InfoDot } from './primitives'

export function ColumnView({
  label,
  count,
  total,
  totalIsLowerBound,
  tip,
  children,
  footer,
}: {
  label: string
  count: number
  /** True bucket size on the server when it exceeds the shipped cards. */
  total?: number
  /** True when the server-side query limit was hit (total is a floor). */
  totalIsLowerBound?: boolean
  tip?: string
  children: ReactNode
  footer?: ReactNode
}) {
  const hasMore = typeof total === 'number' && total > count
  const totalLabel = hasMore ? `${count} of ${total}${totalIsLowerBound ? '+' : ''}` : undefined
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minWidth: 280,
        width: 280,
        flexShrink: 0,
        borderRadius: T.radiusLg,
        border: `1px solid ${T.border}`,
        background: T.panel,
        maxHeight: '100%',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '10px 12px',
          borderBottom: `1px solid ${T.border}`,
          position: 'sticky',
          top: 0,
        }}
      >
        <span style={{ fontSize: 12.5, fontWeight: 600, color: T.textStrong, textTransform: 'uppercase', letterSpacing: 0.3 }}>
          {label}
        </span>
        {tip && <InfoDot tip={tip} />}
        <span style={{ flex: 1 }} />
        {totalLabel ? (
          <span title={`Showing the ${count} most recent of ${total}${totalIsLowerBound ? '+' : ''} in this column`}
                style={{ fontSize: 11, color: T.muted, whiteSpace: 'nowrap' }}>
            {totalLabel}
          </span>
        ) : (
          <CountBadge n={count} />
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 10, overflowY: 'auto', flex: 1 }}>
        {count === 0 ? (
          <div style={{ fontSize: 12, color: T.muted, textAlign: 'center', padding: '16px 0' }}>Nothing here</div>
        ) : (
          children
        )}
        {footer}
      </div>
    </div>
  )
}
