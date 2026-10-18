import type { ReactNode } from 'react'
import { cn } from '@/components/ui/cn'
import { compact } from '../ui/format'

/**
 * Figures — the forms where the answer is a number rather than a plot.
 *
 * A stat tile is `label · value · delta · trend`. The delta is signed against a
 * named period and coloured by direction *and* whether up is good, because for
 * AI spend and failed payments up is bad; an arrow carries the same information
 * for anyone who cannot read the hue.
 */

export function Sparkline({
  points,
  slot = 1,
  className,
}: {
  points: number[]
  slot?: 1 | 2
  className?: string
}) {
  if (points.length < 2) return null
  const w = 96
  const h = 28
  const max = Math.max(...points)
  const min = Math.min(...points)
  const span = max - min || 1
  const x = (i: number) => (i / (points.length - 1)) * w
  const y = (v: number) => h - 2 - ((v - min) / span) * (h - 4)
  const d = points.map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i)},${y(v)}`).join(' ')

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className={cn('h-7 w-24 shrink-0', className)}
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      <path d={d} fill="none" stroke="var(--line-strong)" strokeWidth="1.5" strokeLinecap="round" />
      {/* The current period is the only part in the accent hue. */}
      <path
        d={points
          .slice(-2)
          .map((v, i) => `${i === 0 ? 'M' : 'L'}${x(points.length - 2 + i)},${y(v)}`)
          .join(' ')}
        fill="none"
        stroke={`var(--chart-${slot})`}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle
        cx={x(points.length - 1)}
        cy={y(points[points.length - 1]!)}
        r="2.5"
        fill={`var(--chart-${slot})`}
      />
    </svg>
  )
}

export function StatTile({
  label,
  value,
  delta,
  deltaLabel,
  upIsGood = true,
  trend,
  trendSlot,
  footnote,
  className,
}: {
  label: string
  value: ReactNode
  /** Signed fraction, e.g. 0.12 for +12%. Null renders no delta. */
  delta?: number | null
  deltaLabel?: string
  upIsGood?: boolean
  trend?: number[]
  trendSlot?: 1 | 2
  footnote?: ReactNode
  className?: string
}) {
  const hasDelta = delta !== null && delta !== undefined && Number.isFinite(delta)
  const rising = hasDelta && delta! > 0
  const flat = hasDelta && Math.abs(delta!) < 0.0005
  const good = rising === upIsGood
  const deltaTone = flat
    ? 'text-ink-muted'
    : good
      ? 'text-brand-600 dark:text-brand-300'
      : 'text-flare-600 dark:text-flare-100'

  return (
    <div
      className={cn(
        'flex flex-col justify-between gap-3 rounded-card border border-line bg-surface p-4 shadow-card',
        className,
      )}
    >
      <p className="text-[0.7rem] font-semibold tracking-[0.1em] text-ink-muted uppercase">
        {label}
      </p>
      <div className="flex items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="font-display text-[1.75rem] leading-none font-bold tracking-tight text-ink tabular-nums">
            {value}
          </p>
          {hasDelta && (
            <p className={cn('mt-1.5 flex items-center gap-1 text-xs font-medium', deltaTone)}>
              <span aria-hidden="true">{flat ? '→' : rising ? '↑' : '↓'}</span>
              {Math.abs(delta! * 100).toFixed(1)}%
              {deltaLabel && <span className="font-normal text-ink-muted">{deltaLabel}</span>}
            </p>
          )}
          {!hasDelta && footnote && <p className="mt-1.5 text-xs text-ink-muted">{footnote}</p>}
        </div>
        {trend && trend.length > 1 && <Sparkline points={trend} slot={trendSlot} />}
      </div>
    </div>
  )
}

/**
 * An ordinal breakdown — plan tiers, statuses ranked by severity. One hue in
 * monotone steps, because swapping the order would change the meaning.
 */
export function TierBars({
  rows,
  total,
  formatValue = compact,
}: {
  rows: { label: string; value: number; tier?: 1 | 2 | 3 }[]
  total?: number
  formatValue?: (n: number) => string
}) {
  const sum = total ?? rows.reduce((a, r) => a + r.value, 0)
  if (sum === 0) {
    return <p className="py-4 text-sm text-ink-muted">Nothing recorded yet.</p>
  }
  return (
    <ul className="flex flex-col gap-3">
      {rows.map((row, i) => {
        const pct = (row.value / sum) * 100
        return (
          <li key={row.label}>
            <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
              <span className="truncate text-ink">{row.label}</span>
              <span className="shrink-0 text-ink-muted tabular-nums">
                <span className="font-semibold text-ink">{formatValue(row.value)}</span>{' '}
                {pct.toFixed(0)}%
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-pill bg-sunk">
              <div
                className="h-full rounded-pill"
                style={{
                  width: `${Math.max(pct, row.value > 0 ? 1.5 : 0)}%`,
                  backgroundColor: `var(--chart-tier-${row.tier ?? Math.min(3, i + 1)})`,
                }}
              />
            </div>
          </li>
        )
      })}
    </ul>
  )
}

/** A meter whose fill carries severity; the track is a lighter step of the same hue. */
export function Meter({
  value,
  max,
  label,
  tone = 'good',
}: {
  value: number
  max: number
  label: string
  tone?: 'good' | 'warning' | 'critical'
}) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0
  return (
    <div
      role="meter"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className="h-2 w-full overflow-hidden rounded-pill bg-sunk"
    >
      <div
        className="h-full rounded-pill transition-[width]"
        style={{ width: `${pct}%`, backgroundColor: `var(--chart-${tone})` }}
      />
    </div>
  )
}
