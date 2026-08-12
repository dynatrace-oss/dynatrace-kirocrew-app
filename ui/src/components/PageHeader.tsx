import { T } from '../theme'
import { Chip } from './primitives'
import { Icon } from './Icon'

function envHost(url?: string): string {
  if (!url) return ''
  try {
    return new URL(url).host
  } catch {
    return url.replace(/^https?:\/\//, '').replace(/\/$/, '')
  }
}

export function PageHeader({ environment, demo }: { environment?: string; demo?: boolean }) {
  const host = envHost(environment)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px 10px' }}>
      <img
        src="/apps/dynatrace/ui/dist/dynatrace.png"
        alt="Dynatrace"
        width={30}
        height={30}
        style={{ borderRadius: 6, flexShrink: 0 }}
        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 18, fontWeight: 700, color: T.textStrong }}>Dynatrace</span>
          {demo && <Chip tone="warn">Demo</Chip>}
        </div>
        <div style={{ fontSize: 12, color: T.muted, display: 'flex', alignItems: 'center', gap: 5 }}>
          {host ? (
            <a
              href={environment}
              target="_blank"
              rel="noreferrer"
              style={{ color: T.muted, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}
            >
              {host}
              <Icon name="external" size={11} />
            </a>
          ) : (
            'Kanban control tower'
          )}
        </div>
      </div>
    </div>
  )
}
