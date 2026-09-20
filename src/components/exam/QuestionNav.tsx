import { interpolate } from '@/lib/i18n/format'
import { questionStatus, type QuestionStatus } from '@/lib/tests/exam-format'
import { FlagIcon } from './icons'
import { focusRing } from './ui'
import type { ExamStrings } from './types'

const STATUS_CLASS: Record<Exclude<QuestionStatus, 'current'>, string> = {
  answered:
    'border-brand-600 bg-brand-600 text-white dark:border-brand-400 dark:bg-brand-400 dark:text-brand-950',
  flagged:
    'border-amber-400 bg-amber-50 text-amber-900 dark:border-amber-600 dark:bg-amber-950/50 dark:text-amber-200',
  blank: 'border-line bg-raised text-ink-muted hover:border-ink-muted hover:text-ink',
}

function statusLabel(status: Exclude<QuestionStatus, 'current'>, t: ExamStrings): string {
  if (status === 'answered') return t.statusAnswered
  if (status === 'flagged') return t.statusFlagged
  return t.statusBlank
}

/**
 * The question grid, shared by the desktop rail and the review screen. The
 * current question is marked with a ring and `aria-current` on top of its
 * underlying status, so "answered and current" stays visible as both. Flagged
 * items carry a flag glyph — status is never colour alone.
 */
export function QuestionNav({
  questionIds,
  answers,
  flags,
  current,
  onJump,
  t,
  columns = 5,
}: {
  questionIds: string[]
  answers: Record<string, string>
  flags: string[]
  current: number | null
  onJump: (index: number) => void
  t: ExamStrings
  columns?: 5 | 10
}) {
  const flagSet = new Set(flags)
  return (
    <nav aria-label={t.questions}>
      <ol
        className={`m-0 grid list-none gap-2 p-0 ${columns === 10 ? 'grid-cols-5 sm:grid-cols-10' : 'grid-cols-5'}`}
      >
        {questionIds.map((id, i) => {
          const status = questionStatus({
            current: false,
            flagged: flagSet.has(id),
            answered: Boolean(answers[id]),
          }) as Exclude<QuestionStatus, 'current'>
          const isCurrent = i === current
          return (
            <li key={id}>
              <button
                type="button"
                onClick={() => onJump(i)}
                aria-current={isCurrent ? 'step' : undefined}
                aria-label={interpolate(t.navItemLabel, {
                  n: i + 1,
                  status: isCurrent
                    ? `${statusLabel(status, t)}, ${t.statusCurrent}`
                    : statusLabel(status, t),
                })}
                className={`relative flex aspect-square w-full items-center justify-center rounded-lg border font-mono text-sm font-semibold tabular-nums transition-colors ${focusRing} ${STATUS_CLASS[status]} ${
                  isCurrent ? 'ring-2 ring-ink ring-offset-2 ring-offset-raised' : ''
                }`}
              >
                {i + 1}
                {status === 'flagged' && (
                  <FlagIcon className="absolute -end-1 -top-1 size-3.5 rounded-sm bg-amber-400 p-0.5 text-amber-950" />
                )}
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

/** Key to the navigator's states, shown under it. */
export function NavLegend({ t }: { t: ExamStrings }) {
  const items: [string, string][] = [
    [STATUS_CLASS.answered, t.legendAnswered],
    [STATUS_CLASS.flagged, t.legendFlagged],
    [STATUS_CLASS.blank, t.legendBlank],
    ['border-line bg-raised ring-2 ring-ink ring-offset-1 ring-offset-raised', t.legendCurrent],
  ]
  return (
    <ul className="m-0 grid list-none grid-cols-2 gap-x-3 gap-y-2 p-0 text-xs text-ink-muted">
      {items.map(([cls, label]) => (
        <li key={label} className="flex items-center gap-2">
          <span className={`size-3.5 shrink-0 rounded border ${cls}`} aria-hidden="true" />
          {label}
        </li>
      ))}
    </ul>
  )
}
