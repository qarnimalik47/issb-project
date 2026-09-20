'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

const SECTIONS = [
  { value: 'conflict', label: 'Conflicts and wars' },
  { value: 'pakistan', label: 'Pakistan' },
  { value: 'diplomacy', label: 'Diplomacy and relations' },
  { value: 'economy', label: 'Economy' },
  { value: 'organisations', label: 'Organisations and treaties' },
  { value: 'defence', label: 'Defence' },
] as const

/** Topics worth having in the library, offered so the box is never empty. */
const SUGGESTIONS = [
  'Iran–Israel conflict',
  'Russian invasion of Ukraine',
  'China–Pakistan Economic Corridor',
  'Kashmir conflict',
  'Shanghai Cooperation Organisation',
  'BRICS',
  'Indus Waters Treaty',
  'Gaza war',
]

type Result = {
  slug: string
  title: string
  facts: number
  points: number
  timeline: number
  cardsCreated: number
  usedNarrative: boolean
  narrativeModel: string | null
}

export function GatherTopicPanel() {
  const [query, setQuery] = useState('')
  const [section, setSection] = useState<string>('conflict')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<Result | null>(null)

  async function gather(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setBusy(true)
    setError('')
    setResult(null)
    try {
      const res = await fetch('/api/admin/gk/topics', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ query: query.trim(), section }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data?.error?.message ?? 'Gather failed')
        return
      }
      setResult(data as Result)
      setQuery('')
    } catch {
      setError('Could not reach the server')
    } finally {
      setBusy(false)
    }
  }

  return (
    <Card className="flex flex-col gap-5">
      <div>
        <h2 className="font-display text-lg font-semibold text-ink">Gather a topic</h2>
        <p className="mt-1.5 text-sm text-ink-muted">
          Pulls facts from Wikidata and Wikipedia, writes original study notes, and publishes the
          dossier to every candidate. Re-running a topic refreshes the same page rather than
          creating a second one.
        </p>
      </div>

      <form onSubmit={gather} className="flex flex-col gap-3 sm:flex-row">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          required
          minLength={3}
          placeholder="Event, person or organisation"
          className="flex-1 rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-ink outline-none focus:border-brand-500"
        />
        <select
          value={section}
          onChange={(e) => setSection(e.target.value)}
          className="rounded-xl border border-line bg-surface px-3 py-2.5 text-sm text-ink outline-none focus:border-brand-500"
        >
          {SECTIONS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <Button type="submit" disabled={busy || query.trim().length < 3}>
          {busy ? 'Gathering…' : 'Gather'}
        </Button>
      </form>

      {busy && (
        <p className="text-sm text-ink-muted">
          Fetching sources and writing notes. This takes up to a minute.
        </p>
      )}

      {!busy && !result && !error && (
        <div className="flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setQuery(s)}
              className="rounded-pill border border-line px-3 py-1 text-xs text-ink-muted hover:border-brand-300 hover:text-ink"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {error && (
        <p className="rounded-xl border border-flare-100 bg-flare-50 px-4 py-3 text-sm text-flare-600">
          {error}
        </p>
      )}

      {result && (
        <div className="flex flex-col gap-3 rounded-xl border border-brand-200 bg-brand-50 p-4 dark:border-brand-700 dark:bg-brand-950">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-display font-semibold text-ink">{result.title}</span>
            <Badge tone="green">Published</Badge>
            {!result.usedNarrative && <Badge tone="brass">Facts only</Badge>}
          </div>
          <p className="text-sm text-ink-muted">
            {result.facts} facts · {result.points} sections · {result.timeline} dated events ·{' '}
            {result.cardsCreated} flashcards
            {result.narrativeModel ? ` · written by ${result.narrativeModel}` : ''}
          </p>
          {!result.usedNarrative && (
            <p className="text-sm text-ink-muted">
              No AI provider is configured, so the page carries facts and sources without written
              notes. Set an API key to add them.
            </p>
          )}
          <a
            href={`/gk/current-affairs/${result.slug}`}
            className="text-sm font-medium text-brand-700 underline underline-offset-4 dark:text-brand-200"
          >
            Open the dossier
          </a>
        </div>
      )}
    </Card>
  )
}
