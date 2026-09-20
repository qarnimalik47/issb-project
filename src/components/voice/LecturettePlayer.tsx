'use client'

import { useEffect, useState } from 'react'
import { VoiceRecorder } from './VoiceRecorder'
import { EvaluationPanel } from '../tests/EvaluationPanel'

type Item = { ref: string; prompt: string; promptUr: string | null }

export function LecturettePlayer({ testTypeId }: { testTypeId: string }) {
  const [attemptId, setAttemptId] = useState<string | null>(null)
  const [item, setItem] = useState<Item | null>(null)
  const [phase, setPhase] = useState<'prep' | 'deliver' | 'done'>('prep')
  const [prepLeft, setPrepLeft] = useState(120)
  const [typed, setTyped] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/written', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ testTypeId, mode: 'typed' }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (!d.attempt) return setError(d?.error?.message ?? 'Could not start')
        setAttemptId(d.attempt.id)
        setItem(d.attempt.items[0] ?? null)
      })
      .catch(() => setError('Network error'))
  }, [testTypeId])

  useEffect(() => {
    if (phase !== 'prep' || prepLeft <= 0) return
    const t = setTimeout(() => setPrepLeft((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [phase, prepLeft])

  async function submit() {
    if (!attemptId || !item) return
    if (typed.trim()) {
      await fetch(`/api/written/${attemptId}/save`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ref: item.ref, text: typed }),
      })
    }
    await fetch(`/api/written/${attemptId}/submit`, { method: 'POST' })
    setPhase('done')
  }

  if (error) return <p className="text-red-600">{error}</p>
  if (!attemptId || !item) return <p className="text-ink-muted">Loading…</p>

  if (phase === 'done') {
    return (
      <div className="flex flex-col gap-4">
        <p className="font-medium">Lecturette delivered. Get structured feedback:</p>
        <EvaluationPanel attemptId={attemptId} />
        <a href="/voice" className="text-sm underline">
          Back to voice practice
        </a>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-lg border border-line p-6">
        <div className="text-xs uppercase text-ink-muted">Your topic</div>
        <div className="mt-1 text-2xl font-semibold">{item.prompt}</div>
      </div>

      {phase === 'prep' ? (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-ink-muted">
            Preparation time: {prepLeft}s. Plan intro → analysis → conclusion.
          </p>
          <button
            onClick={() => setPhase('deliver')}
            className="w-fit rounded-md bg-brand-600 px-4 py-2 text-sm text-white hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-400"
          >
            I&apos;m ready — start speaking
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-ink-muted">
            Speak for up to 2 minutes. Record, or type your response.
          </p>
          <VoiceRecorder attemptId={attemptId} itemRef={item.ref} maxSeconds={120} />
          <div className="text-xs text-ink-muted">— or type —</div>
          <textarea
            rows={5}
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            placeholder="Type your lecturette here…"
            className="w-full rounded-md border border-line-strong px-3 py-2 text-sm dark:bg-neutral-900"
          />
          <button
            onClick={submit}
            className="w-fit rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white"
          >
            Finish &amp; get feedback
          </button>
        </div>
      )}
    </div>
  )
}
