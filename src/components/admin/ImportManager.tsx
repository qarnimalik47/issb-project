'use client'

import { useCallback, useEffect, useState } from 'react'
import { StagingRewriteEditor, type StagedContent } from './StagingRewriteEditor'

type Batch = {
  id: string
  filename: string
  status: string
  testTypeId: string | null
  totalPages: number | null
  meta: Record<string, unknown> | null
  createdAt: string
}
type Staging = {
  id: string
  page: number | null
  extracted: StagedContent
  editedExtracted: StagedContent | null
  reviewState: 'clear' | 'needs_rewrite' | 'rewritten'
  similarity: string | null
  sourceDocumentId: string | null
  confidence: string | null
  status: string
}
type SourceDoc = {
  id: string
  url: string | null
  status: string
  reason: string | null
  httpStatus: number | null
  robotsAllowed: boolean | null
  extractedCount: number | null
  storageKey: string | null
}

const REVIEW_BADGE: Record<Staging['reviewState'], [string, string] | null> = {
  clear: null,
  needs_rewrite: ['Rewrite required', 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200'],
  rewritten: ['Rewritten', 'bg-brand-100 text-brand-900 dark:bg-brand-950 dark:text-brand-200'],
}
type TestType = { id: string; code: string; nameEn: string; scoringType: string }
type Notice = { tone: 'ok' | 'error'; text: string; href?: string }

export function ImportManager() {
  const [batches, setBatches] = useState<Batch[]>([])
  const [testTypes, setTestTypes] = useState<TestType[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [items, setItems] = useState<Staging[]>([])
  const [documents, setDocuments] = useState<SourceDoc[]>([])
  const [editing, setEditing] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState<Notice | null>(null)

  // Imported PDFs carry MCQs, so only objective test types make sense here.
  const objectiveTypes = testTypes.filter((t) => t.scoringType === 'objective')
  const batch = batches.find((b) => b.id === selected) ?? null

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
    setNotice(null)
    const form = new FormData(e.currentTarget)
    const res = await fetch('/api/admin/import', { method: 'POST', body: form })
    setBusy(false)
    if (res.ok) {
      ;(e.target as HTMLFormElement).reset()
      setNotice({ tone: 'ok', text: 'Uploaded — extraction runs in the background.' })
      setTimeout(loadBatches, 1500)
    } else {
      const d = await res.json().catch(() => ({}))
      setNotice({ tone: 'error', text: d?.error?.message ?? 'Upload failed' })
    }
  }

  async function openBatch(id: string) {
    setSelected(id)
    const res = await fetch(`/api/admin/import/${id}`)
    if (res.ok) {
      const body = await res.json()
      setItems(body.items)
      setDocuments(body.documents ?? [])
    }
  }

  async function reextract(docId: string) {
    const res = await fetch(`/api/admin/import/documents/${docId}/reextract`, { method: 'POST' })
    const d = await res.json().catch(() => ({}))
    setNotice(
      res.ok
        ? { tone: 'ok', text: `Re-extracted: ${d.staged} new, ${d.duplicates} already known.` }
        : { tone: 'error', text: d?.error?.message ?? 'Re-extract failed' },
    )
    if (selected) void openBatch(selected)
  }

  async function setTestType(testTypeId: string) {
    if (!selected || !testTypeId) return
    const res = await fetch(`/api/admin/import/${selected}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ testTypeId }),
    })
    const d = await res.json().catch(() => ({}))
    if (!res.ok) {
      setNotice({ tone: 'error', text: d?.error?.message ?? 'Could not set the test type' })
      return
    }
    setNotice({ tone: 'ok', text: 'Test type set — items can now be approved.' })
    await loadBatches()
  }

  async function review(id: string, action: 'approve' | 'approve_publish' | 'reject') {
    setNotice(null)
    const res = await fetch(`/api/admin/import/staging/${id}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ action }),
    })
    const d = await res.json().catch(() => ({}))
    if (!res.ok) {
      setNotice({ tone: 'error', text: d?.error?.message ?? 'Review failed' })
    } else if (action !== 'reject') {
      setNotice(
        d.duplicate
          ? { tone: 'ok', text: 'Already in the question bank — nothing new was added.' }
          : {
              tone: 'ok',
              text: d.published ? 'Approved and published.' : 'Approved as a draft.',
              href: d.questionId ? `/admin/questions/${d.questionId}` : undefined,
            },
      )
    }
    if (selected) void openBatch(selected)
  }

  return (
    <div className="flex flex-col gap-6">
      <form
        onSubmit={upload}
        className="flex flex-wrap items-center gap-3 rounded-md border border-line p-4"
      >
        <input type="file" name="file" accept="application/pdf" required className="text-sm" />
        <select
          name="testTypeId"
          aria-label="Test type"
          className="rounded border border-line-strong px-2 py-1 text-sm dark:bg-neutral-900"
        >
          <option value="">Test type…</option>
          {objectiveTypes.map((tt) => (
            <option key={tt.id} value={tt.id}>
              {tt.nameEn}
            </option>
          ))}
        </select>
        <button
          disabled={busy}
          className="rounded bg-brand-600 px-3 py-1.5 text-sm text-white hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-400"
        >
          {busy ? 'Uploading…' : 'Import PDF'}
        </button>
        <button type="button" onClick={loadBatches} className="text-sm underline">
          Refresh
        </button>
        <a href="/admin/questions" className="ms-auto text-sm underline">
          Question bank →
        </a>
      </form>

      {notice && (
        <p
          role={notice.tone === 'error' ? 'alert' : 'status'}
          className={`rounded-md border px-3 py-2 text-sm ${
            notice.tone === 'error'
              ? 'border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200'
              : 'border-brand-200 bg-brand-50 text-brand-900 dark:border-brand-800 dark:bg-brand-950/40 dark:text-brand-100'
          }`}
        >
          {notice.text}{' '}
          {notice.href && (
            <a href={notice.href} className="font-medium underline">
              Open it in the editor
            </a>
          )}
        </p>
      )}

      <div className="grid gap-4 md:grid-cols-[1fr_2fr]">
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold">Batches</h3>
          {batches.map((b) => (
            <button
              key={b.id}
              onClick={() => openBatch(b.id)}
              className={`rounded border p-2 text-left text-sm ${selected === b.id ? 'border-neutral-900 dark:border-white' : 'border-line'}`}
            >
              <div className="font-medium">{b.filename}</div>
              <div className="text-xs text-ink-muted">
                {b.status}
                {b.meta && typeof b.meta === 'object' && 'inserted' in b.meta
                  ? ` · ${String((b.meta as Record<string, unknown>).inserted)} staged`
                  : ''}
                {!b.testTypeId && (
                  <span className="text-amber-700 dark:text-amber-300"> · no test type</span>
                )}
              </div>
            </button>
          ))}
          {batches.length === 0 && <p className="text-sm text-ink-muted">No imports yet.</p>}
        </div>

        <div className="flex flex-col gap-2">
          {batch && (
            <div
              className={`flex flex-wrap items-center gap-3 rounded border p-3 text-sm ${
                batch.testTypeId
                  ? 'border-line'
                  : 'border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/40'
              }`}
            >
              <label className="flex items-center gap-2 font-medium">
                Test type
                <select
                  value={batch.testTypeId ?? ''}
                  onChange={(e) => void setTestType(e.target.value)}
                  className="rounded border border-line-strong px-2 py-1 text-sm font-normal dark:bg-neutral-900"
                >
                  <option value="" disabled>
                    Choose…
                  </option>
                  {objectiveTypes.map((tt) => (
                    <option key={tt.id} value={tt.id}>
                      {tt.nameEn}
                    </option>
                  ))}
                </select>
              </label>
              {!batch.testTypeId && (
                <span className="text-amber-800 dark:text-amber-200">
                  Set a test type before approving — imported questions need to know which test they
                  belong to.
                </span>
              )}
            </div>
          )}
          {documents.length > 0 && (
            <details className="rounded border border-line p-3 text-sm">
              <summary className="cursor-pointer font-semibold">
                Source pages ({documents.length})
              </summary>
              <ul className="mt-2 flex flex-col gap-2">
                {documents.map((d) => (
                  <li
                    key={d.id}
                    className="flex flex-wrap items-center justify-between gap-2 text-xs"
                  >
                    <span className="min-w-0 flex-1 truncate">
                      <a href={d.url ?? '#'} target="_blank" rel="noreferrer" className="underline">
                        {d.url}
                      </a>
                    </span>
                    <span className="text-ink-muted">
                      {d.status}
                      {d.httpStatus ? ` · HTTP ${d.httpStatus}` : ''}
                      {d.extractedCount != null ? ` · ${d.extractedCount} staged` : ''}
                      {d.reason ? ` · ${d.reason}` : ''}
                    </span>
                    {d.storageKey && (
                      <button
                        type="button"
                        onClick={() => void reextract(d.id)}
                        className="rounded border border-line-strong px-2 py-0.5"
                      >
                        Re-extract
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </details>
          )}
          <h3 className="text-sm font-semibold">Staged questions ({items.length})</h3>
          {items.map((it) => (
            <div key={it.id} className="rounded border border-line p-3 text-sm">
              <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
                <span className="flex flex-wrap items-center gap-2 text-xs text-ink-muted">
                  {it.page != null && <span>p{it.page}</span>}
                  <span>confidence {it.confidence ?? '—'}</span>
                  <span>{it.status}</span>
                  {REVIEW_BADGE[it.reviewState] && (
                    <span
                      className={`rounded-full px-2 py-0.5 font-medium ${REVIEW_BADGE[it.reviewState]![1]}`}
                    >
                      {REVIEW_BADGE[it.reviewState]![0]}
                      {it.similarity != null &&
                        ` · ${Math.round(Number(it.similarity) * 100)}% shared`}
                    </span>
                  )}
                  {it.extracted.hasFigure && (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-amber-900 dark:bg-amber-950 dark:text-amber-200">
                      needs a figure (not copied)
                    </span>
                  )}
                </span>
                {it.status === 'pending' && (
                  <span className="flex gap-2">
                    <button
                      onClick={() => setEditing(editing === it.id ? null : it.id)}
                      className="rounded border border-line-strong px-2 py-0.5 text-xs"
                    >
                      {it.reviewState === 'needs_rewrite' ? 'Rewrite' : 'Edit'}
                    </button>
                    <button
                      onClick={() => review(it.id, 'approve')}
                      disabled={!batch?.testTypeId || it.reviewState === 'needs_rewrite'}
                      title={it.reviewState === 'needs_rewrite' ? 'Rewrite it first' : undefined}
                      className="rounded border border-line-strong px-2 py-0.5 text-xs disabled:opacity-40"
                    >
                      Approve → draft
                    </button>
                    <button
                      onClick={() => review(it.id, 'approve_publish')}
                      disabled={!batch?.testTypeId || it.reviewState === 'needs_rewrite'}
                      title={it.reviewState === 'needs_rewrite' ? 'Rewrite it first' : undefined}
                      className="rounded bg-brand-700 px-2 py-0.5 text-xs text-white disabled:opacity-40"
                    >
                      Approve &amp; publish
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
              {(() => {
                const shown = it.editedExtracted ?? it.extracted
                return (
                  <>
                    <div className="font-medium">
                      {shown.stemEn}
                      {it.editedExtracted && (
                        <span className="ms-2 text-xs font-normal text-ink-muted">(edited)</span>
                      )}
                    </div>
                    <ul className="mt-1 list-inside">
                      {shown.options.map((o) => (
                        <li
                          key={o.key}
                          className={
                            o.key === shown.correctOption ? 'font-semibold text-green-700' : ''
                          }
                        >
                          {o.key}. {o.textEn}
                          {o.key === shown.correctOption && ' ✓ (key)'}
                        </li>
                      ))}
                    </ul>
                  </>
                )
              })()}
              {editing === it.id && (
                <StagingRewriteEditor
                  itemId={it.id}
                  source={it.extracted}
                  initial={it.editedExtracted ?? it.extracted}
                  gated={it.reviewState !== 'clear'}
                  onCancel={() => setEditing(null)}
                  onSaved={(r) => {
                    setEditing(null)
                    setNotice({
                      tone: r.reviewState === 'needs_rewrite' ? 'error' : 'ok',
                      text:
                        r.reviewState === 'needs_rewrite'
                          ? `Saved, but still ${Math.round(r.similarity * 100)}% identical to the source — keep rewording.`
                          : 'Saved. It can now be approved.',
                    })
                    if (selected) void openBatch(selected)
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
