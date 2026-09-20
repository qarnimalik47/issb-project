'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { ExamAttempt, ExamResult, SaveState } from './types'

const AUTOSAVE_DEBOUNCE_MS = 1500
const RETRY_MS = 4000

type Options = {
  testId: string
  /** Run a specific numbered set rather than a random sample of the pool. */
  setId?: string | null
  initial: ExamAttempt | null
  /** The server stopped accepting writes (deadline passed) — submit now. */
  onClosed: () => void
  /** Save failed after working, or recovered after failing. */
  onSaveTransition: (next: 'error' | 'recovered') => void
}

async function readError(res: Response, fallback: string): Promise<string> {
  try {
    const data = await res.json()
    return data?.error?.message ?? fallback
  } catch {
    return fallback
  }
}

export function useAttempt({ testId, setId, initial, onClosed, onSaveTransition }: Options) {
  const [attempt, setAttempt] = useState<ExamAttempt | null>(initial)
  const [answers, setAnswers] = useState<Record<string, string>>(initial?.answers ?? {})
  const [flags, setFlags] = useState<string[]>(initial?.flags ?? [])
  const [saveState, setSaveState] = useState<SaveState>(initial ? 'saved' : 'idle')

  const answersRef = useRef(answers)
  const flagsRef = useRef(flags)
  useEffect(() => {
    answersRef.current = answers
    flagsRef.current = flags
  }, [answers, flags])

  const callbacksRef = useRef({ onClosed, onSaveTransition })
  useEffect(() => {
    callbacksRef.current = { onClosed, onSaveTransition }
  })

  /** Set by user edits; cleared once a save containing them is sent. */
  const dirtyRef = useRef(false)
  const failedRef = useRef(false)
  const retryRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const saveSeqRef = useRef(0)
  const submittedRef = useRef(false)
  /** Lets a failed save schedule its own retry without referencing itself. */
  const persistRef = useRef<() => void>(() => {})

  /** Create the attempt. Called on Begin — never on mount, because the deadline starts now. */
  const start = useCallback(async (): Promise<ExamAttempt> => {
    let res: Response
    try {
      res = await fetch('/api/attempts', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ testTypeId: testId, ...(setId ? { bankId: setId } : {}) }),
      })
    } catch {
      throw new Error('network')
    }
    if (!res.ok) throw new Error(await readError(res, 'start'))
    const { attempt: a } = (await res.json()) as { attempt: ExamAttempt }
    setAttempt(a)
    setAnswers(a.answers ?? {})
    setFlags(a.flags ?? [])
    setSaveState('saved')
    return a
  }, [testId, setId])

  const persist = useCallback(async () => {
    const a = attempt
    if (!a || submittedRef.current) return
    if (retryRef.current) clearTimeout(retryRef.current)
    dirtyRef.current = false
    const seq = ++saveSeqRef.current
    setSaveState('saving')
    try {
      const res = await fetch(`/api/attempts/${a.id}/autosave`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ answers: answersRef.current, flags: flagsRef.current }),
      })
      if (!res.ok) throw new Error(String(res.status))
      const data = (await res.json()) as { closed?: boolean }
      if (seq !== saveSeqRef.current) return
      setSaveState('saved')
      if (failedRef.current) {
        failedRef.current = false
        callbacksRef.current.onSaveTransition('recovered')
      }
      if (data.closed) callbacksRef.current.onClosed()
    } catch {
      if (seq !== saveSeqRef.current) return
      dirtyRef.current = true
      setSaveState(typeof navigator !== 'undefined' && !navigator.onLine ? 'offline' : 'error')
      if (!failedRef.current) {
        failedRef.current = true
        callbacksRef.current.onSaveTransition('error')
      }
      retryRef.current = setTimeout(() => persistRef.current(), RETRY_MS)
    }
  }, [attempt])
  useEffect(() => {
    persistRef.current = () => void persist()
  }, [persist])

  // Debounced autosave whenever answers or flags change through the setters.
  useEffect(() => {
    if (!attempt || !dirtyRef.current) return
    const t = setTimeout(() => void persist(), AUTOSAVE_DEBOUNCE_MS)
    return () => clearTimeout(t)
  }, [answers, flags, attempt, persist])

  // Save immediately when the connection comes back.
  useEffect(() => {
    function onOnline() {
      if (dirtyRef.current) void persist()
    }
    window.addEventListener('online', onOnline)
    return () => window.removeEventListener('online', onOnline)
  }, [persist])

  // Tab-visibility logging (anti-cheat basics). The event shape is fixed:
  // autosaveSchema only accepts blur | focus | hidden | visible.
  useEffect(() => {
    if (!attempt) return
    const a = attempt
    function onVisibility() {
      if (submittedRef.current) return
      void fetch(`/api/attempts/${a.id}/autosave`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          answers: answersRef.current,
          flags: flagsRef.current,
          integrityEvent: {
            type: document.hidden ? 'hidden' : 'visible',
            at: Math.floor(performance.now()),
          },
        }),
      })
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [attempt])

  // Never leave a retry timer running after unmount.
  useEffect(
    () => () => {
      if (retryRef.current) clearTimeout(retryRef.current)
    },
    [],
  )

  const selectAnswer = useCallback((questionId: string, key: string) => {
    dirtyRef.current = true
    setAnswers((prev) => (prev[questionId] === key ? prev : { ...prev, [questionId]: key }))
  }, [])

  const toggleFlag = useCallback((questionId: string) => {
    dirtyRef.current = true
    setFlags((prev) =>
      prev.includes(questionId) ? prev.filter((id) => id !== questionId) : [...prev, questionId],
    )
  }, [])

  /** Flush any pending change now (e.g. before leaving the page). */
  const saveNow = useCallback(async () => {
    if (dirtyRef.current) await persist()
  }, [persist])

  /**
   * Submit for scoring. Returns null when a submission is already under way.
   *
   * The guard resets only on the automatic path: a failed auto-submit (time
   * ran out) must retry by itself, while a failed manual one waits for the
   * student to press "Try again" — see `retrySubmit` — instead of quietly
   * firing twice.
   */
  const submit = useCallback(
    (auto: boolean): Promise<ExamResult> | null => {
      const a = attempt
      if (submittedRef.current || !a) return null
      submittedRef.current = true
      if (retryRef.current) clearTimeout(retryRef.current)
      return (async () => {
        let res: Response
        try {
          res = await fetch(`/api/attempts/${a.id}/submit`, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ answers: answersRef.current }),
          })
        } catch {
          if (auto) submittedRef.current = false
          throw new Error('network')
        }
        if (!res.ok) {
          if (auto) submittedRef.current = false
          throw new Error(await readError(res, 'submit'))
        }
        const data = (await res.json()) as { result: ExamResult }
        return data.result
      })()
    },
    [attempt],
  )

  /** The explicit "Try again" after a failed manual submit. */
  const retrySubmit = useCallback(() => {
    submittedRef.current = false
    return submit(false)
  }, [submit])

  return {
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
  }
}
