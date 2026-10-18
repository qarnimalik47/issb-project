import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/components/ui/cn'

/**
 * The pieces every admin screen is assembled from.
 *
 * Deliberately small and uniform: a panel, a toolbar, a table shell, a status
 * pill, an empty state. When each screen invents its own card, an admin panel
 * stops reading as one product — which is most of what makes these things feel
 * unfinished.
 */

/** A titled surface. `actions` sits on the header line, right-aligned. */
export function Section({
  title,
  description,
  actions,
  children,
  className,
  bodyClassName,
}: {
  title?: ReactNode
  description?: ReactNode
  actions?: ReactNode
  children: ReactNode
  className?: string
  bodyClassName?: string
}) {
  return (
    <section
      className={cn(
        'overflow-hidden rounded-card border border-line bg-surface shadow-card',
        className,
      )}
    >
      {(title || actions) && (
        <header className="flex flex-wrap items-start justify-between gap-3 border-b border-line px-5 py-4">
          <div className="min-w-0">
            {title && (
              <h2 className="font-display text-base font-semibold tracking-tight text-ink">
                {title}
              </h2>
            )}
            {description && <p className="mt-1 text-sm text-ink-muted">{description}</p>}
          </div>
          {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
        </header>
      )}
      <div className={cn('px-5 py-4', bodyClassName)}>{children}</div>
    </section>
  )
}

/** Page title, one line of orientation, and the screen's controls. */
export function ScreenHeader({
  title,
  lede,
  actions,
}: {
  title: ReactNode
  lede?: ReactNode
  actions?: ReactNode
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        <h2 className="font-display text-2xl font-bold tracking-tight text-ink">{title}</h2>
        {lede && <p className="mt-2 max-w-2xl text-sm text-ink-muted">{lede}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}

type Tone = 'neutral' | 'good' | 'warning' | 'critical' | 'info'

const PILL_TONES: Record<Tone, string> = {
  neutral: 'border-line bg-sunk text-ink-muted',
  good: 'border-brand-200 bg-brand-50 text-brand-700 dark:border-brand-700 dark:bg-brand-950 dark:text-brand-200',
  warning:
    'border-brass-200 bg-brass-50 text-brass-700 dark:border-brass-700 dark:bg-brass-900 dark:text-brass-200',
  critical:
    'border-flare-100 bg-flare-50 text-flare-600 dark:border-flare-700 dark:bg-flare-700/25 dark:text-flare-100',
  info: 'border-line-strong bg-surface text-ink',
}

const DOT_TONES: Record<Tone, string> = {
  neutral: 'bg-line-strong',
  good: 'bg-brand-500',
  warning: 'bg-brass-500',
  critical: 'bg-flare-500',
  info: 'bg-ink-muted',
}

/**
 * State, never colour alone: the pill always carries its label, and the dot is
 * a second channel for anyone who cannot separate the hues.
 */
export function StatusPill({
  tone = 'neutral',
  dot = true,
  children,
  className,
}: {
  tone?: Tone
  dot?: boolean
  children: ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center gap-1.5 rounded-pill border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap',
        PILL_TONES[tone],
        className,
      )}
    >
      {dot && <span className={cn('size-1.5 shrink-0 rounded-full', DOT_TONES[tone])} />}
      {children}
    </span>
  )
}

/** A horizontally scrollable table shell — admin tables are wide by nature. */
export function TableShell({ children }: { children: ReactNode }) {
  return (
    <div className="-mx-5 overflow-x-auto px-5">
      <table className="w-full min-w-[46rem] border-collapse text-sm">{children}</table>
    </div>
  )
}

export function Th({ className, ...props }: ComponentProps<'th'>) {
  return (
    <th
      className={cn(
        'border-b border-line px-3 pb-2 text-left text-[0.7rem] font-semibold tracking-[0.1em] text-ink-muted uppercase first:pl-0 last:pr-0',
        className,
      )}
      {...props}
    />
  )
}

export function Td({ className, ...props }: ComponentProps<'td'>) {
  return (
    <td
      className={cn(
        'border-b border-line/70 px-3 py-3 align-middle first:pl-0 last:pr-0',
        className,
      )}
      {...props}
    />
  )
}

export function EmptyState({
  title,
  hint,
  action,
}: {
  title: string
  hint?: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-card border border-dashed border-line-strong px-6 py-12 text-center">
      <p className="font-display text-sm font-semibold text-ink">{title}</p>
      {hint && <p className="max-w-sm text-sm text-ink-muted">{hint}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}

/** A short-lived result line: the outcome of the last action taken. */
export function Notice({
  tone = 'good',
  children,
}: {
  tone?: 'good' | 'critical' | 'warning'
  children: ReactNode
}) {
  const tones = {
    good: 'border-brand-200 bg-brand-50 text-brand-700 dark:border-brand-700 dark:bg-brand-950 dark:text-brand-100',
    warning:
      'border-brass-200 bg-brass-50 text-brass-800 dark:border-brass-700 dark:bg-brass-900 dark:text-brass-100',
    critical:
      'border-flare-100 bg-flare-50 text-flare-700 dark:border-flare-700 dark:bg-flare-700/20 dark:text-flare-100',
  }
  return (
    <p className={cn('rounded-lg border px-3 py-2 text-sm', tones[tone])} role="status">
      {children}
    </p>
  )
}

/** A label above a value, for definition-style detail panels. */
export function Field({ label, children }: { label: ReactNode; children: ReactNode }) {
  return (
    <div>
      <dt className="text-[0.7rem] font-semibold tracking-[0.1em] text-ink-muted uppercase">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-ink">{children}</dd>
    </div>
  )
}

const CONTROL =
  'rounded-lg border border-line-strong bg-surface px-3 py-2 text-sm text-ink outline-none transition-colors placeholder:text-ink-muted/70 focus:border-brand-600 focus:ring-2 focus:ring-brass-500/25'

/** Text inputs fill their container; `cn` does not merge, so width lives here. */
export const inputClass = cn(CONTROL, 'w-full')

/** Selects size to their content — a filter row reads as a row, not a stack. */
export const selectClass = cn(CONTROL, 'max-w-full')

export function Label({ className, ...props }: ComponentProps<'label'>) {
  return (
    <label
      className={cn('block text-xs font-semibold tracking-wide text-ink-muted', className)}
      {...props}
    />
  )
}
