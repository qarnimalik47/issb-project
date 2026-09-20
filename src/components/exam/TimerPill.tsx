import { formatClock, timerTone } from '@/lib/tests/exam-format'
import { interpolate } from '@/lib/i18n/format'
import { ClockIcon } from './icons'
import type { ExamStrings } from './types'

const TONE = {
  normal: 'border-line bg-raised text-ink',
  warning:
    'border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-700 dark:bg-amber-950/50 dark:text-amber-200',
  danger:
    'border-red-300 bg-red-50 text-red-800 animate-pulse-danger dark:border-red-800 dark:bg-red-950/50 dark:text-red-200',
} as const

/**
 * The countdown. Always LTR (`dir="ltr"`) — a clock reads the same way in any
 * language — with tabular digits so it doesn't jitter.
 *
 * The ticking digits are hidden from assistive tech; a minute-granular
 * sentence stands in for them, and milestones are announced separately.
 */
export function TimerPill({ remaining, t }: { remaining: number | null; t: ExamStrings }) {
  if (remaining == null) {
    return (
      <span className="inline-flex items-center gap-2 rounded-pill border border-line bg-raised px-3 py-1.5 text-sm text-ink-muted">
        <ClockIcon className="size-4" />
        {t.untimed}
      </span>
    )
  }
  const tone = timerTone(remaining)
  const minutes = Math.ceil(remaining / 60)
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-pill border px-3 py-1.5 text-sm font-semibold ${TONE[tone]}`}
    >
      <ClockIcon className="size-4" />
      <span
        dir="ltr"
        aria-hidden="true"
        className="font-mono tabular-nums"
        suppressHydrationWarning
      >
        {formatClock(remaining)}
      </span>
      <span className="sr-only">
        {t.timeRemaining}:{' '}
        {minutes > 1 ? interpolate(t.announceMinutes, { minutes }) : t.announceOneMinute}
      </span>
    </span>
  )
}
