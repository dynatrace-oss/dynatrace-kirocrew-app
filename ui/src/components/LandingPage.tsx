// Landing page shown when no Dynatrace credentials are configured.
// Self-contained guided onboarding: dtctl check → choose method → connect → done.
// No modal or overlay needed — the user does everything on this screen.
import { useCallback, useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import { T } from '../theme'
import { Button } from './primitives'
import { Icon } from './Icon'
import { api } from '../api'
import type { ApiError } from '../api'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SettingsInfo {
  dtctl_installed: boolean
  dtctl_version?: string
}

type Method = 'sso' | 'token'

const ENV_RE =
  /^https:\/\/[a-z0-9-]+\.(apps\.dynatrace\.com|live\.dynatrace\.com|apps\.dynatracelabs\.com)\/?$/

// ---------------------------------------------------------------------------
// Primitive layout pieces
// ---------------------------------------------------------------------------

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 10.5,
        fontWeight: 700,
        letterSpacing: 0.5,
        textTransform: 'uppercase' as const,
        color: T.muted,
        marginBottom: 4,
      }}
    >
      {children}
    </div>
  )
}

function StepDot({
  n,
  active,
  done,
}: {
  n: number
  active: boolean
  done: boolean
}) {
  const bg = done ? T.ok : active ? T.accent : T.bgElevated
  const color = done || active ? (done ? T.okFg : T.accentFg) : T.muted
  const border = done ? T.ok : active ? T.accent : T.border
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 28,
        height: 28,
        borderRadius: 9999,
        background: bg,
        color,
        border: `2px solid ${border}`,
        fontSize: 12,
        fontWeight: 700,
        flexShrink: 0,
        transition: 'all 200ms ease',
      }}
    >
      {done ? <Icon name="check" size={13} /> : n}
    </span>
  )
}

function StepConnector({ done }: { done: boolean }) {
  return (
    <div
      style={{
        width: 2,
        height: 20,
        background: done ? T.ok : T.border,
        margin: '3px auto',
        borderRadius: 9999,
        transition: 'background 200ms ease',
      }}
    />
  )
}

const inputStyle: CSSProperties = {
  fontSize: 13,
  padding: '9px 11px',
  borderRadius: T.radiusSm,
  border: `1px solid ${T.border}`,
  background: T.bg,
  color: T.text,
  width: '100%',
  boxSizing: 'border-box',
  outline: 'none',
}

function InlineAlert({
  kind,
  message,
  hint,
}: {
  kind: 'error' | 'ok' | 'warn'
  message: string
  hint?: string | null
}) {
  const color = kind === 'error' ? T.danger : kind === 'ok' ? T.ok : T.warn
  const bg = kind === 'error' ? T.dangerSubtle : kind === 'ok' ? T.okSubtle : T.warnSubtle
  return (
    <div
      style={{
        padding: '10px 12px',
        borderRadius: T.radiusMd,
        background: bg,
        color,
        fontSize: 12.5,
        lineHeight: 1.5,
      }}
    >
      {message}
      {hint && (
        <div style={{ marginTop: 4, color: T.muted, fontSize: 12 }}>{hint}</div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Method selector tab
// ---------------------------------------------------------------------------

function MethodTab({
  active,
  onClick,
  label,
  sublabel,
}: {
  active: boolean
  onClick: () => void
  label: string
  sublabel: string
}) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        padding: '10px 12px',
        borderRadius: T.radiusMd,
        border: `1.5px solid ${active ? T.accent : T.border}`,
        background: active ? T.accentSubtle : T.bg,
        color: active ? T.accent : T.muted,
        cursor: 'pointer',
        textAlign: 'left' as const,
        transition: 'all 150ms ease',
      }}
    >
      <div style={{ fontSize: 13, fontWeight: 700, color: active ? T.accent : T.textStrong }}>
        {label}
      </div>
      <div style={{ fontSize: 11.5, color: T.muted, marginTop: 2 }}>{sublabel}</div>
    </button>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function LandingPage({
  onConnected,
  reauth = false,
  onExploreDemo,
}: {
  onConnected: () => void
  /** When true: session expired mode — skip Step 1, show a re-auth banner. */
  reauth?: boolean
  /** When provided (first-run, non-reauth): renders a secondary link that lets
   *  the user drop into the demo board without configuring credentials. */
  onExploreDemo?: () => void
}) {
  const [info, setInfo] = useState<SettingsInfo | null>(null)
  const [checkingDtctl, setCheckingDtctl] = useState(!reauth) // skip check if reauth

  // Step 2 state
  const [method, setMethod] = useState<Method>('sso')
  const [envUrl, setEnvUrl] = useState('')
  const [token, setToken] = useState('')
  const [tokenEnvUrl, setTokenEnvUrl] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<{ message: string; hint?: string | null } | null>(null)
  const [connected, setConnected] = useState(false)

  const loadInfo = useCallback(() => {
    if (reauth) return // dtctl already installed — skip the check
    setCheckingDtctl(true)
    void api<SettingsInfo>('/settings')
      .then((data) => {
        setInfo(data)
        setCheckingDtctl(false)
      })
      .catch(() => {
        setInfo(null)
        setCheckingDtctl(false)
      })
  }, [reauth])

  useEffect(() => { loadInfo() }, [loadInfo])

  const dtctlMissing = !reauth && info != null && !info.dtctl_installed
  // Steps: 0=dtctl, 1=connect, 2=done
  // In reauth mode dtctl is already installed, so we start at step 1.
  const step = connected ? 2 : (dtctlMissing ? 0 : 1)

  const signIn = async () => {
    const env = envUrl.trim().replace(/\/$/, '')
    if (!ENV_RE.test(env)) {
      setErr({
        message: 'Enter a valid environment URL.',
        hint: 'It looks like https://abc12345.apps.dynatrace.com — the address you use to open Dynatrace.',
      })
      return
    }
    setBusy(true)
    setErr(null)
    try {
      await api('/settings/login', { method: 'POST', body: JSON.stringify({ environment: env }) })
      setConnected(true)
      onConnected()
    } catch (e) {
      const ae = e as ApiError
      setErr({ message: ae.message, hint: ae.hint })
    } finally {
      setBusy(false)
    }
  }

  const saveToken = async () => {
    const env = tokenEnvUrl.trim().replace(/\/$/, '')
    if (!token.trim() || !ENV_RE.test(env)) {
      setErr({
        message: 'Both a token and a valid environment URL are required.',
        hint: "Don't have a token? Switch to the SSO option above — it doesn't need one.",
      })
      return
    }
    setBusy(true)
    setErr(null)
    try {
      await api('/settings/token', {
        method: 'POST',
        body: JSON.stringify({ token: token.trim(), environment: env }),
      })
      setConnected(true)
      onConnected()
    } catch (e) {
      const ae = e as ApiError
      setErr({ message: ae.message, hint: ae.hint })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 24px 48px',
        overflowY: 'auto',
        minHeight: 0,
      }}
    >
      {/* ── Hero / Re-auth banner ── */}
      {reauth ? (
        <div
          style={{
            width: '100%',
            maxWidth: 520,
            marginBottom: 20,
            padding: '14px 18px',
            borderRadius: T.radiusMd,
            border: `1px solid ${T.warn}`,
            background: T.warnSubtle,
            display: 'flex',
            alignItems: 'flex-start',
            gap: 12,
          }}
        >
          <Icon name="warning" size={17} color={T.warn} style={{ marginTop: 1, flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: T.textStrong, marginBottom: 4 }}>
              Your Dynatrace session expired
            </div>
            <div style={{ fontSize: 12.5, color: T.muted, lineHeight: 1.55 }}>
              Sign in again below to reconnect — it only takes a moment and your settings are
              preserved. Your board will reload automatically once you're back in.
            </div>
          </div>
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
            marginBottom: 32,
            textAlign: 'center',
          }}
        >
          <svg width="48" height="48" viewBox="0 0 80 80" fill="none" aria-hidden="true">
            <circle cx="40" cy="40" r="36" stroke={T.accent} strokeWidth="4" />
            <path d="M24 56 L44 20 L56 20 L36 56 Z" fill={T.accent} />
          </svg>
          <div>
            <div
              style={{ fontSize: 21, fontWeight: 700, color: T.textStrong, lineHeight: 1.25, marginBottom: 5 }}
            >
              Welcome to Dynatrace
            </div>
            <div style={{ fontSize: 13.5, color: T.muted, maxWidth: 380, lineHeight: 1.55 }}>
              Connect your tenant to start using the Investigator Agent — or{' '}
              <a
                href="https://www.dynatrace.com/signup/"
                target="_blank"
                rel="noreferrer"
                style={{ color: T.accent, textDecoration: 'none' }}
              >
                start a free trial ↗
              </a>
              {' '}if you're new.
            </div>
          </div>
        </div>
      )}

      {/* ── Stepped onboarding card ── */}
      <div
        style={{
          width: '100%',
          maxWidth: 520,
          borderRadius: T.radiusLg,
          border: `1px solid ${T.border}`,
          background: T.bgElevated,
          padding: '24px 28px',
          display: 'flex',
          flexDirection: 'column',
          gap: 0,
        }}
      >
        {/* ── Step 1: Install dtctl ── */}
        <div style={{ display: 'flex', gap: 14 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <StepDot n={1} active={step === 0} done={step > 0} />
            <StepConnector done={step > 0} />
          </div>
          <div style={{ flex: 1, paddingBottom: 20 }}>
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: step === 0 ? T.textStrong : T.muted,
                marginBottom: step === 0 ? 10 : 0,
                lineHeight: 1.3,
              }}
            >
              Install dtctl
              {step > 0 && (
                <span
                  style={{ marginLeft: 8, fontSize: 11.5, fontWeight: 400, color: T.ok }}
                >
                  Installed
                </span>
              )}
            </div>

            {step === 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {checkingDtctl ? (
                  <div style={{ fontSize: 12.5, color: T.muted }}>Checking for dtctl…</div>
                ) : (
                  <>
                    <div style={{ fontSize: 13, color: T.text, lineHeight: 1.5 }}>
                      This app reads Dynatrace through <strong>dtctl</strong>, the open-source
                      Dynatrace CLI. It takes about 30 seconds to install.
                    </div>
                    <div
                      style={{
                        padding: '10px 12px',
                        fontFamily: T.mono,
                        fontSize: 12.5,
                        background: T.bg,
                        borderRadius: T.radiusSm,
                        border: `1px solid ${T.border}`,
                        color: T.text,
                        userSelect: 'all',
                      }}
                    >
                      brew install dynatrace-oss/tap/dtctl
                    </div>
                    <div style={{ fontSize: 12, color: T.muted }}>
                      No Homebrew?{' '}
                      <a
                        href="https://github.com/dynatrace-oss/dtctl"
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: T.accent, textDecoration: 'none' }}
                      >
                        Download a binary from GitHub ↗
                      </a>
                    </div>
                    <div>
                      <Button onClick={loadInfo}>I installed it — check again</Button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Step 2: Connect ── */}
        <div style={{ display: 'flex', gap: 14 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <StepDot n={2} active={step === 1} done={step > 1} />
            <StepConnector done={step > 1} />
          </div>
          <div style={{ flex: 1, paddingBottom: 20 }}>
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: step === 1 ? T.textStrong : T.muted,
                marginBottom: step === 1 ? 14 : 0,
                lineHeight: 1.3,
              }}
            >
              Connect your tenant
              {step > 1 && (
                <span style={{ marginLeft: 8, fontSize: 11.5, fontWeight: 400, color: T.ok }}>
                  Connected
                </span>
              )}
            </div>

            {step === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {/* Method picker */}
                <div style={{ display: 'flex', gap: 8 }}>
                  <MethodTab
                    active={method === 'sso'}
                    onClick={() => { setMethod('sso'); setErr(null) }}
                    label="Sign in with Dynatrace"
                    sublabel="Recommended · no token needed"
                  />
                  <MethodTab
                    active={method === 'token'}
                    onClick={() => { setMethod('token'); setErr(null) }}
                    label="Access token"
                    sublabel="For automation or no SSO"
                  />
                </div>

                {/* SSO form */}
                {method === 'sso' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <SectionLabel>Your environment URL</SectionLabel>
                    <input
                      value={envUrl}
                      onChange={(e) => setEnvUrl(e.target.value)}
                      placeholder="https://abc12345.apps.dynatrace.com"
                      style={inputStyle}
                      disabled={busy}
                      autoFocus
                      onKeyDown={(e) => { if (e.key === 'Enter') void signIn() }}
                    />
                    <div style={{ fontSize: 12, color: T.muted }}>
                      This is the URL you open in your browser to use Dynatrace.
                    </div>
                    {err && <InlineAlert kind="error" message={err.message} hint={err.hint} />}
                    {busy && (
                      <InlineAlert
                        kind="warn"
                        message="A browser window opened — complete the Dynatrace login there."
                        hint="This may take a moment. Don't close this page."
                      />
                    )}
                    <Button
                      variant="primary"
                      onClick={() => void signIn()}
                      disabled={busy}
                      style={{ alignSelf: 'flex-start' }}
                    >
                      {busy ? 'Waiting for browser sign-in…' : 'Sign in with Dynatrace'}
                    </Button>
                  </div>
                )}

                {/* Token form */}
                {method === 'token' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <SectionLabel>Access token</SectionLabel>
                    <input
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      placeholder="dt0c01.XXXX…"
                      style={inputStyle}
                      disabled={busy}
                      autoFocus
                    />
                    <SectionLabel>Environment URL</SectionLabel>
                    <input
                      value={tokenEnvUrl}
                      onChange={(e) => setTokenEnvUrl(e.target.value)}
                      placeholder="https://abc12345.apps.dynatrace.com"
                      style={inputStyle}
                      disabled={busy}
                      onKeyDown={(e) => { if (e.key === 'Enter') void saveToken() }}
                    />
                    <div style={{ fontSize: 12, color: T.muted }}>
                      Tokens are validated live and stored owner-only — never logged or echoed.
                    </div>
                    {err && <InlineAlert kind="error" message={err.message} hint={err.hint} />}
                    <Button
                      variant="primary"
                      onClick={() => void saveToken()}
                      disabled={busy}
                      style={{ alignSelf: 'flex-start' }}
                    >
                      {busy ? 'Validating…' : 'Save token'}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Step 3: Ready ── */}
        <div style={{ display: 'flex', gap: 14 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <StepDot n={3} active={step === 2} done={step === 2} />
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: step === 2 ? T.textStrong : T.muted,
                marginBottom: step === 2 ? 12 : 0,
                lineHeight: 1.3,
              }}
            >
              You're connected
            </div>

            {step === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ fontSize: 13, color: T.text, lineHeight: 1.55 }}>
                  Your Dynatrace tenant is connected. The Investigator Agent is loading your
                  problems, services, and applications now.
                </div>
                <div>
                  <Button variant="primary" onClick={onConnected}>
                    <Icon name="spark" size={14} />
                    Open Investigator Agent
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      {!reauth && (
        <div
          style={{
            marginTop: 20,
            fontSize: 12,
            color: T.muted,
            textAlign: 'center',
            maxWidth: 480,
            lineHeight: 1.5,
          }}
        >
          New to Dynatrace?{' '}
          <a
            href="https://www.dynatrace.com/signup/"
            target="_blank"
            rel="noreferrer"
            style={{ color: T.accent, textDecoration: 'none' }}
          >
            Start a free 15-day trial ↗
          </a>
          {' '}— no credit card required.
        </div>
      )}

      {/* ── Secondary: explore demo without connecting ── */}
      {!reauth && onExploreDemo && (
        <button
          onClick={onExploreDemo}
          style={{
            marginTop: 14,
            background: 'none',
            border: 'none',
            color: T.muted,
            fontSize: 12.5,
            cursor: 'pointer',
            textDecoration: 'underline',
            textUnderlineOffset: 3,
          }}
        >
          Just looking? Explore with demo data
        </button>
      )}
    </div>
  )
}
