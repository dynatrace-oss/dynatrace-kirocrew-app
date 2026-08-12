import { useCallback, useEffect, useState } from 'react'
import { SCRIM, T } from '../theme'
import { Button, Chip } from './primitives'
import { Icon } from './Icon'
import { api } from './../api'
import type { ApiError, Status } from '../api'

interface SettingsInfo {
  source: string
  environment: string
  demo: boolean
  contexts: { name: string; environment: string; active: boolean }[]
  selected_context: string
  dtctl_installed: boolean
  dtctl_version: string
  login_in_progress: boolean
}

const ENV_RE = /^https:\/\/[a-z0-9-]+\.(apps\.dynatrace\.com|live\.dynatrace\.com|apps\.dynatracelabs\.com)\/?$/

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase', color: T.muted, marginBottom: 6 }}>
      {children}
    </div>
  )
}

function Panel({ children, tone }: { children: React.ReactNode; tone?: 'ok' | 'warn' }) {
  const border = tone === 'ok' ? T.ok : tone === 'warn' ? T.warn : T.border
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 12, borderRadius: T.radiusMd, border: `1px solid ${border}`, background: T.bgElevated, marginBottom: 14 }}>
      {children}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  fontSize: 13,
  padding: '8px 10px',
  borderRadius: T.radiusSm,
  border: `1px solid ${T.border}`,
  background: T.bg,
  color: T.text,
  width: '100%',
  boxSizing: 'border-box',
}

export function SettingsOverlay({
  status,
  onClose,
  onChanged,
}: {
  status: Status | null
  onClose: () => void
  onChanged: () => void
}) {
  const [info, setInfo] = useState<SettingsInfo | null>(null)
  const [envUrl, setEnvUrl] = useState('')
  const [token, setToken] = useState('')
  const [tokenEnvUrl, setTokenEnvUrl] = useState('')
  const [busy, setBusy] = useState<'' | 'login' | 'token' | 'ctx' | 'remove'>('')
  const [err, setErr] = useState<{ message: string; hint?: string | null } | null>(null)
  const [ok, setOk] = useState('')
  const [showConnectOther, setShowConnectOther] = useState(false)

  const loadInfo = useCallback(() => {
    void api<SettingsInfo>('/settings')
      .then(setInfo)
      .catch(() => setInfo(null))
  }, [])

  useEffect(() => loadInfo(), [loadInfo])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const configured = Boolean(status?.configured) && !status?.demo
  const dtctlMissing = info != null && !info.dtctl_installed

  const signIn = async () => {
    const env = envUrl.trim().replace(/\/$/, '')
    if (!ENV_RE.test(env + '')) {
      setErr({ message: 'Enter your environment URL first.', hint: 'It looks like https://abc12345.apps.dynatrace.com — the address you use to open Dynatrace.' })
      return
    }
    setBusy('login')
    setErr(null)
    setOk('')
    try {
      // Long request by design: dtctl opens the browser and waits for the user.
      await api('/settings/login', { method: 'POST', body: JSON.stringify({ environment: env }) })
      setOk('Signed in. This tenant is now connected.')
      setShowConnectOther(false)
      loadInfo()
      onChanged()
    } catch (e) {
      const ae = e as ApiError
      setErr({ message: ae.message, hint: ae.hint })
    } finally {
      setBusy('')
    }
  }

  const saveToken = async () => {
    if (!token.trim() || !ENV_RE.test(tokenEnvUrl.trim().replace(/\/$/, ''))) {
      setErr({ message: 'Both the token and the environment URL are needed for this option.', hint: 'No token? Use "Sign in with Dynatrace" instead — it needs no token at all.' })
      return
    }
    setBusy('token')
    setErr(null)
    setOk('')
    try {
      await api('/settings/token', {
        method: 'POST',
        body: JSON.stringify({ token: token.trim(), environment: tokenEnvUrl.trim().replace(/\/$/, '') }),
      })
      setToken('')
      setOk('Token saved and validated.')
      setShowConnectOther(false)
      loadInfo()
      onChanged()
    } catch (e) {
      const ae = e as ApiError
      setErr({ message: ae.message, hint: ae.hint })
    } finally {
      setBusy('')
    }
  }

  const applyContext = async (name: string) => {
    setBusy('ctx')
    setErr(null)
    setOk('')
    try {
      await api('/settings/context', { method: 'POST', body: JSON.stringify({ context: name }) })
      setOk(name ? `Tenant pinned to "${name}".` : 'Using the dtctl active context.')
      loadInfo()
      onChanged()
    } catch (e) {
      const ae = e as ApiError
      setErr({ message: ae.message, hint: ae.hint })
    } finally {
      setBusy('')
    }
  }

  const removeToken = async () => {
    setBusy('remove')
    setErr(null)
    try {
      await api('/settings/token', { method: 'DELETE' })
      setOk('Token removed.')
      loadInfo()
      onChanged()
    } catch (e) {
      const ae = e as ApiError
      setErr({ message: ae.message, hint: ae.hint })
    } finally {
      setBusy('')
    }
  }

  const connectOptions = (
    <>
      <SectionTitle>Option 1 · Sign in with Dynatrace (recommended)</SectionTitle>
      <Panel>
        <div style={{ fontSize: 12.5, color: T.muted }}>
          No token needed. Enter your environment URL and sign in — your browser opens the
          Dynatrace login, and the session is stored securely in your OS keychain.
        </div>
        <input
          value={envUrl}
          onChange={(e) => setEnvUrl(e.target.value)}
          placeholder="https://abc12345.apps.dynatrace.com"
          style={inputStyle}
          disabled={busy === 'login'}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Button variant="primary" onClick={() => void signIn()} disabled={busy !== '' || dtctlMissing}>
            {busy === 'login' ? 'Waiting for browser sign-in…' : 'Sign in with Dynatrace'}
          </Button>
          {busy === 'login' && (
            <span style={{ fontSize: 12, color: T.muted }}>Complete the login in the browser window that opened.</span>
          )}
        </div>
      </Panel>

      <SectionTitle>Option 2 · Use an access token</SectionTitle>
      <Panel>
        <div style={{ fontSize: 12.5, color: T.muted }}>
          For automation or when SSO isn't available. Needs BOTH a platform token and the
          environment URL. Validated live before saving; stored owner-only, never logged or echoed.
        </div>
        <input value={token} onChange={(e) => setToken(e.target.value)} placeholder="dt0c01.XXXX…" style={inputStyle} />
        <input
          value={tokenEnvUrl}
          onChange={(e) => setTokenEnvUrl(e.target.value)}
          placeholder="https://abc12345.apps.dynatrace.com"
          style={inputStyle}
        />
        <div>
          <Button onClick={() => void saveToken()} disabled={busy !== '' || dtctlMissing}>
            {busy === 'token' ? 'Validating…' : 'Save token'}
          </Button>
        </div>
      </Panel>
    </>
  )

  return (
    <div
      onClick={onClose}
      style={{ position: 'absolute', inset: 0, background: SCRIM, display: 'flex', justifyContent: 'flex-end', zIndex: 40 }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ width: 460, maxWidth: '92%', height: '100%', overflowY: 'auto', background: T.panel, borderLeft: `1px solid ${T.border}`, padding: 18, boxSizing: 'border-box' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <Icon name="settings" size={17} />
          <span style={{ fontSize: 16, fontWeight: 700, color: T.textStrong, flex: 1 }}>Settings</span>
          <Button variant="ghost" onClick={onClose} title="Close">
            <Icon name="close" size={15} />
          </Button>
        </div>

        {err && (
          <div style={{ marginBottom: 12, fontSize: 12.5, color: T.danger }}>
            {err.message}
            {err.hint && <div style={{ color: T.muted, marginTop: 3 }}>{err.hint}</div>}
          </div>
        )}
        {ok && <div style={{ marginBottom: 12, fontSize: 12.5, color: T.ok }}>{ok}</div>}

        {/* Step 0 — dtctl prerequisite (needed by BOTH connection options) */}
        {dtctlMissing && (
          <>
            <SectionTitle>First: install dtctl</SectionTitle>
            <Panel tone="warn">
              <div style={{ fontSize: 12.5, color: T.text }}>
                This app reads Dynatrace through <b>dtctl</b>, the open-source Dynatrace CLI —
                it isn't installed on this machine yet. Install it, then come back here:
              </div>
              <pre style={{ margin: 0, padding: 10, fontFamily: T.mono, fontSize: 12, background: T.bg, borderRadius: T.radiusSm, border: `1px solid ${T.border}`, overflowX: 'auto' }}>
                brew install dynatrace-oss/tap/dtctl
              </pre>
              <div style={{ fontSize: 12, color: T.muted }}>
                Or download a binary from{' '}
                <a href="https://github.com/dynatrace-oss/dtctl" target="_blank" rel="noreferrer" style={{ color: T.accent }}>
                  github.com/dynatrace-oss/dtctl
                </a>
                .
              </div>
              <div>
                <Button onClick={loadInfo}>I installed it — check again</Button>
              </div>
            </Panel>
          </>
        )}

        {/* Connected state */}
        {configured && !dtctlMissing && (
          <>
            <SectionTitle>Connection</SectionTitle>
            <Panel tone="ok">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icon name="check" size={14} color={T.ok} />
                <span style={{ fontSize: 13, fontWeight: 600, color: T.textStrong }}>Connected</span>
                <Chip tone="muted">{info?.source === 'token' || status?.source === 'token' || status?.source === 'app' ? 'access token' : status?.source === 'env' ? 'env vars' : 'Dynatrace sign-in'}</Chip>
              </div>
              <div style={{ fontSize: 12.5, color: T.muted, wordBreak: 'break-all' }}>{status?.environment}</div>
              {(status?.source === 'app' || status?.source === 'token') && (
                <div>
                  <Button variant="danger" onClick={() => void removeToken()} disabled={busy !== ''}>
                    {busy === 'remove' ? 'Removing…' : 'Remove token'}
                  </Button>
                </div>
              )}
            </Panel>

            {info && info.contexts.length > 1 && (
              <>
                <SectionTitle>Tenant</SectionTitle>
                <Panel>
                  <div style={{ fontSize: 12.5, color: T.muted }}>
                    You're signed in to more than one tenant. Pick which one this board reads.
                  </div>
                  <select
                    value={info.selected_context}
                    disabled={busy === 'ctx'}
                    onChange={(e) => void applyContext(e.target.value)}
                    style={{ ...inputStyle }}
                  >
                    <option value="">
                      dtctl active context{info.contexts.find((c) => c.active) ? ` (${info.contexts.find((c) => c.active)!.name})` : ''}
                    </option>
                    {info.contexts.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.name} — {c.environment.replace(/^https?:\/\//, '')}
                      </option>
                    ))}
                  </select>
                </Panel>
              </>
            )}

            {!showConnectOther ? (
              <button
                onClick={() => setShowConnectOther(true)}
                style={{ fontSize: 12.5, color: T.accent, background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
              >
                Connect a different tenant or switch method…
              </button>
            ) : (
              connectOptions
            )}
          </>
        )}

        {/* Not connected — guided onboarding */}
        {!configured && !dtctlMissing && info && (
          <>
            <div style={{ fontSize: 13, color: T.text, marginBottom: 12 }}>
              Connect the app to your Dynatrace tenant. You need <b>one</b> of the two options
              below — not both.
            </div>
            {connectOptions}
          </>
        )}

        {!info && <div style={{ fontSize: 12.5, color: T.muted }}>Loading settings…</div>}
      </div>
    </div>
  )
}
