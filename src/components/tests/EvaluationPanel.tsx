'use client'

import { useState } from 'react'

type EvalItem = {
  ref: string
  prompt: string
  status: string
  distress: boolean
  output: {
    criteria: Record<string, { score: number; evidence: string }>
    strengths: string[]
    weaknesses: string[]
    improvement: string[]
  } | null
}

export function EvaluationPanel({ attemptId }: { attemptId: string }) {
  const [state, setState] = useState<'idle' | 'requesting' | 'polling' | 'done' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [items, setItems] = useState<EvalItem[]>([])
  const [support, setSupport] = useState<string | null>(null)

  async function evaluate() {
    setState('requesting')
    setMessage('')
    const res = await fetch(`/api/written/${attemptId}/evaluate`, { method: 'POST' })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      setState('error')
      setMessage(data?.error?.message ?? 'Could not start evaluation')
      return
    }
    setState('polling')
    // Poll for results (the worker processes the queue).
    for (let i = 0; i < 20; i++) {
      await new Promise((r) => setTimeout(r, 1500))
      const r = await fetch(`/api/written/${attemptId}/evaluations`)
      const d = await r.json()
      const evald = (d.items as EvalItem[]).filter((it) => it.status !== 'not_evaluated')
      if (evald.length > 0) {
        setItems(d.items)
        setSupport(d.support?.en ?? null)
        setState('done')
        return
      }
    }
    setState('error')
    setMessage(
      'Evaluation is taking longer than expected. Is the worker running? Check back shortly.',
    )
  }

  if (state === 'idle' || state === 'error') {
    return (
      <div className="flex flex-col gap-2">
        <button
          onClick={evaluate}
          className="w-fit rounded-md bg-neutral-900 px-4 py-2 text-sm text-white dark:bg-white dark:text-neutral-900"
        >
          Get AI evaluation
        </button>
        {message && <p className="text-sm text-amber-600">{message}</p>}
      </div>
    )
  }

  if (state === 'requesting' || state === 'polling') {
    return <p className="text-sm text-neutral-500">Evaluating your responses…</p>
  }

  return (
    <div className="flex flex-col gap-4">
      {support && (
        <div className="rounded-md border border-amber-300 bg-amber-50 p-4 text-sm dark:border-amber-700 dark:bg-amber-950">
          {support}
        </div>
      )}
      {items.map((it) => (
        <div
          key={it.ref}
          className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-800"
        >
          <div className="mb-2 font-medium">{it.prompt}</div>
          {it.distress ? (
            <p className="text-sm text-amber-600">
              This response was flagged for supportive human review and was not scored.
            </p>
          ) : it.status === 'needs_review' ? (
            <p className="text-sm text-amber-600">Flagged for human review (models disagreed).</p>
          ) : it.output ? (
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex flex-wrap gap-2">
                {Object.entries(it.output.criteria).map(([k, v]) => (
                  <span key={k} className="rounded bg-neutral-100 px-2 py-0.5 dark:bg-neutral-800">
                    {k}: {v.score}/5
                  </span>
                ))}
              </div>
              {it.output.strengths.length > 0 && (
                <p>
                  <strong>Strengths:</strong> {it.output.strengths.join(' ')}
                </p>
              )}
              {it.output.weaknesses.length > 0 && (
                <p>
                  <strong>Weaknesses:</strong> {it.output.weaknesses.join(' ')}
                </p>
              )}
              {it.output.improvement.length > 0 && (
                <p>
                  <strong>Improve:</strong> {it.output.improvement.join(' ')}
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-neutral-500">Not yet evaluated.</p>
          )}
        </div>
      ))}
    </div>
  )
}
