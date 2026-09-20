import { cn } from './cn'

/**
 * Progress carries a number beside it or it is decoration. `label` is read by
 * assistive tech; the visible percentage is the caller's job.
 */
export function Progress({
  value,
  label,
  tone = 'green',
  className,
}: {
  value: number
  label: string
  tone?: 'green' | 'brass'
  className?: string
}) {
  const pct = Math.max(0, Math.min(100, Math.round(value)))
  return (
    <div
      className={cn('h-1.5 w-full overflow-hidden rounded-pill bg-sunk', className)}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <div
        className={cn('h-full rounded-pill', tone === 'brass' ? 'bg-brass-500' : 'bg-brand-600')}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
