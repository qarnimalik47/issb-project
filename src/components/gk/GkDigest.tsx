'use client'

import { useCallback, useEffect, useState } from 'react'

type Article = {
  id: string
  headline: string
  summaryEn: string
  summaryUr: string | null
  category: string
  issbAngle: string | null
  oneLiner: string | null
  sourceName: string | null
  sourceUrl: string | null
  publishedDate: string | null
}

const CATEGORIES = ['', 'pakistan', 'defence', 'international', 'economy', 'scitech', 'sports']

export function GkDigest() {
  const [items, setItems] = useState<Article[]>([])
  const [category, setCategory] = useState('')
  const [q, setQ] = useState('')
  const [bookmarks, setBookmarks] = useState<Record<string, boolean>>({})

  const load = useCallback(async () => {
    const params = new URLSearchParams()
    if (category) params.set('category', category)
    if (q) params.set('q', q)
    const res = await fetch(`/api/gk/digest?${params}`)
    if (res.ok) setItems((await res.json()).items)
  }, [category, q])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load()
  }, [load])

  async function bookmark(id: string) {
    const res = await fetch('/api/gk/bookmark', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ articleId: id }),
    })
    if (res.ok) {
      const { bookmarked } = await res.json()
      setBookmarks((b) => ({ ...b, [id]: bookmarked }))
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded border border-line-strong px-2 py-1 text-sm dark:bg-neutral-900"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c || 'All categories'}
            </option>
          ))}
        </select>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && load()}
          placeholder="Search…"
          className="rounded border border-line-strong px-2 py-1 text-sm dark:bg-neutral-900"
        />
        <a
          href="/gk/flashcards"
          className="ml-auto rounded bg-brand-600 px-3 py-1.5 text-sm text-white hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-400"
        >
          Flashcards
        </a>
      </div>

      {items.length === 0 && <p className="text-sm text-ink-muted">No items yet.</p>}
      {items.map((a) => (
        <article key={a.id} className="rounded-lg border border-line p-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-medium">{a.headline}</h3>
            <button onClick={() => bookmark(a.id)} className="text-sm" title="Bookmark">
              {bookmarks[a.id] ? '★' : '☆'}
            </button>
          </div>
          <p className="mt-1 text-sm text-ink-muted">{a.summaryEn}</p>
          {a.summaryUr && (
            <p dir="rtl" className="mt-1 text-sm text-ink-muted">
              {a.summaryUr}
            </p>
          )}
          {a.issbAngle && (
            <p className="mt-2 text-sm text-blue-700 dark:text-blue-400">
              <strong>ISSB angle:</strong> {a.issbAngle}
            </p>
          )}
          {a.oneLiner && (
            <p className="mt-1 text-xs italic text-ink-muted">One-liner: {a.oneLiner}</p>
          )}
          <div className="mt-2 text-xs text-ink-muted">
            <span className="rounded bg-sunk px-1.5 py-0.5">{a.category}</span>
            {a.sourceName && a.sourceUrl && (
              <>
                {' · '}
                <a href={a.sourceUrl} target="_blank" rel="noreferrer" className="underline">
                  {a.sourceName}
                </a>
              </>
            )}
            {a.publishedDate && ` · ${a.publishedDate}`}
          </div>
        </article>
      ))}
    </div>
  )
}
