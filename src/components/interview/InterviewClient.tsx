'use client'

import { useState } from 'react'
import { VoiceRecorder } from '../voice/VoiceRecorder'
import { EvaluationPanel } from '../tests/EvaluationPanel'

type Item = { ref: string; prompt: string }

export function InterviewClient() {
  const [attemptId, setAttemptId] = useState<string | null>(null)
  const [items, setItems] = useState<Item[]>([])
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [phase, setPhase] = useState<'intro' | 'qa' | 'done'>('intro')
  const [error, setError] = useState('')

  async function start() {
    setError('')
    const res = await fetch('/api/interview', { method: 'POST' })
    const d = await res.json()
    if (!res.ok) return setError(d?.error?.message ?? 'Could not start interview')
    setAttemptId(d.attempt.id)
    setItems(d.attempt.items)
    setPhase('qa')
  }

  async function saveAnswer(ref: string, text: string) {
    if (!attemptId) return
    await fetch(`/api/written/${attemptId}/save`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ref, text }),
    })
  }

  async function finish() {
    if (!attemptId) return
    for (const it of items) if (answers[it.ref]) await saveAnswer(it.ref, answers[it.ref]!)
    await fetch(`/api/written/${attemptId}/submit`, { method: 'POST' })
    setPhase('done')
  }

  if (error)
    return (
      <div className="flex flex-col gap-2">
        <p className="text-amber-600">{error}</p>
        <a href="/piq" className="text-sm underline">
          Complete your PIQ first →
        </a>
      </div>
    )

  if (phase === 'intro') {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Your interview questions are generated from your own PIQ. Answer honestly and consistently
          with your written tests. You can type or record each answer.
        </p>
        <button
          onClick={start}
          className="w-fit rounded-md bg-neutral-900 px-4 py-2 text-sm text-white dark:bg-white dark:text-neutral-900"
        >
          Start mock interview
        </button>
      </div>
    )
  }

  if (phase === 'done' && attemptId) {
    return (
      <div className="flex flex-col gap-4">
        <p className="font-medium">Interview complete. Get structured feedback:</p>
        <EvaluationPanel attemptId={attemptId} />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {items.map((it, i) => (
        <div
          key={it.ref}
          className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-800"
        >
          <div className="font-medium">
            Q{i + 1}. {it.prompt}
          </div>
          <textarea
            rows={3}
            value={answers[it.ref] ?? ''}
            onChange={(e) => setAnswers((a) => ({ ...a, [it.ref]: e.target.value }))}
            placeholder="Type your answer…"
            className="mt-2 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
          />
          {attemptId && (
            <details className="mt-2">
              <summary className="cursor-pointer text-xs text-neutral-500">
                Answer by voice instead
              </summary>
              <div className="mt-2">
                <VoiceRecorder
                  attemptId={attemptId}
                  itemRef={it.ref}
                  maxSeconds={120}
                  onConfirmed={(text) => setAnswers((a) => ({ ...a, [it.ref]: text }))}
                />
              </div>
            </details>
          )}
        </div>
      ))}
      <button
        onClick={finish}
        className="w-fit rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white"
      >
        Finish interview
      </button>
    </div>
  )
}
