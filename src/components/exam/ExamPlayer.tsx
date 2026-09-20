'use client'

/**
 * The MCQ exam: instructions → active ⇄ review → submitting → result.
 *
 * This file and useAttempt.ts own all state and all networking; every other
 * component in this folder is a pure function of its props. There is no
 * "loading" phase: the first paint is either the instructions or — when the
 * server hands over an in-progress attempt — question 1, already populated.
 */
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Locale } from '@/lib/i18n/config'
import { interpolate } from '@/lib/i18n/format'
import { counts as countExam } from '@/lib/tests/exam-format'
import { ConfirmSubmitDialog } from './ConfirmSubmitDialog'
import { ExamTopBar } from './ExamTopBar'
import { AlertIcon } from './icons'
import { InstructionsScreen } from './InstructionsScreen'
import { LiveAnnouncer } from './LiveAnnouncer'
import { QuestionCard } from './QuestionCard'
import { NavLegend, QuestionNav } from './QuestionNav'
import { ResultScreen } from './ResultScreen'
import { ReviewScreen } from './ReviewScreen'
import { btnSecondary, card, eyebrow } from './ui'
import { useAttempt } from './useAttempt'
import { useExamKeys } from './useExamKeys'
import { useExamTimer } from './useExamTimer'
import { useHydrated } from './useHydrated'
import type { ExamAttempt, ExamResult, ExamStrings, ExamTest, Phase } from './types'

const AUTO_SUBMIT_RETRY_MS = 3000
const ZERO_WIDTH_SPACE = String.fromCharCode(0x200b)

type SubmitMode = 'auto' | 'manual' | 'retry'

export function ExamPlayer({
  test,
  initialAttempt,
  locale,
  t,
  disclaimer,
}: {
  test: ExamTest
  initialAttempt: ExamAttempt | null
  locale: Locale
  t: ExamStrings
  disclaimer: string
}) {
  const ur = locale === 'ur'
  const router = useRouter()
  const hydrated = useHydrated()
  const [phase, setPhase] = useState<Phase>(initialAttempt ? 'active' : 'instructions')
  const [index, setIndex] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ExamResult | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [showResumed, setShowResumed] = useState(initialAttempt != null)
  const [announcement, setAnnouncement] = useState('')
  // Anchored to the client clock at the moment the server's remaining time
  // arrives, so a skewed device clock can't move the deadline.
  const [deadline, setDeadline] = useState<number | null>(() =>
    initialAttempt?.remainingSeconds != null
      ? Date.now() + initialAttempt.remainingSeconds * 1000
      : null,
  )

  function announce(message: string) {
    // Re-announce identical text by making it differ invisibly.
    setAnnouncement((prev) => (prev === message ? message + ZERO_WIDTH_SPACE : message))
  }

  function describe(err: unknown): string {
    const code = err instanceof Error ? err.message : ''
    if (code === 'network') return t.errorNetwork
    if (code === 'start') return t.errorStart
    if (code === 'submit' || !code) return t.errorSubmit
    return code
  }

  const finishRef = useRef<(mode: SubmitMode) => void>(() => {})
  const autoRetryRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(
    () => () => {
      if (autoRetryRef.current) clearTimeout(autoRetryRef.current)
    },
    [],
  )

  const {
    attempt,
    answers,
    flags,
    saveState,
    start,
    selectAnswer,
    toggleFlag,
    saveNow,
    submit,
    retrySubmit,
  } = useAttempt({
    testId: test.id,
    setId: test.setId ?? null,
    initial: initialAttempt,
    onClosed: () => finishRef.current('auto'),
    onSaveTransition: (s) => announce(s === 'error' ? t.announceSaveFailed : t.announceSaved),
  })

  const questions = attempt?.questions ?? []
  const total = questions.length
  const questionIds = questions.map((q) => q.id)
  const examCounts = countExam(questionIds, answers, flags)
  const question = questions[index]

  async function finish(mode: SubmitMode) {
    const pending = mode === 'retry' ? retrySubmit() : submit(mode === 'auto')
    if (!pending) return
    if (autoRetryRef.current) clearTimeout(autoRetryRef.current)
    setConfirmOpen(false)
    setError(null)
    setPhase('submitting')
    try {
      const r = await pending
      setResult(r)
      setPhase('result')
      window.scrollTo({ top: 0 })
    } catch (err) {
      setError(describe(err))
      if (mode === 'auto') {
        // Time is up: keep trying on our own until it lands.
        autoRetryRef.current = setTimeout(() => finishRef.current('auto'), AUTO_SUBMIT_RETRY_MS)
      } else {
        setPhase('review')
      }
    }
  }
  useEffect(() => {
    finishRef.current = (mode) => void finish(mode)
  })

  const { remaining, resync } = useExamTimer(deadline, phase === 'active' || phase === 'review', {
    onMilestone: (m) =>
      announce(
        m >= 120
          ? interpolate(t.announceMinutes, { minutes: m / 60 })
          : m === 60
            ? t.announceOneMinute
            : interpolate(t.announceSeconds, { seconds: m }),
      ),
    onExpire: () => {
      announce(t.announceTimeUp)
      finishRef.current('auto')
    },
  })

  async function begin() {
    setError(null)
    setPhase('starting')
    try {
      const a = await start()
      setDeadline(a.remainingSeconds != null ? Date.now() + a.remainingSeconds * 1000 : null)
      resync()
      setIndex(0)
      setPhase('active')
      announce(interpolate(t.announceQuestion, { n: 1, total: a.questions.length }))
    } catch (err) {
      setError(describe(err))
      setPhase('instructions')
    }
  }

  function goTo(i: number) {
    if (i < 0 || i >= total) return
    setIndex(i)
    setPhase('active')
    announce(interpolate(t.announceQuestion, { n: i + 1, total }))
  }

  function openReview() {
    setShowResumed(false)
    setPhase('review')
  }

  function primary() {
    if (index < total - 1) goTo(index + 1)
    else openReview()
  }

  function requestSubmit() {
    if (examCounts.unanswered > 0 || examCounts.flagged > 0) setConfirmOpen(true)
    else void finish('manual')
  }

  async function exit() {
    await saveNow()
    router.push('/practice')
  }

  useExamKeys(phase === 'active' && !confirmOpen, locale, {
    select: (i) => {
      const option = question?.options?.[i]
      if (question && option) selectAnswer(question.id, option.key)
    },
    flag: () => question && toggleFlag(question.id),
    previous: () => goTo(index - 1),
    next: () => goTo(index + 1),
    primary,
  })

  const live =
    attempt && phase !== 'result'
      ? {
          answered: examCounts.answered,
          total,
          remaining,
          saveState,
          onExit: () => void exit(),
        }
      : undefined

  return (
    <>
      <ExamTopBar testName={test.name} t={t} locale={locale} live={live} />
      <LiveAnnouncer message={announcement} />

      {(phase === 'instructions' || phase === 'starting') && (
        <InstructionsScreen
          test={test}
          t={t}
          starting={phase === 'starting'}
          ready={hydrated}
          error={error}
          disclaimer={disclaimer}
          onBegin={() => void begin()}
        />
      )}

      {phase === 'active' && question && (
        <div className="mx-auto grid w-full max-w-[1400px] gap-8 px-6 py-8 lg:grid-cols-[minmax(0,1fr)_19rem]">
          <div className="mx-auto flex w-full max-w-[56rem] flex-col gap-4">
            {showResumed && (
              <div
                role="note"
                className="flex items-start justify-between gap-4 rounded-xl border border-brand-200 bg-brand-50 px-5 py-3.5 text-sm text-brand-900 dark:border-brand-800 dark:bg-brand-950/40 dark:text-brand-100"
              >
                <p>
                  <span className="font-semibold">{t.resumeTitle}.</span> {t.resumeBody}
                </p>
                <button
                  type="button"
                  onClick={() => setShowResumed(false)}
                  className="shrink-0 font-medium underline underline-offset-2"
                >
                  {t.resume}
                </button>
              </div>
            )}
            <QuestionCard
              key={question.id}
              question={question}
              number={index + 1}
              total={total}
              testCode={test.code}
              selected={answers[question.id]}
              flagged={flags.includes(question.id)}
              ur={ur}
              t={t}
              onSelect={(key) => selectAnswer(question.id, key)}
              onToggleFlag={() => toggleFlag(question.id)}
              onPrevious={() => goTo(index - 1)}
              onPrimary={primary}
            />
          </div>

          <aside className="hidden lg:block">
            <div className={`${card} sticky top-24 flex flex-col gap-5 p-5`}>
              <div className="flex items-baseline justify-between gap-2">
                <h2 className={eyebrow}>{t.questions}</h2>
                <span className="text-sm text-ink-muted tabular-nums">
                  {interpolate(t.answeredOf, { answered: examCounts.answered, total })}
                </span>
              </div>
              <QuestionNav
                questionIds={questionIds}
                answers={answers}
                flags={flags}
                current={index}
                onJump={goTo}
                t={t}
              />
              <NavLegend t={t} />
              <button type="button" onClick={openReview} className={`${btnSecondary} w-full`}>
                {t.reviewAndSubmit}
              </button>
            </div>
          </aside>
        </div>
      )}

      {phase === 'review' && (
        <ReviewScreen
          questionIds={questionIds}
          answers={answers}
          flags={flags}
          counts={examCounts}
          t={t}
          error={error}
          onJump={goTo}
          onBack={() => goTo(index)}
          onSubmit={requestSubmit}
          onRetry={() => void finish('retry')}
        />
      )}

      {phase === 'submitting' && (
        <main className="mx-auto w-full max-w-md px-6 py-24">
          <div className={`${card} flex flex-col items-center gap-4 px-8 py-10 text-center`}>
            <span
              className="size-8 animate-spin rounded-full border-4 border-line border-t-brand-600"
              aria-hidden="true"
            />
            <p className="font-medium text-ink">{t.submitting}</p>
            {error && (
              <p
                role="alert"
                className="flex items-start gap-2 text-sm text-amber-800 dark:text-amber-200"
              >
                <AlertIcon className="mt-0.5 size-4 shrink-0" />
                {error}
              </p>
            )}
          </div>
        </main>
      )}

      {phase === 'result' && result && (
        <ResultScreen
          result={result}
          testId={test.id}
          testName={test.name}
          t={t}
          ur={ur}
          disclaimer={disclaimer}
        />
      )}

      <ConfirmSubmitDialog
        open={confirmOpen}
        unanswered={examCounts.unanswered}
        flagged={examCounts.flagged}
        t={t}
        onConfirm={() => void finish('manual')}
        onClose={() => setConfirmOpen(false)}
      />
    </>
  )
}
