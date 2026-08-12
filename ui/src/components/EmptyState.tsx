import type { ReactNode } from 'react'
import { T } from '../theme'
import { Button } from './primitives'
import { Icon } from './Icon'
import type { IconName } from './Icon'

export function EmptyState({
  icon = 'warning',
  title,
  body,
  action,
}: {
  icon?: IconName
  title: string
  body: ReactNode
  action?: { label: string; onClick: () => void }
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        gap: 10,
        padding: '48px 24px',
        margin: 'auto',
        maxWidth: 420,
        color: T.muted,
      }}
    >
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 44,
          height: 44,
          borderRadius: 9999,
          background: T.bgElevated,
          color: T.muted,
        }}
      >
        <Icon name={icon} size={22} />
      </div>
      <div style={{ fontSize: 15, fontWeight: 600, color: T.textStrong }}>{title}</div>
      <div style={{ fontSize: 13, lineHeight: 1.5 }}>{body}</div>
      {action && (
        <div style={{ marginTop: 4 }}>
          <Button variant="primary" onClick={action.onClick}>
            {action.label}
          </Button>
        </div>
      )}
    </div>
  )
}
