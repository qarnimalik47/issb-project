'use client'

import { useCallback, useEffect, useState } from 'react'

type Batch = {
  id: string
  filename: string
  status: string
  totalPages: number | null
  meta: Record<string, unknown> | null
  createdAt: string
}
type Staging = {
  id: string
  page: number | null
  extracted: {
    stemEn: string
    options: { key: string; textEn: string }[]
    correctOption: string | null
  }
  confidence: string | null
  status: string
}
type TestType = { id: string; code: string; nameEn: string }

export function ImportManager() {
  const [batches, setBatches] = useState<Batch[]>([])
  const [testTypes, setTestTypes] = useState<TestType[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [items, setItems] = useState<Staging[]>([])
  const [busy, setBusy] = useState(false)

  const loadBatches = useCallback(async () => {
    const res = await fetch('/api/admin/import')
    if (res.ok) setBatches((await res.json()).batches)
  }, [])

  useEffect(() => {
    // Data fetch on mount; state updates happen asynchronously after await.
    /* eslint-disable react-hooks/set-state-in-effect */
    void loadBatches()
    fetch('/api/catalog/test-types')
      .then((r) => r.json())
      .then((d) => setTestTypes(d.testTypes ?? []))
      .catch(() => {})
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [loadBatches])

  async function upload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setBusy(true)
    const form = new FormData(e.currentTarget)
    const res = await fetch('/api/admin/import', { method: 'POST', body: form })
    setBusy(false)
    if (res.ok) {
      ;(e.target as HTMLFormElement).reset()
      setTimeout(loadBatches, 1500)
    } else {
      const d = await res.json().catch(() => ({}))
      alert(d?.error?.message ?? 'Upload failed')
    }
  }

  async function openBatch(id: string) {
    setSelected(id)
    const res = await fetch(`/api/admin/import/${id}`)
    if (res.ok) setItems((await res.json()).items)
  }

  async function review(id: string, action: 'approve' | 'reject') {
    await fetch(`/api/admin/import/staging/${id}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ action }),
    })
    if (selected) openBatch(selected)
  }

  return (
    <div className="flex flex-col gap-6">
      <form
        onSubmit={upload}
        className="flex flex-wrap items-center gap-3 rounded-md border border-neutral-200 p-4 dark:border-neutral-800"
      >
        <input type="file" name="file" accept="application/pdf" required className="text-sm" />
        <select
          name="testTypeId"
          className="rounded border border-neutral-300 px-2 py-1 text-sm dark:border-neutral-700 dark:bg-neutral-900"
        >
          <option value="">Test type…</option>
          {testTypes.map((tt) => (
            <option key={tt.id} value={tt.id}>
              {tt.nameEn}
            </option>
          ))}
        </select>
        <button
          disabled={busy}
          className="rounded bg-neutral-900 px-3 py-1.5 text-sm text-white dark:bg-white dark:text-neutral-900"
        >
          {busy ? 'Uploading…' : 'Import PDF'}
        </button>
        <button type="button" onClick={loadBatches} className="text-sm underline">
          Refresh
        </button>
      </form>

      <div className="grid gap-4 md:grid-cols-[1fr_2fr]">
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold">Batches</h3>
          {batches.map((b) => (
            <button
              key={b.id}
              onClick={() => openBatch(b.id)}
              className={`rounded border p-2 text-left text-sm ${selected === b.id ? 'border-neutral-900 dark:border-white' : 'border-neutral-200 dark:border-neutral-800'}`}
            >
              <div className="font-medium">{b.filename}</div>
              <div className="text-xs text-neutral-500">
                {b.status}
                {b.meta && typeof b.meta === 'object' && 'inserted' in b.meta
                  ? ` · ${String((b.meta as Record<string, unknown>).inserted)} staged`
                  : ''}
              </div>
            </button>
          ))}
          {batches.length === 0 && <p className="text-sm text-neutral-500">No imports yet.</p>}
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold">Staged questions ({items.length})</h3>
          {items.map((it) => (
            <div
              key={it.id}
              className="rounded border border-neutral-200 p-3 text-sm dark:border-neutral-800"
            >
              <div className="mb-1 flex items-center justify-between">
                <span className="text-xs text-neutral-500">
                  p{it.page} · confidence {it.confidence ?? '—'} · {it.status}
                </span>
                {it.status === 'pending' && (
                  <span className="flex gap-2">
                    <button
                      onClick={() => review(it.id, 'approve')}
                      className="rounded bg-green-600 px-2 py-0.5 text-xs text-white"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => review(it.id, 'reject')}
                      className="rounded bg-red-600 px-2 py-0.5 text-xs text-white"
                    >
                      Reject
                    </button>
                  </span>
                )}
              </div>
              <div className="font-medium">{it.extracted.stemEn}</div>
              <ul className="mt-1 list-inside">
                {it.extracted.options.map((o) => (
                  <li
                    key={o.key}
                    className={
                      o.key === it.extracted.correctOption ? 'font-semibold text-green-700' : ''
                    }
                  >
                    {o.key}. {o.textEn}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
