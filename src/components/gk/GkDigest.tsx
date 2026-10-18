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
          className="rounded-pill border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-brand-500"
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
          placeholder="Search headlines"
          className="rounded-pill border border-line bg-surface px-4 py-2 text-sm text-ink outline-none placeholder:text-ink-muted focus:border-brand-500"
        />
        <a
          href="/gk/flashcards"
          className="ms-auto rounded-pill bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-400"
        >
          Flashcards
        </a>
      </div>

      {items.length === 0 && (
        <p className="text-sm text-ink-muted">
          No headlines yet. Run the ingestion job to pull them from the feeds.
        </p>
      )}
      {items.map((a, n) => (
        <article
          key={a.id}
          style={{ '--i': Math.min(n, 10) } as React.CSSProperties}
          className="rise lift rounded-card border border-line bg-surface p-4 shadow-card"
        >
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-display leading-snug font-semibold text-ink">
              {a.sourceUrl ? (
                <a
                  href={a.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="underline-grow decoration-transparent"
                >
                  {a.headline}
                </a>
              ) : (
                a.headline
              )}
            </h3>
            <button
              onClick={() => bookmark(a.id)}
              className="shrink-0 text-lg text-brass-500"
              title="Bookmark"
            >
              {bookmarks[a.id] ? '★' : '☆'}
            </button>
          </div>
          {/* Only a summary an editor actually wrote is shown. Feed items carry
              the headline and the link, which is all we store of them. */}
          {a.summaryEn.trim() && <p className="mt-1.5 text-sm text-ink-muted">{a.summaryEn}</p>}
          {a.summaryUr && (
            <p dir="rtl" className="mt-1 text-sm text-ink-muted">
              {a.summaryUr}
            </p>
          )}
          {a.issbAngle && (
            <p className="mt-2.5 text-sm text-brand-700 dark:text-brand-300">
              <span className="font-semibold">ISSB angle:</span> {a.issbAngle}
            </p>
          )}
          {a.oneLiner && (
            <p className="mt-1 text-xs italic text-ink-muted">One-liner: {a.oneLiner}</p>
          )}
          <div className="mt-3 flex flex-wrap items-center gap-x-1.5 text-xs text-ink-muted">
            <span className="rounded-pill bg-sunk px-2 py-0.5">{a.category}</span>
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
