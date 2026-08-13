import { T } from '../theme'
import { Icon } from './Icon'

export function DemoBanner({ onLeaveDemo }: { onLeaveDemo: () => void }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        background: T.warnSubtle,
        color: T.warn,
        padding: '8px 16px',
        fontSize: 12.5,
        borderBottom: `1px solid ${T.warn}`,
        flexShrink: 0,
      }}
    >
      <Icon name="warning" size={15} />
      <span style={{ flex: 1, fontWeight: 500 }}>
        Demo data. To connect to your own Dynatrace tenant, leave demo mode.
      </span>
      <button
        onClick={onLeaveDemo}
        style={{
          padding: '4px 10px',
          fontSize: 12,
          fontWeight: 600,
          borderRadius: T.radiusMd,
          border: `1px solid ${T.warn}`,
          background: 'transparent',
          color: T.warn,
          cursor: 'pointer',
          whiteSpace: 'nowrap',
        }}
      >
        Leave demo mode
      </button>
    </div>
  )
}
