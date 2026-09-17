'use client'

import { useCallback, useEffect, useState } from 'react'

type Review = {
  id: string
  subjectType: string
  subjectId: string
  status: string
  requestedAt: string
}

export function ReviewerClient() {
  const [queue, setQueue] = useState<Review[]>([])
  const [draft, setDraft] = useState<Record<string, { feedback: string; rating: string }>>({})

  const load = useCallback(async () => {
    const res = await fetch('/api/reviewer')
    if (res.ok) setQueue((await res.json()).queue)
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load()
  }, [load])

  async function act(id: string, action: 'claim' | 'submit') {
    const d = draft[id]
    const body =
      action === 'claim'
        ? { action }
        : { action, feedback: d?.feedback ?? '', rating: Number(d?.rating ?? 3) }
    await fetch(`/api/reviewer/${id}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    })
    load()
  }

  if (queue.length === 0)
    return <p className="text-sm text-neutral-500">No reviews in the queue.</p>

  return (
    <div className="flex flex-col gap-4">
      {queue.map((r) => (
        <div
          key={r.id}
          className="rounded-lg border border-neutral-200 p-4 text-sm dark:border-neutral-800"
        >
          <div className="text-xs text-neutral-400">
            {r.subjectType} · {r.subjectId.slice(0, 8)} · {r.status} · {r.requestedAt.slice(0, 10)}
          </div>
          {r.status === 'queued' ? (
            <button
              onClick={() => act(r.id, 'claim')}
              className="mt-2 rounded bg-neutral-900 px-3 py-1 text-white dark:bg-white dark:text-neutral-900"
            >
              Claim
            </button>
          ) : (
            <div className="mt-2 flex flex-col gap-2">
              <textarea
                rows={3}
                placeholder="Your expert feedback…"
                onChange={(e) =>
                  setDraft((s) => ({
                    ...s,
                    [r.id]: { ...(s[r.id] ?? { rating: '3' }), feedback: e.target.value },
                  }))
                }
                className="w-full rounded border border-neutral-300 px-2 py-1 dark:border-neutral-700 dark:bg-neutral-900"
              />
              <select
                onChange={(e) =>
                  setDraft((s) => ({
                    ...s,
                    [r.id]: { ...(s[r.id] ?? { feedback: '' }), rating: e.target.value },
                  }))
                }
                defaultValue="3"
                className="w-fit rounded border border-neutral-300 px-2 py-1 dark:border-neutral-700 dark:bg-neutral-900"
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    Rating {n}
                  </option>
                ))}
              </select>
              <button
                onClick={() => act(r.id, 'submit')}
                className="w-fit rounded bg-green-600 px-3 py-1 text-white"
              >
                Submit review
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
