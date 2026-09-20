'use client'

import { useEffect, useMemo, useState } from 'react'

type TestTypeOption = { id: string; code: string; nameEn: string }
type Row = {
  id: string
  stemEn: string
  stemUr: string | null
  status: 'draft' | 'published' | 'archived'
  difficulty: string
  topic: string | null
  testTypeName: string
  mediaId: string | null
  readiness: string[]
  updatedAt: string
}
type ListResponse = { questions: Row[]; page: number; pageSize: number; total: number }
type BulkResult = { updated: number; skipped: { id: string; reasons: string[] }[] }

const PAGE_SIZE = 25

const inputCls =
  'rounded-lg border border-line-strong bg-white px-3 py-2 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-500/30 dark:border-neutral-700 dark:bg-neutral-900'
const btnCls =
  'rounded-lg border border-line-strong px-3 py-1.5 text-sm font-medium hover:bg-sunk disabled:opacity-40 dark:border-neutral-700 dark:hover:bg-neutral-800'
const primaryCls =
  'rounded-lg bg-brand-700 px-4 py-2 text-sm font-medium text-white hover:bg-brand-800 disabled:opacity-40 dark:bg-brand-500 dark:text-brand-950'

const STATUS_BADGE: Record<Row['status'], string> = {
  published: 'bg-brand-100 text-brand-900 dark:bg-brand-950 dark:text-brand-200',
  draft: 'bg-sunk text-ink-muted dark:bg-neutral-800 dark:text-neutral-300',
  archived: 'bg-sunk text-ink-muted line-through dark:bg-neutral-900',
}

/**
 * The question bank: filter, search, page, select and bulk-publish. Filters are
 * local state rather than URL state, like the rest of the admin area — so they
 * are not shareable by link, but no Suspense boundary is needed.
 */
export function QuestionsManager({
  testTypes,
  topics,
}: {
  testTypes: TestTypeOption[]
  topics: string[]
}) {
  const [testTypeId, setTestTypeId] = useState('')
  const [status, setStatus] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [topic, setTopic] = useState('')
  const [missingUrdu, setMissingUrdu] = useState(false)
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [data, setData] = useState<{ key: string; body: ListResponse } | null>(null)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [busy, setBusy] = useState(false)
  const [report, setReport] = useState<string[] | null>(null)
  const [reloadTick, setReloadTick] = useState(0)

  // Debounce typing so every keystroke doesn't hit the server.
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput.trim())
      setPage(1)
    }, 300)
    return () => clearTimeout(t)
  }, [searchInput])

  const query = useMemo(() => {
    const p = new URLSearchParams({ page: String(page), pageSize: String(PAGE_SIZE) })
    if (testTypeId) p.set('testTypeId', testTypeId)
    if (status) p.set('status', status)
    if (difficulty) p.set('difficulty', difficulty)
    if (topic) p.set('topic', topic)
    if (search) p.set('q', search)
    if (missingUrdu) p.set('missingUrdu', 'true')
    return p.toString()
  }, [page, testTypeId, status, difficulty, topic, search, missingUrdu])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const res = await fetch(`/api/admin/questions?${query}`)
      const body = await res.json().catch(() => null)
      if (cancelled) return
      if (!res.ok) {
        setError(body?.error?.message ?? 'Could not load questions')
        return
      }
      setError('')
      setData({ key: `${query}#${reloadTick}`, body })
    })()
    return () => {
      cancelled = true
    }
  }, [query, reloadTick])

  const loading = data?.key !== `${query}#${reloadTick}`
  const rows = data?.body.questions ?? []
  const total = data?.body.total ?? 0
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const allOnPageSelected = rows.length > 0 && rows.every((r) => selected.has(r.id))

  function resetPage<T>(set: (v: T) => void) {
    return (v: T) => {
      set(v)
      setPage(1)
    }
  }

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function togglePage() {
    setSelected((prev) => {
      const next = new Set(prev)
      for (const r of rows) {
        if (allOnPageSelected) next.delete(r.id)
        else next.add(r.id)
      }
      return next
    })
  }

  async function bulk(action: 'publish' | 'unpublish' | 'archive') {
    setBusy(true)
    setReport(null)
    const res = await fetch('/api/admin/questions/bulk', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ action, ids: [...selected] }),
    })
    const body = (await res.json().catch(() => null)) as BulkResult | null
    setBusy(false)
    if (!res.ok || !body) {
      setReport(['The bulk action failed. Nothing was changed.'])
      return
    }
    const stemOf = new Map(rows.map((r) => [r.id, r.stemEn]))
    setReport([
      `${action === 'publish' ? 'Published' : action === 'archive' ? 'Archived' : 'Moved to draft'}: ${body.updated}.`,
      ...body.skipped.map(
        (s) => `Skipped “${(stemOf.get(s.id) ?? s.id).slice(0, 60)}” — ${s.reasons.join('; ')}`,
      ),
    ])
    setSelected(new Set())
    setReloadTick((n) => n + 1)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-3 rounded-xl border border-line p-4 sm:grid-cols-2 lg:grid-cols-6">
        <input
          type="search"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search question text…"
          aria-label="Search question text"
          className={`${inputCls} lg:col-span-2`}
        />
        <select
          aria-label="Test type"
          value={testTypeId}
          onChange={(e) => resetPage(setTestTypeId)(e.target.value)}
          className={inputCls}
        >
          <option value="">All test types</option>
          {testTypes.map((t) => (
            <option key={t.id} value={t.id}>
              {t.nameEn}
            </option>
          ))}
        </select>
        <select
          aria-label="Status"
          value={status}
          onChange={(e) => resetPage(setStatus)(e.target.value)}
          className={inputCls}
        >
          <option value="">Any status</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
        <select
          aria-label="Difficulty"
          value={difficulty}
          onChange={(e) => resetPage(setDifficulty)(e.target.value)}
          className={inputCls}
        >
          <option value="">Any difficulty</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <select
          aria-label="Topic"
          value={topic}
          onChange={(e) => resetPage(setTopic)(e.target.value)}
          className={inputCls}
        >
          <option value="">Any topic</option>
          {topics.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-2 text-sm text-ink-muted lg:col-span-6">
          <input
            type="checkbox"
            checked={missingUrdu}
            onChange={(e) => resetPage(setMissingUrdu)(e.target.checked)}
          />
          Only questions missing an Urdu translation
        </label>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-muted" aria-live="polite">
          {loading ? 'Loading…' : `${total} question${total === 1 ? '' : 's'}`}
          {selected.size > 0 && ` · ${selected.size} selected`}
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className={btnCls}
            disabled={!selected.size || busy}
            onClick={() => bulk('publish')}
          >
            Publish selected
          </button>
          <button
            type="button"
            className={btnCls}
            disabled={!selected.size || busy}
            onClick={() => bulk('unpublish')}
          >
            Move to draft
          </button>
          <button
            type="button"
            className={btnCls}
            disabled={!selected.size || busy}
            onClick={() => bulk('archive')}
          >
            Archive
          </button>
          <a href="/admin/questions/new" className={primaryCls}>
            New question
          </a>
        </div>
      </div>

      {report && (
        <div role="status" className="rounded-lg border border-line bg-sunk p-3 text-sm">
          {report.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      )}
      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="overflow-hidden rounded-xl border border-line">
        <div className="flex items-center gap-3 border-b border-line bg-sunk px-4 py-2 text-xs font-medium tracking-wide text-ink-muted uppercase">
          <input
            type="checkbox"
            aria-label="Select all on this page"
            checked={allOnPageSelected}
            onChange={togglePage}
          />
          <span>Question</span>
        </div>
        {rows.length === 0 && !loading ? (
          <p className="p-8 text-center text-sm text-ink-muted">No questions match.</p>
        ) : (
          <ul
            className={`divide-y divide-neutral-200 dark:divide-neutral-800 ${loading ? 'opacity-60' : ''}`}
          >
            {rows.map((r) => (
              <li
                key={r.id}
                className="flex items-start gap-3 px-4 py-3 hover:bg-sunk dark:hover:bg-neutral-900/60"
              >
                <input
                  type="checkbox"
                  className="mt-1"
                  aria-label={`Select: ${r.stemEn.slice(0, 80)}`}
                  checked={selected.has(r.id)}
                  onChange={() => toggle(r.id)}
                />
                <div className="min-w-0 flex-1">
                  <a
                    href={`/admin/questions/${r.id}`}
                    className="line-clamp-2 font-medium hover:underline"
                  >
                    {r.stemEn}
                  </a>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-ink-muted">
                    <span
                      className={`rounded-full px-2 py-0.5 font-medium ${STATUS_BADGE[r.status]}`}
                    >
                      {r.status}
                    </span>
                    <span>{r.testTypeName}</span>
                    <span>·</span>
                    <span>{r.difficulty}</span>
                    {r.topic && (
                      <>
                        <span>·</span>
                        <span>{r.topic}</span>
                      </>
                    )}
                    {r.mediaId && (
                      <span className="rounded-full bg-sky-100 px-2 py-0.5 text-sky-900 dark:bg-sky-950 dark:text-sky-200">
                        figure
                      </span>
                    )}
                    {!r.stemUr && (
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-amber-900 dark:bg-amber-950 dark:text-amber-200">
                        no Urdu
                      </span>
                    )}
                    {r.readiness.length > 0 && (
                      <span
                        className="rounded-full bg-red-100 px-2 py-0.5 text-red-800 dark:bg-red-950 dark:text-red-200"
                        title={r.readiness.join('\n')}
                      >
                        not publishable: {r.readiness[0]}
                        {r.readiness.length > 1 ? ` (+${r.readiness.length - 1})` : ''}
                      </span>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <nav aria-label="Pagination" className="flex items-center justify-end gap-2 text-sm">
        <button
          type="button"
          className={btnCls}
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>
        <span className="text-ink-muted tabular-nums">
          Page {page} of {pages}
        </span>
        <button
          type="button"
          className={btnCls}
          disabled={page >= pages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </nav>
    </div>
  )
}
