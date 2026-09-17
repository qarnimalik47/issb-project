'use client'

import { useCallback, useEffect, useState } from 'react'

type Draft = {
  id: string
  headline: string
  summaryEn: string
  issbAngle: string | null
  category: string
  sourceName: string | null
  sourceUrl: string | null
}

export function GkDrafts() {
  const [drafts, setDrafts] = useState<Draft[]>([])
  const [edits, setEdits] = useState<Record<string, { summaryEn: string; issbAngle: string }>>({})

  const load = useCallback(async () => {
    const res = await fetch('/api/admin/gk')
    if (res.ok) setDrafts((await res.json()).drafts)
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load()
  }, [load])

  async function act(id: string, action: 'approve' | 'reject') {
    const e = edits[id]
    await fetch(`/api/admin/gk/${id}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ action, edits: action === 'approve' && e ? e : undefined }),
    })
    load()
  }

  if (drafts.length === 0)
    return <p className="text-sm text-neutral-500">No drafts pending review.</p>

  return (
    <div className="flex flex-col gap-4">
      {drafts.map((d) => (
        <div
          key={d.id}
          className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-800"
        >
          <div className="font-medium">{d.headline}</div>
          <div className="mt-1 text-xs text-neutral-400">
            {d.category} · {d.sourceName}
          </div>
          <textarea
            defaultValue={d.summaryEn}
            onChange={(e) =>
              setEdits((s) => ({
                ...s,
                [d.id]: {
                  ...(s[d.id] ?? { issbAngle: d.issbAngle ?? '' }),
                  summaryEn: e.target.value,
                },
              }))
            }
            rows={2}
            className="mt-2 w-full rounded border border-neutral-300 px-2 py-1 text-sm dark:border-neutral-700 dark:bg-neutral-900"
          />
          <input
            defaultValue={d.issbAngle ?? ''}
            placeholder="ISSB angle"
            onChange={(e) =>
              setEdits((s) => ({
                ...s,
                [d.id]: { ...(s[d.id] ?? { summaryEn: d.summaryEn }), issbAngle: e.target.value },
              }))
            }
            className="mt-2 w-full rounded border border-neutral-300 px-2 py-1 text-sm dark:border-neutral-700 dark:bg-neutral-900"
          />
          <div className="mt-2 flex gap-2">
            <button
              onClick={() => act(d.id, 'approve')}
              className="rounded bg-green-600 px-3 py-1 text-sm text-white"
            >
              Approve & publish
            </button>
            <button
              onClick={() => act(d.id, 'reject')}
              className="rounded bg-red-600 px-3 py-1 text-sm text-white"
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
