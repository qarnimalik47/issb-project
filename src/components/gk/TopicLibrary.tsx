'use client'

import { useMemo, useState } from 'react'
import { cn } from '@/components/ui/cn'
import { sectionLabel } from './sectionLabel'

export type LibraryTopic = {
  id: string
  slug: string
  title: string
  summary: string
  section: string
  facts: number
  sections: number
  dated: number
}

/**
 * A browsable library rather than a wall of cards.
 *
 * Sixty topics is past the point where scrolling is a reasonable way to find
 * one, so the section rail and the search box are the primary navigation and
 * the grid follows them. Filtering happens in the browser because the whole
 * library is a few kilobytes of text — a round trip per keystroke would be
 * slower and worse.
 */
export function TopicLibrary({
  topics,
  basePath,
  accent = 'green',
}: {
  topics: LibraryTopic[]
  basePath: string
  accent?: 'green' | 'brass'
}) {
  const [query, setQuery] = useState('')
  const [section, setSection] = useState<string>('')

  const sections = useMemo(() => {
    const counts = new Map<string, number>()
    for (const t of topics) counts.set(t.section, (counts.get(t.section) ?? 0) + 1)
    return [...counts.entries()].sort((a, b) =>
      sectionLabel(a[0]).localeCompare(sectionLabel(b[0])),
    )
  }, [topics])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return topics.filter((t) => {
      if (section && t.section !== section) return false
      if (!q) return true
      return t.title.toLowerCase().includes(q) || t.summary.toLowerCase().includes(q)
    })
  }, [topics, query, section])

  /* Grouped only when the whole library is in view; a filtered result is a
     single list, because one heading above one card is noise. */
  const grouped = useMemo(() => {
    if (section || query.trim()) return null
    const map = new Map<string, LibraryTopic[]>()
    for (const t of filtered) {
      const list = map.get(t.section) ?? []
      list.push(t)
      map.set(t.section, list)
    }
    return [...map.entries()].sort((a, b) => sectionLabel(a[0]).localeCompare(sectionLabel(b[0])))
  }, [filtered, section, query])

  const chipOn = accent === 'brass' ? 'bg-brass-500 text-brand-950' : 'bg-brand-600 text-white'

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <div className="relative">
          <svg
            viewBox="0 0 20 20"
            className="pointer-events-none absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted"
            fill="none"
            stroke="currentColor"
            aria-hidden="true"
          >
            <circle cx="9" cy="9" r="6" strokeWidth="1.8" />
            <path d="m13.5 13.5 3.5 3.5" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search this library"
            aria-label="Search topics"
            className="w-full rounded-pill border border-line bg-surface py-3 pe-4 ps-11 text-sm text-ink outline-none transition-colors placeholder:text-ink-muted focus:border-brand-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSection('')}
            aria-pressed={section === ''}
            className={cn(
              'rounded-pill border px-3.5 py-1.5 text-sm font-medium transition-colors',
              section === ''
                ? cn(chipOn, 'border-transparent')
                : 'border-line text-ink-muted hover:border-line-strong hover:text-ink',
            )}
          >
            All
            <span className="ms-1.5 opacity-60">{topics.length}</span>
          </button>
          {sections.map(([value, count]) => (
            <button
              key={value}
              type="button"
              onClick={() => setSection(value === section ? '' : value)}
              aria-pressed={section === value}
              className={cn(
                'rounded-pill border px-3.5 py-1.5 text-sm font-medium transition-colors',
                section === value
                  ? cn(chipOn, 'border-transparent')
                  : 'border-line text-ink-muted hover:border-line-strong hover:text-ink',
              )}
            >
              {sectionLabel(value)}
              <span className="ms-1.5 opacity-60">{count}</span>
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-card border border-dashed border-line-strong px-6 py-14 text-center">
          <p className="font-display font-semibold text-ink">Nothing matches that</p>
          <p className="mx-auto mt-2 max-w-sm text-sm text-ink-muted">
            Try a shorter word, or clear the section filter to search the whole library.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery('')
              setSection('')
            }}
            className="mt-5 rounded-pill border border-line px-4 py-2 text-sm font-medium text-ink hover:bg-sunk"
          >
            Clear filters
          </button>
        </div>
      ) : grouped ? (
        <div className="flex flex-col gap-10">
          {grouped.map(([value, list]) => (
            <section key={value} className="flex flex-col gap-4">
              <div className="flex items-baseline gap-3">
                <h2 className="font-display text-lg font-semibold text-ink">
                  {sectionLabel(value)}
                </h2>
                <span className="h-px flex-1 bg-line" aria-hidden="true" />
                <span className="text-xs text-ink-muted">{list.length}</span>
              </div>
              <Grid topics={list} basePath={basePath} />
            </section>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-ink-muted">
            {filtered.length} {filtered.length === 1 ? 'topic' : 'topics'}
          </p>
          <Grid topics={filtered} basePath={basePath} />
        </div>
      )}
    </div>
  )
}

function Grid({ topics, basePath }: { topics: LibraryTopic[]; basePath: string }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {topics.map((topic, i) => (
        <a
          key={topic.id}
          href={`${basePath}/${topic.slug}`}
          style={{ '--i': Math.min(i, 12) } as React.CSSProperties}
          className="rise lift group flex h-full flex-col gap-2.5 rounded-card border border-line bg-surface p-5 shadow-card hover:border-brand-300"
        >
          <h3 className="font-display leading-snug font-semibold text-ink">{topic.title}</h3>
          <p className="line-clamp-3 text-sm leading-relaxed text-ink-muted">{topic.summary}</p>
          <div className="mt-auto flex flex-wrap items-center gap-x-2 gap-y-1 pt-2 text-xs text-ink-muted">
            {topic.facts > 0 && <span>{topic.facts} facts</span>}
            {topic.facts > 0 && topic.sections > 0 && <Dot />}
            {topic.sections > 0 && <span>{topic.sections} sections</span>}
            {topic.dated > 0 && <Dot />}
            {topic.dated > 0 && <span>{topic.dated} dates</span>}
          </div>
        </a>
      ))}
    </div>
  )
}

function Dot() {
  return <span className="h-0.5 w-0.5 rounded-full bg-line-strong" aria-hidden="true" />
}
