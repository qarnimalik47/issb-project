'use client'

import { useEffect, useRef } from 'react'
import { interpolate } from '@/lib/i18n/format'
import { FlagButton } from './FlagButton'
import { ChevronIcon } from './icons'
import { OptionList } from './OptionList'
import { QuestionMedia } from './QuestionMedia'
import { btnPrimary, btnSecondary, card } from './ui'
import type { ExamQuestion, ExamStrings } from './types'

/**
 * One question. Mounted with `key={question.id}`, so every change of question
 * replays the entrance animation and moves focus to the heading — a keyboard or
 * screen-reader user lands on the new question, not on a stale button.
 */
export function QuestionCard({
  question,
  number,
  total,
  testCode,
  selected,
  flagged,
  ur,
  t,
  onSelect,
  onToggleFlag,
  onPrevious,
  onPrimary,
}: {
  question: ExamQuestion
  number: number
  total: number
  testCode: string
  selected: string | undefined
  flagged: boolean
  ur: boolean
  t: ExamStrings
  onSelect: (key: string) => void
  onToggleFlag: () => void
  onPrevious: () => void
  onPrimary: () => void
}) {
  const headingRef = useRef<HTMLHeadingElement>(null)
  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true })
  }, [])

  const isLast = number === total
  const useUr = ur && Boolean(question.stemUr)
  const options = question.options ?? []

  // Non-verbal items are read figure-first, side by side with the options;
  // mechanical diagrams are usually wide, so they sit above.
  const sideBySide = testCode === 'nonverbal' && question.media

  const body = (
    <>
      {question.media && <QuestionMedia media={question.media} number={number} t={t} />}
      {options.length > 0 ? (
        <OptionList
          questionId={question.id}
          options={options}
          selected={selected}
          onSelect={onSelect}
          ur={ur}
          t={t}
        />
      ) : (
        <p className="rounded-xl border border-dashed border-line p-4 text-sm text-ink-muted">
          {t.optionsMissing}
        </p>
      )}
    </>
  )

  return (
    <article className={`${card} animate-question-in`}>
      <header className="flex items-center justify-between gap-4 border-b border-line px-8 py-4">
        <h2
          ref={headingRef}
          tabIndex={-1}
          className="rounded-md text-sm font-semibold text-ink-muted outline-none"
        >
          {interpolate(t.questionOf, { n: number, total })}
        </h2>
        <FlagButton flagged={flagged} onToggle={onToggleFlag} t={t} />
      </header>

      <div className="flex flex-col gap-7 px-8 py-7">
        <p
          lang={useUr ? 'ur' : 'en'}
          dir={useUr ? 'rtl' : 'ltr'}
          className="text-start text-xl leading-relaxed font-medium whitespace-pre-line text-ink"
        >
          {useUr ? question.stemUr : question.stemEn}
        </p>
        {sideBySide ? (
          <div className="grid items-start gap-8 lg:grid-cols-2">{body}</div>
        ) : (
          <div className="flex flex-col gap-7">{body}</div>
        )}
      </div>

      <footer className="flex items-center justify-between gap-4 border-t border-line px-8 py-4">
        <button type="button" onClick={onPrevious} disabled={number === 1} className={btnSecondary}>
          <ChevronIcon className="size-4 rotate-180 rtl:rotate-0" />
          {t.previous}
        </button>
        <button type="button" onClick={onPrimary} className={btnPrimary}>
          {isLast ? t.review : t.next}
          <ChevronIcon className="size-4 rtl:rotate-180" />
        </button>
      </footer>
    </article>
  )
}
