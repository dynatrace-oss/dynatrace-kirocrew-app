// Themed primitive atoms built entirely from theme tokens (no hardcoded hex).
import { useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { T, toneColors } from '../theme'
import type { Tone } from '../api'

/**
 * Tiny dependency-free tooltip: wraps its children and shows a themed bubble
 * on hover/focus. Positioned below the trigger, styled from theme tokens only.
 */
export function Tooltip({
  content,
  children,
  maxWidth = 260,
}: {
  content: ReactNode
  children: ReactNode
  maxWidth?: number
}) {
  const [show, setShow] = useState(false)
  return (
    <span
      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
    >
      {children}
      {show && (
        <span
          role="tooltip"
          style={{
            position: 'absolute',
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            marginTop: 6,
            zIndex: 50,
            maxWidth,
            width: 'max-content',
            padding: '7px 9px',
            fontSize: 11.5,
            fontWeight: 400,
            lineHeight: 1.4,
            letterSpacing: 0,
            textTransform: 'none',
            textAlign: 'left',
            color: T.text,
            background: T.card,
            border: `1px solid ${T.border}`,
            borderRadius: T.radiusMd,
            boxShadow: T.shadowMd,
            whiteSpace: 'normal',
            pointerEvents: 'none',
          }}
        >
          {content}
        </span>
      )}
    </span>
  )
}

/** Small circled "i" that reveals an explanatory Tooltip on hover/focus. */
export function InfoDot({ tip, maxWidth }: { tip: ReactNode; maxWidth?: number }) {
  return (
    <Tooltip content={tip} maxWidth={maxWidth}>
      <span
        tabIndex={0}
        aria-label="More information"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 14,
          height: 14,
          fontSize: 9.5,
          fontWeight: 700,
          fontStyle: 'italic',
          fontFamily: T.font,
          lineHeight: 1,
          borderRadius: 9999,
          border: `1px solid ${T.border}`,
          background: T.bgElevated,
          color: T.muted,
          cursor: 'help',
          userSelect: 'none',
        }}
      >
        i
      </span>
    </Tooltip>
  )
}

export function Button({
  children,
  onClick,
  variant = 'default',
  size = 'md',
  disabled,
  title,
  active,
  type = 'button',
  style,
}: {
  children: ReactNode
  onClick?: () => void
  variant?: 'default' | 'primary' | 'danger' | 'ghost'
  size?: 'sm' | 'md'
  disabled?: boolean
  title?: string
  active?: boolean
  type?: 'button' | 'submit'
  style?: CSSProperties
}) {
  const pad = size === 'sm' ? '4px 8px' : '6px 12px'
  const base: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: pad,
    fontSize: size === 'sm' ? 12 : 13,
    fontWeight: 500,
    lineHeight: 1.2,
    borderRadius: T.radiusMd,
    border: `1px solid ${T.border}`,
    background: T.bgElevated,
    color: T.text,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.55 : 1,
    whiteSpace: 'nowrap',
    transition: 'background 120ms ease, border-color 120ms ease',
  }
  if (variant === 'primary') {
    base.background = T.accent
    base.color = T.accentFg
    base.borderColor = T.accent
  } else if (variant === 'danger') {
    base.background = T.dangerSubtle
    base.color = T.danger
    base.borderColor = T.danger
  } else if (variant === 'ghost') {
    base.background = 'transparent'
    base.borderColor = 'transparent'
    base.color = T.muted
  }
  if (active) {
    base.background = T.accentSubtle
    base.color = T.accent
    base.borderColor = T.accent
  }
  return (
    <button type={type} title={title} disabled={disabled} onClick={onClick} style={{ ...base, ...style }}>
      {children}
    </button>
  )
}

export function Chip({ tone, children }: { tone: Tone; children: ReactNode }) {
  const { fg, bg } = toneColors(tone)
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 8px',
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: 0.2,
        borderRadius: 9999,
        background: bg,
        color: fg,
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  )
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '1px 7px',
        fontSize: 11,
        borderRadius: T.radiusSm,
        background: T.bgElevated,
        color: T.muted,
        border: `1px solid ${T.border}`,
        whiteSpace: 'nowrap',
        maxWidth: 160,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}
    >
      {children}
    </span>
  )
}

export function CountBadge({ n }: { n: number }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 20,
        height: 20,
        padding: '0 6px',
        fontSize: 12,
        fontWeight: 600,
        borderRadius: 9999,
        background: T.bgElevated,
        color: T.muted,
        border: `1px solid ${T.border}`,
      }}
    >
      {n}
    </span>
  )
}

export function RankBadge({ position, title }: { position: number; title?: string }) {
  return (
    <span
      title={title}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 20,
        height: 20,
        padding: '0 6px',
        fontSize: 11,
        fontWeight: 700,
        borderRadius: 9999,
        background: T.accentSubtle,
        color: T.accent,
        cursor: title ? 'help' : 'default',
      }}
    >
      #{position}
    </span>
  )
}

export function Select<V extends string>({
  value,
  onChange,
  options,
  title,
  ariaLabel,
}: {
  value: V
  onChange: (v: V) => void
  options: { key: V; label: string }[]
  title?: string
  ariaLabel?: string
}) {
  return (
    <select
      value={value}
      title={title}
      aria-label={ariaLabel}
      onChange={(e) => onChange(e.target.value as V)}
      style={{
        appearance: 'auto',
        padding: '6px 10px',
        fontSize: 13,
        borderRadius: T.radiusMd,
        border: `1px solid ${T.border}`,
        background: T.bgElevated,
        color: T.text,
        cursor: 'pointer',
      }}
    >
      {options.map((o) => (
        <option key={o.key} value={o.key}>
          {o.label}
        </option>
      ))}
    </select>
  )
}

export function SegmentedControl<V extends string>({
  value,
  onChange,
  options,
}: {
  value: V
  onChange: (v: V) => void
  options: { key: V; label: string; title?: string }[]
}) {
  return (
    <div
      role="tablist"
      style={{
        display: 'inline-flex',
        padding: 2,
        gap: 2,
        borderRadius: T.radiusMd,
        border: `1px solid ${T.border}`,
        background: T.bgElevated,
      }}
    >
      {options.map((o) => {
        const on = o.key === value
        return (
          <button
            key={o.key}
            role="tab"
            aria-selected={on}
            title={o.title}
            onClick={() => onChange(o.key)}
            style={{
              padding: '5px 12px',
              fontSize: 13,
              fontWeight: 500,
              borderRadius: T.radiusSm,
              border: 'none',
              cursor: 'pointer',
              background: on ? T.accent : 'transparent',
              color: on ? T.accentFg : T.muted,
            }}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}
