'use client'

/* Interactive capture player; drives state from timers/effects by design. */
/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useRef, useState } from 'react'
import type { Locale } from '@/lib/i18n/config'
import { EvaluationPanel } from './EvaluationPanel'

type Item = {
  ref: string
  questionId: string
  prompt: string
  promptUr: string | null
  /** Picture Story: signed link to the picture, when the item has one. */
  imageUrl?: string | null
}
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
  'w-full rounded-md border border-line-strong bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900'

export function WrittenPlayer({
  testTypeId,
  mode,
  locale,
  setId = null,
}: {
  testTypeId: string
  mode: 'typed' | 'paper'
  locale: Locale
  /** Run one numbered set rather than the whole published pool. */
  setId?: string | null
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
      body: JSON.stringify({ testTypeId, mode, ...(setId ? { bankId: setId } : {}) }),
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
  }, [testTypeId, mode, setId])

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
  if (!attempt) return <p className="text-ink-muted">Loading…</p>
  if (done) {
    return (
      <div className="flex flex-col gap-4">
        <div className="rounded-lg border border-green-300 bg-green-50 p-6 dark:border-green-800 dark:bg-green-950">
          <p className="font-medium">Your responses were captured.</p>
          <p className="text-sm text-ink-muted">
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
        <p className="text-sm text-ink-muted">
          Paper mode: read the prompt, write on paper within the time, then photograph and upload
          your answer sheet. You will confirm the extracted text before it is saved.
        </p>
        {attempt.items.map((it) => (
          <PaperItem
            key={it.ref}
            attemptId={attempt.id}
            item={it}
            ur={ur}
            withBriefing={Boolean(attempt.timing.planSeconds)}
          />
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
        <div className="flex items-center justify-between text-sm text-ink-muted">
          <span>
            Word {wi + 1} / {attempt.items.length}
          </span>
          <span className={`font-mono ${(watLeft ?? 0) <= 3 ? 'text-red-600' : ''}`}>
            {watLeft}s
          </span>
        </div>
        <div className="rounded-lg border border-line p-8 text-center">
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
        <p className="text-xs text-ink-muted">
          Auto-advances when the timer ends. Blanks are allowed.
        </p>
      </div>
    )
  }

  // Picture Story typed: look at each picture, then write with it hidden.
  if (attempt.timing.viewSeconds && attempt.timing.writeSeconds) {
    return (
      <PictureStoryTyped
        attempt={attempt}
        answers={answers}
        setAnswers={setAnswers}
        save={save}
        submit={submit}
        ur={ur}
      />
    )
  }

  // Group Planning: read the briefing and map, then write a plan against the clock.
  if (attempt.timing.planSeconds) {
    return (
      <PlanningTyped
        attempt={attempt}
        answers={answers}
        setAnswers={setAnswers}
        save={save}
        submit={submit}
        ur={ur}
      />
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

/**
 * The ISSB format: the picture is shown for `viewSeconds`, then taken away and
 * the candidate has `writeSeconds` to write the story. Each story is saved as
 * its write phase ends; after the last one the attempt is submitted. A reload
 * resumes at the first picture with no saved story.
 */
function PictureStoryTyped({
  attempt,
  answers,
  setAnswers,
  save,
  submit,
  ur,
}: {
  attempt: Attempt
  answers: Record<string, string>
  setAnswers: React.Dispatch<React.SetStateAction<Record<string, string>>>
  save: (
    id: string,
    ref: string,
    text: string,
    timingMeta?: Record<string, number>,
  ) => Promise<void>
  submit: () => Promise<void>
  ur: boolean
}) {
  const viewSeconds = attempt.timing.viewSeconds!
  const writeSeconds = attempt.timing.writeSeconds!
  const [idx, setIdx] = useState(() => {
    const first = attempt.items.findIndex((it) => !attempt.responses[it.ref]?.text)
    return first < 0 ? 0 : first
  })
  const [phase, setPhase] = useState<'view' | 'write'>('view')
  const [left, setLeft] = useState(viewSeconds)
  const answersRef = useRef(answers)
  useEffect(() => {
    answersRef.current = answers
  }, [answers])

  const item = attempt.items[idx]

  const finishItem = useCallback(() => {
    if (!item) return
    void save(attempt.id, item.ref, answersRef.current[item.ref] ?? '', {
      viewSeconds,
      writeSeconds: writeSeconds - left,
    })
    if (idx + 1 < attempt.items.length) {
      setIdx(idx + 1)
      setPhase('view')
      setLeft(viewSeconds)
    } else {
      void submit()
    }
  }, [attempt, item, idx, left, save, submit, viewSeconds, writeSeconds])

  useEffect(() => {
    if (left <= 0) {
      if (phase === 'view') {
        setPhase('write')
        setLeft(writeSeconds)
      } else {
        finishItem()
      }
      return
    }
    const t = setTimeout(() => setLeft((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [left, phase, finishItem, writeSeconds])

  if (!item) return <p>Done.</p>
  const clock = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}`

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between text-sm text-neutral-500">
        <span>
          Picture {idx + 1} / {attempt.items.length} ·{' '}
          {phase === 'view' ? 'Look carefully' : 'Write your story'}
        </span>
        <span className={`font-mono ${left <= 10 ? 'text-red-600' : ''}`}>{clock}</span>
      </div>
      {phase === 'view' ? (
        <div className="flex min-h-[320px] items-center justify-center rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800">
          {item.imageUrl ? (
            // Signed, short-lived link to our own storage; next/image adds nothing here.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.imageUrl}
              alt={item.prompt}
              className="max-h-[60vh] w-auto max-w-full object-contain"
            />
          ) : (
            <p className="text-lg">{ur && item.promptUr ? item.promptUr : item.prompt}</p>
          )}
        </div>
      ) : (
        <>
          <p className="text-xs text-neutral-500">
            What led up to the scene, what is happening now, and how does it end?
          </p>
          <textarea
            autoFocus
            key={item.ref}
            rows={12}
            value={answers[item.ref] ?? ''}
            onChange={(e) => setAnswers((a) => ({ ...a, [item.ref]: e.target.value }))}
            className={inputCls}
          />
          <button
            onClick={finishItem}
            className="w-fit rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white"
          >
            {idx + 1 < attempt.items.length ? 'Next picture' : 'Submit'}
          </button>
        </>
      )}
    </div>
  )
}

/**
 * Group Planning Exercise: one scenario at a time. The briefing and map stay
 * on screen — at the board the model and narrative are in front of the group
 * while they plan — and the candidate has `planSeconds` to write an individual
 * plan. Saved and advanced when the clock runs out; a reload resumes at the
 * first scenario with no saved plan.
 */
function PlanningTyped({
  attempt,
  answers,
  setAnswers,
  save,
  submit,
  ur,
}: {
  attempt: Attempt
  answers: Record<string, string>
  setAnswers: React.Dispatch<React.SetStateAction<Record<string, string>>>
  save: (
    id: string,
    ref: string,
    text: string,
    timingMeta?: Record<string, number>,
  ) => Promise<void>
  submit: () => Promise<void>
  ur: boolean
}) {
  const planSeconds = attempt.timing.planSeconds!
  const [idx, setIdx] = useState(() => {
    const first = attempt.items.findIndex((it) => !attempt.responses[it.ref]?.text)
    return first < 0 ? 0 : first
  })
  const [left, setLeft] = useState(planSeconds)
  const answersRef = useRef(answers)
  useEffect(() => {
    answersRef.current = answers
  }, [answers])

  const item = attempt.items[idx]

  const finishItem = useCallback(() => {
    if (!item) return
    void save(attempt.id, item.ref, answersRef.current[item.ref] ?? '', {
      planSeconds: planSeconds - left,
    })
    if (idx + 1 < attempt.items.length) {
      setIdx(idx + 1)
      setLeft(planSeconds)
      window.scrollTo({ top: 0 })
    } else {
      void submit()
    }
  }, [attempt, item, idx, left, save, submit, planSeconds])

  useEffect(() => {
    if (left <= 0) {
      finishItem()
      return
    }
    const t = setTimeout(() => setLeft((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [left, finishItem])

  if (!item) return <p>Done.</p>
  const clock = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}`
  const text = ur && item.promptUr ? item.promptUr : item.prompt
  const [title, ...body] = text.split('\n\n')
  const words = (answers[item.ref] ?? '').trim().split(/\s+/).filter(Boolean).length

  return (
    <div className="flex flex-col gap-4">
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-canvas/90 py-2 text-sm text-ink-muted backdrop-blur">
        <span>
          Scenario {idx + 1} / {attempt.items.length}
        </span>
        <span className={`font-mono text-base ${left <= 60 ? 'text-red-600' : 'text-ink'}`}>
          {clock}
        </span>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <article dir={ur && item.promptUr ? 'rtl' : 'ltr'} className="flex flex-col gap-3">
          <h2 className="font-display text-xl font-semibold text-ink">{title}</h2>
          {item.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              dir="ltr"
              src={item.imageUrl}
              alt="Scenario map"
              className="max-h-[50vh] w-auto max-w-full rounded border border-line bg-white object-contain"
            />
          )}
          {body.map((para, i) => (
            <p
              key={i}
              className={`whitespace-pre-line text-sm leading-relaxed ${
                i === body.length - 1 ? 'font-medium text-ink' : 'text-ink'
              }`}
            >
              {para}
            </p>
          ))}
        </article>
        <div className="flex flex-col gap-2">
          <label htmlFor={`plan-${item.ref}`} className="text-sm font-medium text-ink">
            Your plan
          </label>
          <textarea
            id={`plan-${item.ref}`}
            autoFocus
            key={item.ref}
            rows={18}
            value={answers[item.ref] ?? ''}
            onChange={(e) => setAnswers((a) => ({ ...a, [item.ref]: e.target.value }))}
            placeholder={'1. First problem — who goes, with what, and why it comes first\n2. …'}
            className={inputCls}
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-ink-muted tabular-nums">{words} words</span>
            <button
              onClick={finishItem}
              className="w-fit rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white"
            >
              {idx + 1 < attempt.items.length ? 'Next scenario' : 'Submit'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function PaperItem({
  attemptId,
  item,
  ur,
  withBriefing = false,
}: {
  attemptId: string
  item: Item
  ur: boolean
  /** Planning: the map illustrates the briefing rather than replacing it. */
  withBriefing?: boolean
}) {
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
    <div className="rounded-lg border border-line p-4">
      {withBriefing && (
        <div className="mb-3 text-sm leading-relaxed whitespace-pre-line">
          {ur && item.promptUr ? item.promptUr : item.prompt}
        </div>
      )}
      {item.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.imageUrl}
          alt={item.prompt}
          className="mb-3 max-h-80 w-auto max-w-full rounded border border-neutral-200 object-contain dark:border-neutral-800"
        />
      ) : (
        !withBriefing && (
          <div className="mb-2 font-medium">
            {ur && item.promptUr ? item.promptUr : item.prompt}
          </div>
        )
      )}
      {status === 'idle' && (
        <input type="file" accept="image/jpeg,image/png" onChange={upload} className="text-sm" />
      )}
      {status === 'uploading' && <p className="text-sm text-ink-muted">Uploading…</p>}
      {status === 'processing' && <p className="text-sm text-ink-muted">Extracting text…</p>}
      {(status === 'ready' || status === 'confirmed') && (
        <div className="flex flex-col gap-2">
          <p className="text-xs text-ink-muted">
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
              className="w-fit rounded-md bg-brand-600 px-3 py-1.5 text-sm text-white hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-400"
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
