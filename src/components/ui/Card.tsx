import type { ComponentProps, ReactNode } from 'react'
import { cn } from './cn'

/**
 * White on sand. The canvas does the lifting, so the shadow stays almost
 * invisible — it separates the card from the field-paper grid, nothing more.
 */
export function Card({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn('rounded-card border border-line bg-surface p-5 shadow-card', className)}
      {...props}
    />
  )
}

/** The one dark element per screen. Use it for what the candidate does next. */
export function Panel({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'rounded-panel border border-brand-900 bg-brand-800 p-6 text-brand-50 shadow-raised dark:bg-brand-900',
        className,
      )}
      {...props}
    />
  )
}

/** A figure and what it counts, sharing a baseline. */
export function Stat({
  value,
  label,
  tone = 'ink',
}: {
  value: ReactNode
  label: ReactNode
  tone?: 'ink' | 'brass' | 'inverse'
}) {
  const valueTone =
    tone === 'brass' ? 'text-brass-600' : tone === 'inverse' ? 'text-brass-300' : 'text-ink'
  const labelTone = tone === 'inverse' ? 'text-brand-200' : 'text-ink-muted'
  return (
    <div>
      <div className={cn('font-display text-3xl leading-none font-bold tabular-nums', valueTone)}>
        {value}
      </div>
      <div className={cn('mt-1.5 text-sm', labelTone)}>{label}</div>
    </div>
  )
}
