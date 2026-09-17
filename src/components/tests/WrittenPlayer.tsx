'use client'

/* Interactive capture player; drives state from timers/effects by design. */
/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useRef, useState } from 'react'
import type { Locale } from '@/lib/i18n/config'
import { EvaluationPanel } from './EvaluationPanel'

type Item = { ref: string; questionId: string; prompt: string; promptUr: string | null }
type ResponseView = {
  ref: string
  text: string | null
  ocrText: string | null
  ocrConfirmed: boolean
  hasImage: boolean
}
type Attempt = {
  id: string
  status: string
  mode: string
  timing: Record<string, number>
  items: Item[]
  responses: Record<string, ResponseView>
  remainingSeconds: number | null
}

const inputCls =
  'w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900'

export function WrittenPlayer({
  testTypeId,
  mode,
  locale,
}: {
  testTypeId: string
  mode: 'typed' | 'paper'
  locale: Locale
}) {
  const [attempt, setAttempt] = useState<Attempt | null>(null)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [wi, setWi] = useState(0) // WAT current index
  const [watLeft, setWatLeft] = useState<number | null>(null)
  const [remaining, setRemaining] = useState<number | null>(null)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const answersRef = useRef(answers)
  useEffect(() => {
    answersRef.current = answers
  }, [answers])

  const ur = locale === 'ur'
  const isWat = Boolean(attempt?.timing.perItemSeconds)

  const save = useCallback(
    async (id: string, ref: string, text: string, timingMeta?: Record<string, number>) => {
      await fetch(`/api/written/${id}/save`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ref, text, timingMeta }),
      })
    },
    [],
  )

  useEffect(() => {
    fetch('/api/written', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ testTypeId, mode }),
    })
      .then((r) => r.json().then((d) => ({ ok: r.ok, d })))
      .then(({ ok, d }) => {
        if (!ok) return setError(d?.error?.message ?? 'Could not start test')
        const at: Attempt = d.attempt
        setAttempt(at)
        const init: Record<string, string> = {}
        for (const it of at.items) init[it.ref] = at.responses[it.ref]?.text ?? ''
        setAnswers(init)
        setRemaining(at.remainingSeconds)
        if (at.timing.perItemSeconds) setWatLeft(at.timing.perItemSeconds)
      })
      .catch(() => setError('Network error'))
  }, [testTypeId, mode])

  const submit = useCallback(async () => {
    if (!attempt) return
    await fetch(`/api/written/${attempt.id}/submit`, { method: 'POST' })
    setDone(true)
  }, [attempt])

  // WAT per-word countdown with auto-advance.
  useEffect(() => {
    if (!attempt || !isWat || done || mode === 'paper') return
    if (watLeft == null) return
    if (watLeft <= 0) {
      const item = attempt.items[wi]
      if (item)
        void save(attempt.id, item.ref, answersRef.current[item.ref] ?? '', {
          seconds: attempt.timing.perItemSeconds!,
        })
      if (wi + 1 < attempt.items.length) {
        setWi(wi + 1)
        setWatLeft(attempt.timing.perItemSeconds!)
      } else {
        void submit()
      }
      return
    }
    const t = setTimeout(() => setWatLeft((s) => (s == null ? s : s - 1)), 1000)
    return () => clearTimeout(t)
  }, [attempt, isWat, watLeft, wi, done, mode, save, submit])

  // Total countdown for non-WAT typed tests.
  useEffect(() => {
    if (!attempt || isWat || done || remaining == null) return
    if (remaining <= 0) {
      void submit()
      return
    }
    const t = setTimeout(() => setRemaining((r) => (r == null ? r : r - 1)), 1000)
    return () => clearTimeout(t)
  }, [attempt, isWat, remaining, done, submit])

  // Debounced autosave for non-WAT typed.
  useEffect(() => {
    if (!attempt || isWat || done || mode === 'paper') return
    const t = setTimeout(() => {
      for (const it of attempt.items)
        void save(attempt.id, it.ref, answersRef.current[it.ref] ?? '')
    }, 2000)
    return () => clearTimeout(t)
  }, [answers, attempt, isWat, done, mode, save])

  if (error) return <p className="text-red-600">{error}</p>
  if (!attempt) return <p className="text-neutral-500">Loading…</p>
  if (done) {
    return (
      <div className="flex flex-col gap-4">
        <div className="rounded-lg border border-green-300 bg-green-50 p-6 dark:border-green-800 dark:bg-green-950">
          <p className="font-medium">Your responses were captured.</p>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            You can now request rubric-based AI feedback on your responses.
          </p>
        </div>
        <EvaluationPanel attemptId={attempt.id} />
        <a href="/written" className="text-sm underline">
          Back to written tests
        </a>
      </div>
    )
  }

  // Paper mode: upload + OCR confirm per item.
  if (mode === 'paper') {
    return (
      <div className="flex flex-col gap-6">
        <p className="text-sm text-neutral-500">
          Paper mode: read the prompt, write on paper within the time, then photograph and upload
          your answer sheet. You will confirm the extracted text before it is saved.
        </p>
        {attempt.items.map((it) => (
          <PaperItem key={it.ref} attemptId={attempt.id} item={it} ur={ur} />
        ))}
        <button
          onClick={submit}
          className="w-fit rounded-md bg-green-600 px-4 py-2 text-sm text-white"
        >
          Finish
        </button>
      </div>
    )
  }

  // WAT typed: one word at a time.
  if (isWat) {
    const item = attempt.items[wi]
    if (!item) return <p>Done.</p>
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between text-sm text-neutral-500">
          <span>
            Word {wi + 1} / {attempt.items.length}
          </span>
          <span className={`font-mono ${(watLeft ?? 0) <= 3 ? 'text-red-600' : ''}`}>
            {watLeft}s
          </span>
        </div>
        <div className="rounded-lg border border-neutral-200 p-8 text-center dark:border-neutral-800">
          <div className="text-3xl font-semibold">
            {ur && item.promptUr ? item.promptUr : item.prompt}
          </div>
        </div>
        <input
          autoFocus
          key={item.ref}
          value={answers[item.ref] ?? ''}
          onChange={(e) => setAnswers((a) => ({ ...a, [item.ref]: e.target.value }))}
          placeholder="Write the first sentence that comes to mind…"
          className={inputCls}
        />
        <p className="text-xs text-neutral-400">
          Auto-advances when the timer ends. Blanks are allowed.
        </p>
      </div>
    )
  }

  // Generic typed (SCT / essay / SRT / story / self-description).
  return (
    <div className="flex flex-col gap-6">
      {remaining != null && (
        <div className="text-right font-mono text-sm">
          {Math.floor(remaining / 60)}:{String(remaining % 60).padStart(2, '0')}
        </div>
      )}
      {attempt.items.map((it, i) => (
        <div key={it.ref} className="flex flex-col gap-2">
          <label className="text-sm font-medium">
            {i + 1}. {ur && it.promptUr ? it.promptUr : it.prompt}
          </label>
          <textarea
            rows={3}
            value={answers[it.ref] ?? ''}
            onChange={(e) => setAnswers((a) => ({ ...a, [it.ref]: e.target.value }))}
            className={inputCls}
          />
        </div>
      ))}
      <button
        onClick={submit}
        className="w-fit rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white"
      >
        Submit
      </button>
    </div>
  )
}

function PaperItem({ attemptId, item, ur }: { attemptId: string; item: Item; ur: boolean }) {
  const [ocrText, setOcrText] = useState<string | null>(null)
  const [confirmText, setConfirmText] = useState('')
  const [status, setStatus] = useState<'idle' | 'uploading' | 'processing' | 'ready' | 'confirmed'>(
    'idle',
  )

  async function upload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setStatus('uploading')
    const form = new FormData()
    form.set('ref', item.ref)
    form.set('file', file)
    const res = await fetch(`/api/written/${attemptId}/upload`, { method: 'POST', body: form })
    if (!res.ok) {
      setStatus('idle')
      return
    }
    setStatus('processing')
    // Poll for OCR completion.
    for (let i = 0; i < 15; i++) {
      await new Promise((r) => setTimeout(r, 1000))
      const a = await (await fetch(`/api/written/${attemptId}`)).json()
      const r = a.attempt?.responses?.[item.ref]
      if (r && r.ocrText != null) {
        setOcrText(r.ocrText)
        setConfirmText(r.ocrText)
        setStatus('ready')
        return
      }
    }
    setOcrText('')
    setStatus('ready')
  }

  async function confirm() {
    await fetch(`/api/written/${attemptId}/confirm-ocr`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ref: item.ref, text: confirmText }),
    })
    setStatus('confirmed')
  }

  return (
    <div className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-800">
      <div className="mb-2 font-medium">{ur && item.promptUr ? item.promptUr : item.prompt}</div>
      {status === 'idle' && (
        <input type="file" accept="image/jpeg,image/png" onChange={upload} className="text-sm" />
      )}
      {status === 'uploading' && <p className="text-sm text-neutral-500">Uploading…</p>}
      {status === 'processing' && <p className="text-sm text-neutral-500">Extracting text…</p>}
      {(status === 'ready' || status === 'confirmed') && (
        <div className="flex flex-col gap-2">
          <p className="text-xs text-neutral-400">
            {ocrText
              ? 'Review and correct the extracted text:'
              : 'OCR unavailable — type your answer from the image:'}
          </p>
          <textarea
            rows={3}
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            className={inputCls}
            disabled={status === 'confirmed'}
          />
          {status === 'ready' ? (
            <button
              onClick={confirm}
              className="w-fit rounded-md bg-neutral-900 px-3 py-1.5 text-sm text-white dark:bg-white dark:text-neutral-900"
            >
              Confirm text
            </button>
          ) : (
            <p className="text-sm text-green-600">Confirmed ✓</p>
          )}
        </div>
      )}
    </div>
  )
}
