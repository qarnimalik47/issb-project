'use client'

/* This interactive player legitimately drives state from effects (mount fetch,
   countdown, auto-submit on timeout). The set-state-in-effect rule is disabled
   for the file rather than scattering many inline suppressions. */
/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useRef, useState } from 'react'
import type { Locale } from '@/lib/i18n/config'

type PlayerQuestion = {
  id: string
  stemEn: string
  stemUr: string | null
  options: { key: string; textEn: string; textUr?: string }[] | null
  topic: string | null
}
type PlayerAttempt = {
  id: string
  status: string
  questions: PlayerQuestion[]
  answers: Record<string, string>
  remainingSeconds: number | null
}
type ResultItem = {
  questionId: string
  stemEn: string
  stemUr: string | null
  options: PlayerQuestion['options']
  selected: string | null
  correctOption: string | null
  correct: boolean
  explanationEn: string | null
  explanationUr: string | null
}
type AttemptResult = {
  score: number
  maxScore: number
  percentage: number
  weakTopics: string[]
  items: ResultItem[]
}

function fmt(sec: number): string {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

export function TestPlayer({ testTypeId, locale }: { testTypeId: string; locale: Locale }) {
  const [attempt, setAttempt] = useState<PlayerAttempt | null>(null)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [index, setIndex] = useState(0)
  const [remaining, setRemaining] = useState<number | null>(null)
  const [result, setResult] = useState<AttemptResult | null>(null)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const answersRef = useRef(answers)
  useEffect(() => {
    answersRef.current = answers
  }, [answers])
  const submittedRef = useRef(false)

  const ur = locale === 'ur'

  const submit = useCallback(
    async (auto = false) => {
      if (submittedRef.current) return
      submittedRef.current = true
      setSubmitting(true)
      const a = attempt
      if (!a) return
      const res = await fetch(`/api/attempts/${a.id}/submit`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ answers: answersRef.current }),
      })
      const data = await res.json()
      setSubmitting(false)
      if (res.ok) setResult(data.result)
      else {
        setError(data?.error?.message ?? 'Submit failed')
        if (auto) submittedRef.current = false
      }
    },
    [attempt],
  )

  // Start attempt on mount.
  useEffect(() => {
    let active = true
    fetch('/api/attempts', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ testTypeId }),
    })
      .then((r) => r.json().then((d) => ({ ok: r.ok, d })))
      .then(({ ok, d }) => {
        if (!active) return
        if (!ok) return setError(d?.error?.message ?? 'Could not start test')
        const at: PlayerAttempt = d.attempt
        setAttempt(at)
        setAnswers(at.answers ?? {})
        setRemaining(at.remainingSeconds)
      })
      .catch(() => active && setError('Network error'))
    return () => {
      active = false
    }
  }, [testTypeId])

  // Countdown timer (server-authoritative deadline; this is display only).
  useEffect(() => {
    if (remaining == null || result) return
    if (remaining <= 0) {
      void submit(true)
      return
    }
    const t = setTimeout(() => setRemaining((r) => (r == null ? r : r - 1)), 1000)
    return () => clearTimeout(t)
  }, [remaining, result, submit])

  // Debounced autosave whenever answers change.
  useEffect(() => {
    if (!attempt || result) return
    const t = setTimeout(() => {
      void fetch(`/api/attempts/${attempt.id}/autosave`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ answers: answersRef.current }),
      })
    }, 1500)
    return () => clearTimeout(t)
  }, [answers, attempt, result])

  // Tab-visibility logging (anti-cheat basics).
  useEffect(() => {
    if (!attempt || result) return
    function onVisibility() {
      const a = attempt
      if (!a) return
      void fetch(`/api/attempts/${a.id}/autosave`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          answers: answersRef.current,
          integrityEvent: {
            type: document.hidden ? 'hidden' : 'visible',
            at: Math.floor(performance.now()),
          },
        }),
      })
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [attempt, result])

  if (error) return <p className="text-red-600">{error}</p>
  if (!attempt) return <p className="text-neutral-500">Loading…</p>

  if (result) {
    return (
      <div className="flex flex-col gap-6">
        <div className="rounded-lg border border-neutral-200 p-6 dark:border-neutral-800">
          <div className="text-3xl font-semibold">
            {result.score} / {result.maxScore} ({result.percentage}%)
          </div>
          {result.weakTopics.length > 0 && (
            <p className="mt-2 text-sm text-amber-600">
              Weak topics: {result.weakTopics.join(', ')}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-4">
          {result.items.map((it, i) => (
            <div
              key={it.questionId}
              className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-800"
            >
              <div className="font-medium">
                {i + 1}. {ur && it.stemUr ? it.stemUr : it.stemEn}
              </div>
              <ul className="mt-2 space-y-1 text-sm">
                {it.options?.map((o) => {
                  const isCorrect = o.key === it.correctOption
                  const isSelected = o.key === it.selected
                  return (
                    <li
                      key={o.key}
                      className={
                        isCorrect
                          ? 'text-green-700'
                          : isSelected
                            ? 'text-red-600 line-through'
                            : 'text-neutral-600 dark:text-neutral-400'
                      }
                    >
                      {o.key}. {ur && o.textUr ? o.textUr : o.textEn}
                      {isCorrect ? ' ✓' : isSelected ? ' ✗' : ''}
                    </li>
                  )
                })}
              </ul>
              {(it.explanationEn || it.explanationUr) && (
                <p className="mt-2 text-sm text-neutral-500">
                  {ur && it.explanationUr ? it.explanationUr : it.explanationEn}
                </p>
              )}
            </div>
          ))}
        </div>
        <a href="/practice" className="text-sm underline">
          Back to practice
        </a>
      </div>
    )
  }

  const q = attempt.questions[index]
  if (!q) return <p className="text-neutral-500">No questions.</p>
  const answeredCount = Object.keys(answers).length

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <span className="text-sm text-neutral-500">
          Question {index + 1} / {attempt.questions.length} · {answeredCount} answered
        </span>
        {remaining != null && (
          <span className={`font-mono text-sm ${remaining < 30 ? 'text-red-600' : ''}`}>
            {fmt(remaining)}
          </span>
        )}
      </div>

      <div className="rounded-lg border border-neutral-200 p-6 dark:border-neutral-800">
        <div className="mb-4 font-medium">{ur && q.stemUr ? q.stemUr : q.stemEn}</div>
        <div className="flex flex-col gap-2">
          {q.options?.map((o) => (
            <label
              key={o.key}
              className={`flex cursor-pointer items-center gap-3 rounded-md border p-3 text-sm ${
                answers[q.id] === o.key
                  ? 'border-neutral-900 bg-neutral-50 dark:border-white dark:bg-neutral-900'
                  : 'border-neutral-200 dark:border-neutral-800'
              }`}
            >
              <input
                type="radio"
                name={q.id}
                checked={answers[q.id] === o.key}
                onChange={() => setAnswers((a) => ({ ...a, [q.id]: o.key }))}
              />
              <span>
                {o.key}. {ur && o.textUr ? o.textUr : o.textEn}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={index === 0}
          className="rounded-md border border-neutral-300 px-4 py-2 text-sm disabled:opacity-40 dark:border-neutral-700"
        >
          Previous
        </button>
        {index < attempt.questions.length - 1 ? (
          <button
            onClick={() => setIndex((i) => i + 1)}
            className="rounded-md bg-neutral-900 px-4 py-2 text-sm text-white dark:bg-white dark:text-neutral-900"
          >
            Next
          </button>
        ) : (
          <button
            onClick={() => submit(false)}
            disabled={submitting}
            className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {submitting ? 'Submitting…' : 'Submit'}
          </button>
        )}
      </div>
    </div>
  )
}
