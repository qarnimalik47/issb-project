'use client'

import { useEffect, useRef } from 'react'
import type { ExamCounts } from '@/lib/tests/exam-format'
import { AlertIcon, ChevronIcon } from './icons'
import { NavLegend, QuestionNav } from './QuestionNav'
import { btnLarge, btnPrimary, btnSecondary, card } from './ui'
import type { ExamStrings } from './types'

/**
 * The last stop before submitting: what's answered, blank and flagged, with the
 * full grid to jump back into any question. A failed manual submit lands here
 * with an explicit retry rather than resubmitting on its own.
 */
export function ReviewScreen({
  questionIds,
  answers,
  flags,
  counts,
  t,
  error,
  onJump,
  onBack,
  onSubmit,
  onRetry,
}: {
  questionIds: string[]
  answers: Record<string, string>
  flags: string[]
  counts: ExamCounts
  t: ExamStrings
  error: string | null
  onJump: (index: number) => void
  onBack: () => void
  onSubmit: () => void
  onRetry: () => void
}) {
  const headingRef = useRef<HTMLHeadingElement>(null)
  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true })
  }, [])

  const stats: [number, string, string][] = [
    [counts.answered, t.legendAnswered, 'text-brand-700 dark:text-brand-300'],
    [counts.unanswered, t.legendBlank, counts.unanswered ? 'text-ink' : 'text-ink-muted'],
    [
      counts.flagged,
      t.legendFlagged,
      counts.flagged ? 'text-amber-700 dark:text-amber-300' : 'text-ink-muted',
    ],
  ]

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-10">
      <section className={`${card} animate-question-in`}>
        <div className="px-10 pt-9 pb-6">
          <h1
            ref={headingRef}
            tabIndex={-1}
            className="text-2xl font-semibold tracking-tight text-ink outline-none"
          >
            {t.reviewTitle}
          </h1>
          <p className="mt-2 max-w-2xl leading-relaxed text-ink-muted">{t.reviewIntro}</p>

          <dl className="mt-7 grid grid-cols-3 gap-4">
            {stats.map(([value, label, tone]) => (
              <div key={label} className="rounded-xl border border-line bg-surface px-5 py-4">
                <dt className="text-sm text-ink-muted">{label}</dt>
                <dd className={`m-0 mt-1 text-3xl font-semibold tabular-nums ${tone}`}>{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="flex flex-col gap-5 border-t border-line px-10 py-7">
          <QuestionNav
            questionIds={questionIds}
            answers={answers}
            flags={flags}
            current={null}
            onJump={onJump}
            t={t}
            columns={10}
          />
          <NavLegend t={t} />
        </div>

        {error && (
          <div
            role="alert"
            className="mx-10 mb-6 flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200"
          >
            <span className="flex items-start gap-2">
              <AlertIcon className="mt-0.5 size-4 shrink-0" />
              {error}
            </span>
            <button type="button" onClick={onRetry} className={btnSecondary}>
              {t.retry}
            </button>
          </div>
        )}

        <div className="flex items-center justify-between gap-4 border-t border-line bg-surface px-10 py-6">
          <button type="button" onClick={onBack} className={btnSecondary}>
            <ChevronIcon className="size-4 rotate-180 rtl:rotate-0" />
            {t.backToQuestions}
          </button>
          <button type="button" onClick={onSubmit} className={`${btnPrimary} ${btnLarge} min-w-40`}>
            {t.submit}
          </button>
        </div>
      </section>
    </main>
  )
}
