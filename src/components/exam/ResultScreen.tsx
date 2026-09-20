'use client'

import { useEffect, useRef } from 'react'
import { interpolate } from '@/lib/i18n/format'
import { formatClock, humanizeTopic } from '@/lib/tests/exam-format'
import { AlertIcon, CheckIcon, ClockIcon, CrossIcon, DashIcon } from './icons'
import { ResultBreakdown } from './ResultBreakdown'
import { btnPrimary, btnSecondary, card, eyebrow } from './ui'
import type { ExamResult, ExamStrings } from './types'

/** Score ring. Purely decorative — the score is also written out in text beside it. */
function ScoreRing({ percentage }: { percentage: number }) {
  const r = 52
  const c = 2 * Math.PI * r
  const pct = Math.min(100, Math.max(0, percentage))
  return (
    <div className="relative size-36 shrink-0" dir="ltr" aria-hidden="true">
      <svg viewBox="0 0 120 120" className="size-full -rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" strokeWidth="10" className="stroke-line" />
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct / 100)}
          className="stroke-brand-600 transition-[stroke-dashoffset] duration-700 ease-(--ease-exam) dark:stroke-brand-400"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-3xl font-semibold tabular-nums text-ink">
        {pct}%
      </span>
    </div>
  )
}

export function ResultScreen({
  result,
  testId,
  testName,
  t,
  ur,
  disclaimer,
}: {
  result: ExamResult
  testId: string
  testName: string
  t: ExamStrings
  ur: boolean
  disclaimer: string
}) {
  const headingRef = useRef<HTMLHeadingElement>(null)
  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true })
  }, [])

  const correct = result.items.filter((i) => i.correct).length
  const skipped = result.items.filter((i) => !i.selected).length
  const incorrect = result.items.length - correct - skipped
  const stats: [React.ReactNode, string, string][] = [
    [
      <CheckIcon key="c" className="size-4" />,
      interpolate(t.correctCount, { count: correct }),
      'text-brand-700 dark:text-brand-300',
    ],
    [
      <CrossIcon key="i" className="size-4" />,
      interpolate(t.incorrectCount, { count: incorrect }),
      'text-red-700 dark:text-red-300',
    ],
    [
      <DashIcon key="s" className="size-4" />,
      interpolate(t.skippedCount, { count: skipped }),
      'text-ink-muted',
    ],
  ]

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-10">
      <section className={`${card} animate-question-in overflow-hidden`}>
        <div className="flex flex-col items-center gap-8 bg-gradient-to-b from-brand-50 to-raised px-10 py-9 sm:flex-row dark:from-brand-950/40">
          <ScoreRing percentage={result.percentage} />
          <div className="flex flex-1 flex-col gap-3 text-center sm:text-start">
            <p className={eyebrow}>{testName}</p>
            <h1
              ref={headingRef}
              tabIndex={-1}
              className="text-2xl font-semibold tracking-tight text-ink outline-none"
            >
              {t.resultTitle}
            </h1>
            <p className="text-4xl font-semibold tracking-tight text-ink tabular-nums">
              {interpolate(t.score, {
                score: result.score,
                total: result.maxScore,
                percentage: result.percentage,
              })}
            </p>
            <ul className="m-0 flex list-none flex-wrap justify-center gap-x-5 gap-y-2 p-0 text-sm sm:justify-start">
              {stats.map(([icon, label, tone]) => (
                <li key={label} className={`inline-flex items-center gap-1.5 font-medium ${tone}`}>
                  {icon}
                  {label}
                </li>
              ))}
              {result.durationSeconds != null && (
                <li className="inline-flex items-center gap-1.5 text-ink-muted">
                  <ClockIcon className="size-4" />
                  {t.timeTaken}{' '}
                  <span dir="ltr" className="font-mono tabular-nums">
                    {formatClock(result.durationSeconds)}
                  </span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {result.expired && (
          <p className="mx-10 mt-6 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
            <AlertIcon className="mt-0.5 size-4 shrink-0" />
            {t.expiredNotice}
          </p>
        )}

        <div className="px-10 py-7">
          <h2 className={eyebrow}>{t.weakTopics}</h2>
          {result.weakTopics.length > 0 ? (
            <ul className="m-0 mt-3 flex list-none flex-wrap gap-2 p-0">
              {result.weakTopics.map((topic) => (
                <li
                  key={topic}
                  className="rounded-pill border border-amber-300 bg-amber-50 px-3 py-1 text-sm font-medium text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200"
                >
                  {humanizeTopic(topic)}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-ink-muted">{t.noWeakTopics}</p>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3 border-t border-line bg-surface px-10 py-5">
          <a href="/practice" className={btnSecondary}>
            {t.backToPractice}
          </a>
          <a href={`/practice/${testId}`} className={btnPrimary}>
            {t.retake}
          </a>
        </div>
      </section>

      <ResultBreakdown items={result.items} t={t} ur={ur} />

      <p className="text-center text-xs text-ink-muted">{disclaimer}</p>
    </main>
  )
}
