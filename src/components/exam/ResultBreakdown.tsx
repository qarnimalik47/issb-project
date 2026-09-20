'use client'

import { useState } from 'react'
import { CheckIcon, CrossIcon, DashIcon } from './icons'
import { QuestionMedia } from './QuestionMedia'
import { card, focusRing } from './ui'
import type { ExamResultItem, ExamStrings } from './types'

type Filter = 'all' | 'incorrect' | 'skipped'
type Outcome = 'correct' | 'incorrect' | 'skipped'

function outcomeOf(item: ExamResultItem): Outcome {
  if (!item.selected) return 'skipped'
  return item.correct ? 'correct' : 'incorrect'
}

const BADGE: Record<Outcome, string> = {
  correct:
    'border-brand-200 bg-brand-50 text-brand-800 dark:border-brand-800 dark:bg-brand-950/50 dark:text-brand-200',
  incorrect:
    'border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/50 dark:text-red-200',
  skipped: 'border-line bg-surface text-ink-muted',
}

function OutcomeBadge({ outcome, t }: { outcome: Outcome; t: ExamStrings }) {
  const Icon = outcome === 'correct' ? CheckIcon : outcome === 'incorrect' ? CrossIcon : DashIcon
  const label =
    outcome === 'correct' ? t.correct : outcome === 'incorrect' ? t.incorrect : t.skipped
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-pill border px-2.5 py-1 text-xs font-semibold ${BADGE[outcome]}`}
    >
      <Icon className="size-3.5" />
      {label}
    </span>
  )
}

/**
 * Per-question review after scoring. Every marking is icon + text, never colour
 * alone: "Your answer" and "Correct answer" are spelled out on the rows they
 * apply to, so the review works for colour-blind and screen-reader users.
 */
export function ResultBreakdown({
  items,
  t,
  ur,
}: {
  items: ExamResultItem[]
  t: ExamStrings
  ur: boolean
}) {
  const [filter, setFilter] = useState<Filter>('all')
  const numbered = items.map((item, i) => ({ item, number: i + 1, outcome: outcomeOf(item) }))
  const shown = numbered.filter(({ outcome }) => filter === 'all' || outcome === filter)
  const filters: [Filter, string, number][] = [
    ['all', t.filterAll, items.length],
    ['incorrect', t.filterIncorrect, numbered.filter((n) => n.outcome === 'incorrect').length],
    ['skipped', t.filterSkipped, numbered.filter((n) => n.outcome === 'skipped').length],
  ]

  return (
    <section aria-labelledby="answer-review" className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 id="answer-review" className="text-xl font-semibold tracking-tight text-ink">
          {t.answerReview}
        </h2>
        <div className="inline-flex rounded-xl border border-line bg-raised p-1">
          {filters.map(([key, label, count]) => (
            <button
              key={key}
              type="button"
              aria-pressed={filter === key}
              onClick={() => setFilter(key)}
              className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors ${focusRing} ${
                filter === key ? 'bg-ink text-raised' : 'text-ink-muted hover:text-ink'
              }`}
            >
              {label} <span className="tabular-nums opacity-70">{count}</span>
            </button>
          ))}
        </div>
      </div>

      {shown.length === 0 ? (
        <p className={`${card} px-8 py-10 text-center text-ink-muted`}>{t.noneInFilter}</p>
      ) : (
        <ol className="m-0 flex list-none flex-col gap-4 p-0">
          {shown.map(({ item, number, outcome }) => {
            const useUrStem = ur && Boolean(item.stemUr)
            const explanation = ur && item.explanationUr ? item.explanationUr : item.explanationEn
            const explanationIsUr = ur && Boolean(item.explanationUr)
            return (
              <li key={item.questionId} className={`${card} px-8 py-6`}>
                <div className="flex items-start justify-between gap-4">
                  <span className="font-mono text-sm font-semibold text-ink-muted tabular-nums">
                    {number}.
                  </span>
                  <OutcomeBadge outcome={outcome} t={t} />
                </div>
                <p
                  lang={useUrStem ? 'ur' : 'en'}
                  dir={useUrStem ? 'rtl' : 'ltr'}
                  className="mt-2 text-start text-lg leading-relaxed font-medium whitespace-pre-line text-ink"
                >
                  {useUrStem ? item.stemUr : item.stemEn}
                </p>
                {item.media && (
                  <div className="mt-4">
                    <QuestionMedia media={item.media} number={number} t={t} />
                  </div>
                )}
                <ul className="m-0 mt-4 flex list-none flex-col gap-2 p-0">
                  {item.options?.map((o) => {
                    const isCorrect = o.key === item.correctOption
                    const isSelected = o.key === item.selected
                    const useUr = ur && Boolean(o.textUr)
                    return (
                      <li
                        key={o.key}
                        className={`flex items-center gap-3 rounded-lg border px-4 py-2.5 text-sm ${
                          isCorrect
                            ? 'border-brand-300 bg-brand-50 dark:border-brand-700 dark:bg-brand-950/40'
                            : isSelected
                              ? 'border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-950/40'
                              : 'border-transparent'
                        }`}
                      >
                        <span className="font-mono font-semibold text-ink-muted">{o.key}</span>
                        <span
                          lang={useUr ? 'ur' : 'en'}
                          dir={useUr ? 'rtl' : 'ltr'}
                          className="min-w-0 flex-1 text-start text-ink"
                        >
                          {useUr ? o.textUr : o.textEn}
                        </span>
                        {isSelected && (
                          <span
                            className={`inline-flex items-center gap-1 text-xs font-semibold ${isCorrect ? 'text-brand-800 dark:text-brand-200' : 'text-red-700 dark:text-red-300'}`}
                          >
                            {isCorrect ? (
                              <CheckIcon className="size-3.5" />
                            ) : (
                              <CrossIcon className="size-3.5" />
                            )}
                            {t.yourAnswer}
                          </span>
                        )}
                        {isCorrect && !isSelected && (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-800 dark:text-brand-200">
                            <CheckIcon className="size-3.5" />
                            {t.correctAnswer}
                          </span>
                        )}
                      </li>
                    )
                  })}
                </ul>
                {explanation && (
                  <div className="mt-4 rounded-lg bg-surface px-4 py-3 text-sm leading-relaxed text-ink-muted">
                    <span className="font-semibold text-ink">{t.explanation}: </span>
                    <span
                      lang={explanationIsUr ? 'ur' : 'en'}
                      dir={explanationIsUr ? 'rtl' : 'ltr'}
                    >
                      {explanation}
                    </span>
                  </div>
                )}
              </li>
            )
          })}
        </ol>
      )}
    </section>
  )
}
