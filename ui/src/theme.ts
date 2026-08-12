// Theme tokens — semantic CSS custom properties only. Zero hardcoded hex colors.
// Non-color fallbacks (radii in px) are allowed. See DESIGN.md "UI" + research §3.4.

import type { Tone } from './api'

export const T = {
  bg: 'var(--bg)',
  bgElevated: 'var(--bg-elevated)',
  bgHover: 'var(--bg-hover)',
  panel: 'var(--panel)',
  card: 'var(--card)',
  cardFg: 'var(--card-fg)',
  chrome: 'var(--chrome)',

  text: 'var(--text)',
  textStrong: 'var(--text-strong)',
  muted: 'var(--muted)',
  mutedStrong: 'var(--muted-strong)',

  border: 'var(--border)',
  borderStrong: 'var(--border-strong)',
  borderHover: 'var(--border-hover)',
  ring: 'var(--ring)',

  accent: 'var(--accent)',
  accentFg: 'var(--accent-fg)',
  accentSubtle: 'var(--accent-subtle)',

  ok: 'var(--ok)',
  okFg: 'var(--ok-fg)',
  okSubtle: 'var(--ok-subtle)',

  warn: 'var(--warn)',
  warnFg: 'var(--warn-fg)',
  warnSubtle: 'var(--warn-subtle)',

  danger: 'var(--danger)',
  dangerFg: 'var(--danger-fg)',
  dangerSubtle: 'var(--danger-subtle)',

  info: 'var(--info)',
  infoFg: 'var(--info-fg)',

  radiusSm: 'var(--radius-sm, 6px)',
  radiusMd: 'var(--radius-md, 8px)',
  radiusLg: 'var(--radius-lg, 12px)',

  shadowSm: 'var(--shadow-sm)',
  shadowMd: 'var(--shadow-md)',
  shadowLg: 'var(--shadow-lg)',

  font: 'var(--font-body, inherit)',
  mono: 'var(--mono, ui-monospace, SFMono-Regular, Menlo, monospace)',
} as const

// The one sanctioned non-token color: overlay scrims (matches host convention).
export const SCRIM = 'rgba(0,0,0,.45)'

export interface ToneColors {
  fg: string
  bg: string
}

export function toneColors(tone: Tone): ToneColors {
  switch (tone) {
    case 'danger':
      return { fg: T.danger, bg: T.dangerSubtle }
    case 'warn':
      return { fg: T.warn, bg: T.warnSubtle }
    case 'accent':
      return { fg: T.accent, bg: T.accentSubtle }
    case 'ok':
      return { fg: T.ok, bg: T.okSubtle }
    default:
      return { fg: T.muted, bg: T.bgElevated }
  }
}
