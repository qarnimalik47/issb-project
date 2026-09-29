'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

type Status = 'draft' | 'published' | 'archived'
type Difficulty = 'easy' | 'medium' | 'hard'

type Summary = {
  id: string
  title: string
  difficulty: Difficulty
  status: Status
  hasMap: boolean
  hasUrdu: boolean
  problemCount: number
  set: string | null
}

type Draft = {
  titleEn: string
  titleUr: string
  narrativeEn: string
  narrativeUr: string
  problems: string[]
  modelPlan: string[]
  difficulty: Difficulty
  status: Status
  map: { id: string; url: string } | null
}

const EMPTY: Draft = {
  titleEn: '',
  titleUr: '',
  narrativeEn: '',
  narrativeUr: '',
  problems: ['', '', ''],
  modelPlan: ['', '', ''],
  difficulty: 'medium',
  status: 'draft',
  map: null,
}

const inputCls =
  'w-full rounded-lg border border-line-strong bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:border-brand-500 focus:outline-none'
const labelCls = 'flex flex-col gap-1 text-sm font-medium text-ink'
const hintCls = 'text-xs font-normal text-ink-muted'

async function errorOf(res: Response, fallback: string) {
  const body = await res.json().catch(() => null)
  const details = body?.error?.details as { path: string; message: string }[] | undefined
  const msg = (body?.error?.message as string | undefined) ?? fallback
  return details?.length
    ? `${msg}: ${details.map((d) => `${d.path} ${d.message}`).join('; ')}`
    : msg
}

/**
 * Group Planning Exercise ("military planning") scenarios: the briefing the
 * GTO reads, an optional map, the problems hidden in it and one model plan.
 */
export function PlanningManager({ canDelete }: { canDelete: boolean }) {
  const [list, setList] = useState<Summary[] | null>(null)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | Status>('all')
  const [selected, setSelected] = useState<string | 'new' | null>(null)

  const load = useCallback(async () => {
    const res = await fetch('/api/admin/planning')
    if (res.ok) setList((await res.json()).scenarios)
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch on mount
    void load()
  }, [load])

  const shown = (list ?? []).filter(
    (s) =>
      (statusFilter === 'all' || s.status === statusFilter) &&
      s.title.toLowerCase().includes(query.trim().toLowerCase()),
  )

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <aside className="flex flex-col gap-3">
        <Button type="button" onClick={() => setSelected('new')}>
          New scenario
        </Button>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search titles…"
          className={inputCls}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as 'all' | Status)}
          className={inputCls}
          aria-label="Filter by status"
        >
          <option value="all">All statuses</option>
          <option value="published">Live</option>
          <option value="draft">Drafts</option>
          <option value="archived">Archived</option>
        </select>
        {!list && <p className="text-sm text-ink-muted">Loading…</p>}
        <ul className="flex max-h-[70vh] flex-col gap-1 overflow-y-auto pe-1">
          {shown.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => setSelected(s.id)}
                aria-current={selected === s.id}
                className={`flex w-full flex-col gap-1 rounded-lg border px-3 py-2 text-start ${
                  selected === s.id
                    ? 'border-brand-600 bg-brand-50 dark:bg-brand-950'
                    : 'border-line bg-surface hover:bg-sunk'
                }`}
              >
                <span className="text-sm font-medium text-ink">{s.title}</span>
                <span className="flex flex-wrap gap-1.5 text-xs text-ink-muted">
                  <span
                    className={s.status === 'published' ? 'text-brand-700 dark:text-brand-300' : ''}
                  >
                    {s.status === 'published'
                      ? 'Live'
                      : s.status === 'draft'
                        ? 'Draft'
                        : 'Archived'}
                  </span>
                  · {s.difficulty}
                  {s.hasMap && ' · map'}
                  {s.hasUrdu && ' · اردو'}
                  {s.set && ` · ${s.set}`}
                </span>
              </button>
            </li>
          ))}
        </ul>
        {list && (
          <p className="text-xs text-ink-muted tabular-nums">
            {list.filter((s) => s.status === 'published').length} live of {list.length}
          </p>
        )}
      </aside>

      <section>
        {selected ? (
          <PlanningEditor
            key={selected}
            id={selected === 'new' ? null : selected}
            canDelete={canDelete}
            onSaved={async (id) => {
              await load()
              setSelected(id)
            }}
            onDeleted={async () => {
              await load()
              setSelected(null)
            }}
          />
        ) : (
          <div className="rounded-card border border-dashed border-line-strong p-10 text-center text-sm text-ink-muted">
            Choose a scenario to edit, or start a new one.
          </div>
        )}
      </section>
    </div>
  )
}

function ListEditor({
  label,
  hint,
  items,
  onChange,
  placeholder,
}: {
  label: string
  hint: string
  items: string[]
  onChange: (items: string[]) => void
  placeholder: string
}) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="text-sm font-medium text-ink">{label}</legend>
      <p className={hintCls}>{hint}</p>
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-2">
          <span className="mt-2 w-5 text-end text-sm text-ink-muted tabular-nums">{i + 1}.</span>
          <textarea
            rows={2}
            value={item}
            placeholder={placeholder}
            onChange={(e) => onChange(items.map((x, j) => (j === i ? e.target.value : x)))}
            className={inputCls}
          />
          <div className="flex flex-col">
            <button
              type="button"
              aria-label="Move up"
              disabled={i === 0}
              onClick={() => {
                const next = [...items]
                ;[next[i - 1], next[i]] = [next[i]!, next[i - 1]!]
                onChange(next)
              }}
              className="px-1 text-ink-muted hover:text-ink disabled:opacity-30"
            >
              ↑
            </button>
            <button
              type="button"
              aria-label="Remove"
              onClick={() => onChange(items.filter((_, j) => j !== i))}
              className="px-1 text-ink-muted hover:text-flare-600"
            >
              ×
            </button>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, ''])}
        className="w-fit text-sm text-brand-700 underline dark:text-brand-300"
      >
        + Add line
      </button>
    </fieldset>
  )
}

function PlanningEditor({
  id,
  canDelete,
  onSaved,
  onDeleted,
}: {
  id: string | null
  canDelete: boolean
  onSaved: (id: string) => Promise<void>
  onDeleted: () => Promise<void>
}) {
  const [draft, setDraft] = useState<Draft | null>(id ? null : EMPTY)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [showUrdu, setShowUrdu] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!id) return
    void (async () => {
      const res = await fetch(`/api/admin/planning/${id}`)
      if (!res.ok) return setError(await errorOf(res, 'Could not load the scenario'))
      const s = (await res.json()).scenario
      setDraft({
        titleEn: s.titleEn,
        titleUr: s.titleUr ?? '',
        narrativeEn: s.narrativeEn,
        narrativeUr: s.narrativeUr ?? '',
        problems: s.problems.length ? s.problems : [''],
        modelPlan: s.modelPlan.length ? s.modelPlan : [''],
        difficulty: s.difficulty,
        status: s.status,
        map: s.map,
      })
      setShowUrdu(!!s.narrativeUr)
    })()
  }, [id])

  if (!draft) return <p className="text-sm text-ink-muted">{error || 'Loading…'}</p>
  const set = (patch: Partial<Draft>) => setDraft((d) => ({ ...d!, ...patch }))

  async function uploadMap(file: File) {
    setUploading(true)
    setError('')
    const form = new FormData()
    form.set('file', file)
    const res = await fetch('/api/admin/planning/map', { method: 'POST', body: form })
    setUploading(false)
    if (!res.ok) return setError(await errorOf(res, 'Upload failed'))
    set({ map: (await res.json()).map })
  }

  async function save(status: Status) {
    setBusy(true)
    setError('')
    setNotice('')
    const d = draft!
    const body = {
      titleEn: d.titleEn,
      titleUr: d.titleUr || null,
      narrativeEn: d.narrativeEn,
      narrativeUr: d.narrativeUr || null,
      problems: d.problems.filter((p) => p.trim()),
      modelPlan: d.modelPlan.filter((p) => p.trim()),
      difficulty: d.difficulty,
      status,
      mapMediaId: d.map?.id ?? null,
    }
    const res = await fetch(id ? `/api/admin/planning/${id}` : '/api/admin/planning', {
      method: id ? 'PUT' : 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    })
    setBusy(false)
    if (!res.ok) return setError(await errorOf(res, 'Could not save'))
    const saved = (await res.json()).id as string
    set({ status })
    setNotice(status === 'published' ? 'Saved and live.' : 'Saved.')
    await onSaved(saved)
  }

  async function remove() {
    if (!id || !window.confirm('Delete this scenario permanently?')) return
    setBusy(true)
    const res = await fetch(`/api/admin/planning/${id}`, { method: 'DELETE' })
    setBusy(false)
    if (!res.ok) return setError(await errorOf(res, 'Could not delete'))
    await onDeleted()
  }

  const live = draft.status === 'published'

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        void save(draft.status)
      }}
      className="flex flex-col gap-6 rounded-card border border-line bg-surface p-5 shadow-card"
    >
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="font-display text-lg font-semibold text-ink">
          {id ? 'Edit scenario' : 'New scenario'}
        </h2>
        <Badge tone={live ? 'green' : 'brass'}>
          {live ? 'Live' : draft.status === 'archived' ? 'Archived' : 'Draft'}
        </Badge>
      </div>

      <label className={labelCls}>
        Title
        <input
          value={draft.titleEn}
          onChange={(e) => set({ titleEn: e.target.value })}
          placeholder="e.g. Bus overturned on the canal road"
          className={inputCls}
        />
      </label>

      <label className={labelCls}>
        Briefing
        <span className={hintCls}>
          What the GTO reads out: where the group is, the time, the resources they have (people,
          vehicles, distances, speeds) and everything that is going wrong. Candidates see this while
          they plan.
        </span>
        <textarea
          rows={10}
          value={draft.narrativeEn}
          onChange={(e) => set({ narrativeEn: e.target.value })}
          className={inputCls}
        />
        <span className={`${hintCls} tabular-nums`}>
          {draft.narrativeEn.trim().length} characters
        </span>
      </label>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-ink">Map / model sketch (optional)</span>
        <div
          dir="ltr"
          className="flex min-h-40 items-center justify-center overflow-hidden rounded-xl border border-dashed border-line-strong bg-white p-3"
        >
          {draft.map ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={draft.map.url} alt="Scenario map" className="max-h-80 object-contain" />
          ) : (
            <span className="text-sm text-ink-muted">No map</span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={uploading}
            onClick={() => fileRef.current?.click()}
          >
            {uploading ? 'Uploading…' : draft.map ? 'Replace map' : 'Upload map'}
          </Button>
          {draft.map && (
            <Button type="button" size="sm" variant="ghost" onClick={() => set({ map: null })}>
              Remove map
            </Button>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0]
              e.target.value = ''
              if (f) void uploadMap(f)
            }}
          />
        </div>
      </div>

      <ListEditor
        label="Problems in the briefing"
        hint="Every emergency the group must deal with. Reviewers and the AI marker check the plan covers each one."
        items={draft.problems}
        onChange={(problems) => set({ problems })}
        placeholder="e.g. Injured driver trapped under the bus"
      />

      <ListEditor
        label="Model plan"
        hint="One defensible order, each step with who, what and why. Candidates do not see this."
        items={draft.modelPlan}
        onChange={(modelPlan) => set({ modelPlan })}
        placeholder="e.g. Two men on the motorcycle to the police post 6 km away (15 min) — the only way to get an ambulance."
      />

      <label className={labelCls}>
        Difficulty
        <select
          value={draft.difficulty}
          onChange={(e) => set({ difficulty: e.target.value as Difficulty })}
          className={`${inputCls} w-fit`}
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </label>

      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={() => setShowUrdu((v) => !v)}
          className="w-fit text-sm text-brand-700 underline dark:text-brand-300"
        >
          {showUrdu ? 'Hide Urdu version' : 'Add Urdu version (optional)'}
        </button>
        {showUrdu && (
          <>
            <label className={labelCls}>
              Urdu title
              <input
                dir="rtl"
                value={draft.titleUr}
                onChange={(e) => set({ titleUr: e.target.value })}
                className={inputCls}
              />
            </label>
            <label className={labelCls}>
              Urdu briefing
              <span className={hintCls}>
                Give the whole briefing or leave it blank; half a translation is worse than none.
              </span>
              <textarea
                dir="rtl"
                rows={8}
                value={draft.narrativeUr}
                onChange={(e) => set({ narrativeUr: e.target.value })}
                className={inputCls}
              />
            </label>
          </>
        )}
      </div>

      {error && (
        <p role="alert" className="text-sm text-flare-600">
          {error}
        </p>
      )}
      {notice && <p className="text-sm text-brand-700 dark:text-brand-300">{notice}</p>}

      <div className="flex flex-wrap gap-2 border-t border-line pt-4">
        <Button type="button" disabled={busy} onClick={() => void save('published')}>
          {live ? 'Save (stays live)' : 'Save and publish'}
        </Button>
        <Button type="button" variant="outline" disabled={busy} onClick={() => void save('draft')}>
          {live ? 'Unpublish and save' : 'Save as draft'}
        </Button>
        {canDelete && id && !live && (
          <Button
            type="button"
            variant="ghost"
            disabled={busy}
            onClick={() => void remove()}
            className="ms-auto"
          >
            Delete
          </Button>
        )}
      </div>
    </form>
  )
}
