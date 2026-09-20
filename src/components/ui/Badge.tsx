import type { ComponentProps } from 'react'
import { cn } from './cn'

type Tone = 'neutral' | 'brass' | 'green' | 'flare'

const TONES: Record<Tone, string> = {
  neutral: 'border-line bg-sunk text-ink-muted',
  brass:
    'border-brass-200 bg-brass-50 text-brass-700 dark:border-brass-700 dark:bg-brass-900 dark:text-brass-200',
  green:
    'border-brand-200 bg-brand-50 text-brand-700 dark:border-brand-700 dark:bg-brand-950 dark:text-brand-200',
  flare:
    'border-flare-100 bg-flare-50 text-flare-600 dark:border-flare-700 dark:bg-flare-700/25 dark:text-flare-100',
}

export function Badge({
  tone = 'neutral',
  className,
  ...props
}: ComponentProps<'span'> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center gap-1.5 rounded-pill border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap',
        TONES[tone],
        className,
      )}
      {...props}
    />
  )
}
