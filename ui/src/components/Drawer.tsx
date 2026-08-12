import { useCallback, useEffect, useState } from 'react'
import { useChatLauncher } from '@kirocrew/app-sdk'
import { SCRIM, T } from '../theme'
import { Button, Chip, Tag } from './primitives'
import { Icon } from './Icon'
import { api, affectedCount, categoryTone, durationMs, rootCauseText } from '../api'
import type {
  ApiError,
  EntityCard as EntityCardT,
  EntityDetail,
  HandoffResponse,
  ProblemCard as ProblemCardT,
  ProblemDetail,
  RelatedProblem,
} from '../api'
import { fmtAge, fmtDateTime, fmtDuration } from '../format'
import type { Selection } from './Board'

function stripTrailingSlash(s?: string): string {
  return (s || '').replace(/\/$/, '')
}

function problemDeepLink(detail: ProblemDetail, envUrl?: string): string {
  if (detail.deep_link) return detail.deep_link
  if (detail.url) return detail.url
  const eventId = detail.event_id || detail.event?.id || detail.display_id
  const base = stripTrailingSlash(envUrl || detail.environment)
  if (!base) return ''
  return `${base}/ui/apps/dynatrace.davis.problems/problem/${encodeURIComponent(eventId)}`
}

function entityDeepLink(detail: EntityDetail, envUrl?: string): string {
  if (detail.deep_link) return detail.deep_link
  if (detail.url) return detail.url
  const base = stripTrailingSlash(envUrl || detail.environment)
  if (!base || !detail.id) return ''
  return `${base}/ui/entity/${encodeURIComponent(detail.id)}`
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: 10, fontSize: 13, padding: '6px 0', borderBottom: `1px solid ${T.border}` }}>
      <div style={{ width: 120, flexShrink: 0, color: T.muted }}>{label}</div>
      <div style={{ flex: 1, color: T.text, minWidth: 0, wordBreak: 'break-word' }}>{children || '—'}</div>
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase', color: T.muted, margin: '14px 0 4px' }}>
      {children}
    </div>
  )
}

function DeepLink({ href }: { href: string }) {
  if (!href) return null
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 13, color: T.accent, textDecoration: 'none' }}
    >
      Open in Dynatrace
      <Icon name="external" size={13} />
    </a>
  )
}

function RelatedList({ items }: { items: RelatedProblem[] }) {
  if (!items.length) return <span style={{ color: T.muted }}>None</span>
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {items.map((p) => (
        <div key={p.display_id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {p.category && <Chip tone={categoryTone(p.category)}>{p.category}</Chip>}
          <span style={{ fontSize: 12.5 }}>{p.name || p.title || p.display_id}</span>
          <span style={{ flex: 1 }} />
          <span style={{ fontFamily: T.mono, fontSize: 10.5, color: T.muted }}>{p.display_id}</span>
        </div>
      ))}
    </div>
  )
}

function HandoffPanel({ view, displayId }: { view: string; displayId: string }) {
  const [busy, setBusy] = useState<'investigate' | 'summarize' | null>(null)
  const [prompt, setPrompt] = useState<string>('')
  const [err, setErr] = useState<string>('')
  const [copied, setCopied] = useState(false)
  const { openChat } = useChatLauncher()

  const run = useCallback(
    async (kind: 'investigate' | 'summarize') => {
      setBusy(kind)
      setErr('')
      setCopied(false)
      try {
        const res = await api<HandoffResponse>('/handoff', {
          method: 'POST',
          body: JSON.stringify({ kind, view, display_id: displayId }),
        })
        const p = res.prompt || res.message || ''
        setPrompt(p)
        // Hand straight off to a Kiro Crew chat seeded with the prompt.
        if (p) openChat({ message: p })
      } catch (e) {
        const ae = e as ApiError
        setErr(ae.hint || ae.message || 'Handoff failed.')
      } finally {
        setBusy(null)
      }
    },
    [view, displayId, openChat],
  )

  const copy = useCallback(() => {
    if (!prompt) return
    void navigator.clipboard?.writeText(prompt).then(
      () => {
        setCopied(true)
        window.setTimeout(() => setCopied(false), 1500)
      },
      () => setCopied(false),
    )
  }, [prompt])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <Button variant="primary" disabled={busy !== null} onClick={() => run('investigate')}>
          <Icon name="spark" size={14} />
          {busy === 'investigate' ? 'Composing…' : 'Investigate'}
        </Button>
        <Button disabled={busy !== null} onClick={() => run('summarize')}>
          {busy === 'summarize' ? 'Composing…' : 'Summarize for standup'}
        </Button>
      </div>

      {err && <div style={{ fontSize: 12.5, color: T.danger }}>{err}</div>}

      {prompt && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, color: T.muted, flex: 1 }}>
              Opened in a Kiro Crew chat. If it didn't open, copy the prompt below.
            </span>
            <Button size="sm" onClick={copy} title="Copy prompt">
              <Icon name={copied ? 'check' : 'copy'} size={13} />
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </div>
          <pre
            style={{
              margin: 0,
              padding: 10,
              fontFamily: T.mono,
              fontSize: 12,
              lineHeight: 1.45,
              color: T.text,
              background: T.bgElevated,
              border: `1px solid ${T.border}`,
              borderRadius: T.radiusMd,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              maxHeight: 260,
              overflowY: 'auto',
            }}
          >
            {prompt}
          </pre>
        </div>
      )}
    </div>
  )
}

function ProblemBody({ detail, envUrl }: { detail: ProblemDetail; envUrl?: string }) {
  const closed = (detail.status || '').toUpperCase() === 'CLOSED'
  const affected =
    detail.affected_entities && detail.affected_entities.length
      ? detail.affected_entities.map((a) => a.name || a.id || '').filter(Boolean)
      : detail.affected_names || []
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        {detail.category && <Chip tone={categoryTone(detail.category)}>{detail.category}</Chip>}
        <Chip tone={closed ? 'muted' : 'danger'}>{detail.status || 'UNKNOWN'}</Chip>
        {detail.maintenance && <Chip tone="warn">Maintenance</Chip>}
      </div>

      <SectionTitle>Details</SectionTitle>
      <Row label="Problem ID">
        <span style={{ fontFamily: T.mono }}>{detail.display_id}</span>
      </Row>
      <Row label="Started">{fmtDateTime(detail.start)}</Row>
      {closed && <Row label="Ended">{fmtDateTime(detail.end)}</Row>}
      <Row label={closed ? 'Duration' : 'Age'}>{closed ? fmtDuration(durationMs(detail)) : fmtAge(detail.start)}</Row>
      <Row label="Root cause">{rootCauseText(detail)}</Row>
      <Row label="Affected">{affectedCount(detail)} entities</Row>

      {affected.length > 0 && (
        <>
          <SectionTitle>Affected entities</SectionTitle>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {affected.map((n, i) => (
              <Tag key={`${n}-${i}`}>{n}</Tag>
            ))}
          </div>
        </>
      )}

      {detail.description && (
        <>
          <SectionTitle>Analysis</SectionTitle>
          <div style={{ fontSize: 12.5, lineHeight: 1.5, color: T.text, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {detail.description}
          </div>
        </>
      )}

      <SectionTitle>Links</SectionTitle>
      <DeepLink href={problemDeepLink(detail, envUrl)} />

      <SectionTitle>Agent handoff</SectionTitle>
      <HandoffPanel view="problems" displayId={detail.display_id} />
    </>
  )
}

function EntityBody({ detail, envUrl }: { detail: EntityDetail; envUrl?: string }) {
  const tags = detail.tags || []
  // Backend shape: related_problems = {active: [...], recent: [...]}.
  // Defensively also accept a flat array (older/demo shapes).
  const rp = detail.related_problems
  const rpActive = Array.isArray(rp) ? rp.filter((p) => (p.status || '').toUpperCase() === 'ACTIVE') : rp?.active || []
  const rpRecent = Array.isArray(rp) ? rp.filter((p) => (p.status || '').toUpperCase() === 'CLOSED') : rp?.recent || []
  const active = detail.active || rpActive
  const recent = detail.recent || rpRecent
  return (
    <>
      <SectionTitle>Details</SectionTitle>
      <Row label="Name">{detail.name || detail.id}</Row>
      <Row label="Type">{detail.type || '—'}</Row>
      <Row label="Entity ID">
        <span style={{ fontFamily: T.mono, fontSize: 11.5 }}>{detail.id}</span>
      </Row>

      {tags.length > 0 && (
        <>
          <SectionTitle>Tags</SectionTitle>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {tags.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>
        </>
      )}

      <SectionTitle>Active problems</SectionTitle>
      <RelatedList items={active} />
      <SectionTitle>Recent problems</SectionTitle>
      <RelatedList items={recent} />

      <SectionTitle>Links</SectionTitle>
      <DeepLink href={entityDeepLink(detail, envUrl)} />
    </>
  )
}

/**
 * Renders the facts the board card already carries, so a failed detail fetch
 * still leaves the drawer useful instead of a dead end.
 */
function FallbackFacts({ kind, card }: { kind: 'problem' | 'entity'; card: ProblemCardT | EntityCardT }) {
  if (kind === 'problem') {
    const p = card as ProblemCardT
    const closed = (p.status || '').toUpperCase() === 'CLOSED'
    return (
      <>
        <SectionTitle>From the board</SectionTitle>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', margin: '2px 0 6px' }}>
          {p.category && <Chip tone={categoryTone(p.category)}>{p.category}</Chip>}
          <Chip tone={closed ? 'muted' : 'danger'}>{p.status || 'UNKNOWN'}</Chip>
          {p.maintenance && <Chip tone="warn">Maintenance</Chip>}
        </div>
        <Row label="Problem ID">
          <span style={{ fontFamily: T.mono }}>{p.display_id}</span>
        </Row>
        <Row label="Started">{fmtDateTime(p.start)}</Row>
        {closed && <Row label="Ended">{fmtDateTime(p.end)}</Row>}
        <Row label={closed ? 'Duration' : 'Age'}>{closed ? fmtDuration(durationMs(p)) : fmtAge(p.start)}</Row>
        <Row label="Affected">{affectedCount(p)} entities</Row>
      </>
    )
  }
  const e = card as EntityCardT
  const tags = e.tags || []
  return (
    <>
      <SectionTitle>From the board</SectionTitle>
      <Row label="Name">{e.name || e.id}</Row>
      <Row label="Type">{e.type || '—'}</Row>
      {tags.length > 0 && (
        <>
          <SectionTitle>Tags</SectionTitle>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {tags.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>
        </>
      )}
    </>
  )
}

export function Drawer({ selection, envUrl, onClose }: { selection: Selection; envUrl?: string; onClose: () => void }) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<ApiError | null>(null)
  const [problem, setProblem] = useState<ProblemDetail | null>(null)
  const [entity, setEntity] = useState<EntityDetail | null>(null)
  const [nonce, setNonce] = useState(0)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  useEffect(() => {
    let alive = true
    setLoading(true)
    setError(null)
    setProblem(null)
    setEntity(null)
    const path =
      selection.kind === 'problem'
        ? `/problems/${encodeURIComponent(selection.id)}`
        : `/entities/${encodeURIComponent(selection.id)}`
    api(path)
      .then((d) => {
        if (!alive) return
        if (selection.kind === 'problem') setProblem(d as ProblemDetail)
        else setEntity(d as EntityDetail)
      })
      .catch((e) => alive && setError(e as ApiError))
      .finally(() => alive && setLoading(false))
    return () => {
      alive = false
    }
  }, [selection, nonce])

  const card = selection.card
  const heading =
    selection.kind === 'problem'
      ? problem?.name || problem?.title || (card as ProblemCardT | undefined)?.name || (card as ProblemCardT | undefined)?.title || selection.id
      : entity?.name || (card as EntityCardT | undefined)?.name || selection.id

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 20 }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: SCRIM }} />
      <div
        role="dialog"
        aria-modal="true"
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          width: 'min(460px, 92%)',
          display: 'flex',
          flexDirection: 'column',
          background: T.panel,
          borderLeft: `1px solid ${T.border}`,
          boxShadow: T.shadowLg,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '14px 16px', borderBottom: `1px solid ${T.border}` }}>
          <div style={{ flex: 1, fontSize: 15, fontWeight: 700, color: T.textStrong, lineHeight: 1.3 }}>{heading}</div>
          <Button variant="ghost" onClick={onClose} title="Close (Esc)" style={{ padding: 6 }}>
            <Icon name="close" size={16} />
          </Button>
        </div>

        <div style={{ padding: '10px 16px 24px', overflowY: 'auto', flex: 1 }}>
          {loading && <div style={{ fontSize: 13, color: T.muted, padding: '20px 0' }}>Loading…</div>}
          {error && !loading && (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '10px 0 4px' }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: T.text }}>
                  Couldn’t load live details from Dynatrace
                </div>
                {(error.hint || error.message) && (
                  <div style={{ fontSize: 11.5, color: T.muted, lineHeight: 1.4 }}>{error.hint || error.message}</div>
                )}
                <div>
                  <Button size="sm" onClick={() => setNonce((n) => n + 1)} title="Retry loading details">
                    <Icon name="refresh" size={13} />
                    Retry
                  </Button>
                </div>
              </div>
              {card && <FallbackFacts kind={selection.kind} card={card} />}
            </div>
          )}
          {!loading && !error && problem && <ProblemBody detail={problem} envUrl={envUrl} />}
          {!loading && !error && entity && <EntityBody detail={entity} envUrl={envUrl} />}
        </div>
      </div>
    </div>
  )
}
