'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

type Status = 'draft' | 'published' | 'archived'

type Picture = {
  id: string
  description: string
  descriptionUr: string | null
  status: Status
  imageUrl: string | null
  width: number | null
  height: number | null
  fileName: string | null
  reviewNote: string | null
  set: string | null
}

type Pending = {
  key: string
  file: File
  preview: string
  description: string
  descriptionUr: string
  state: 'ready' | 'uploading' | 'done' | 'error'
  error?: string
}

const inputCls =
  'w-full rounded-lg border border-line-strong bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:border-brand-500 focus:outline-none'

const FILTERS: { key: 'all' | Status; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'published', label: 'Live' },
  { key: 'draft', label: 'Drafts' },
  { key: 'archived', label: 'Archived' },
]

async function errorOf(res: Response, fallback: string) {
  const body = await res.json().catch(() => null)
  return (body?.error?.message as string | undefined) ?? fallback
}

/**
 * Picture Story (TAT) bank: upload pictures with a scene description, then
 * publish them. Publishing puts a picture straight into a numbered test set.
 */
export function PictureStoryManager({ canDelete }: { canDelete: boolean }) {
  const [pictures, setPictures] = useState<Picture[] | null>(null)
  const [loadError, setLoadError] = useState('')
  const [filter, setFilter] = useState<'all' | Status>('all')
  const [pending, setPending] = useState<Pending[]>([])
  const [publishNow, setPublishNow] = useState(true)
  const [busy, setBusy] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const load = useCallback(async () => {
    const res = await fetch('/api/admin/picture-stories')
    if (!res.ok) return setLoadError(await errorOf(res, 'Could not load pictures'))
    setPictures((await res.json()).pictures)
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch on mount
    void load()
  }, [load])

  // Release preview object URLs when pending items go away.
  useEffect(() => {
    return () => pending.forEach((p) => URL.revokeObjectURL(p.preview))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function addFiles(files: FileList | null) {
    if (!files) return
    const next = [...files]
      .filter((f) => /^image\/(png|jpeg|webp)$/.test(f.type))
      .map((file) => ({
        key: `${file.name}-${file.size}-${Math.random().toString(36).slice(2)}`,
        file,
        preview: URL.createObjectURL(file),
        description: '',
        descriptionUr: '',
        state: 'ready' as const,
      }))
    setPending((p) => [...p, ...next])
  }

  function patchPending(key: string, patch: Partial<Pending>) {
    setPending((list) => list.map((p) => (p.key === key ? { ...p, ...patch } : p)))
  }

  function removePending(key: string) {
    setPending((list) => {
      const gone = list.find((p) => p.key === key)
      if (gone) URL.revokeObjectURL(gone.preview)
      return list.filter((p) => p.key !== key)
    })
  }

  async function uploadAll() {
    setBusy(true)
    for (const p of pending) {
      if (p.state === 'done') continue
      if (p.description.trim().length < 10) {
        patchPending(p.key, { state: 'error', error: 'Write a one-sentence description first' })
        continue
      }
      patchPending(p.key, { state: 'uploading', error: undefined })
      const form = new FormData()
      form.set('file', p.file)
      form.set('description', p.description)
      form.set('descriptionUr', p.descriptionUr)
      form.set('publish', publishNow ? '1' : '0')
      const res = await fetch('/api/admin/picture-stories', { method: 'POST', body: form })
      if (res.ok) patchPending(p.key, { state: 'done' })
      else patchPending(p.key, { state: 'error', error: await errorOf(res, 'Upload failed') })
    }
    setBusy(false)
    await load()
    // Clear what went through; keep failures on screen to fix.
    setPending((list) => {
      list.filter((p) => p.state === 'done').forEach((p) => URL.revokeObjectURL(p.preview))
      return list.filter((p) => p.state !== 'done')
    })
  }

  const shown = (pictures ?? []).filter((p) => filter === 'all' || p.status === filter)
  const counts = {
    all: pictures?.length ?? 0,
    published: pictures?.filter((p) => p.status === 'published').length ?? 0,
    draft: pictures?.filter((p) => p.status === 'draft').length ?? 0,
    archived: pictures?.filter((p) => p.status === 'archived').length ?? 0,
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Upload */}
      <section className="rounded-card border border-line bg-surface p-5 shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-semibold text-ink">Add pictures</h2>
            <p className="text-sm text-ink-muted">
              PNG, JPEG or WebP, up to 5 MB each. You can select several at once.
            </p>
          </div>
          <Button type="button" variant="outline" onClick={() => fileRef.current?.click()}>
            Choose pictures
          </Button>
          <input
            ref={fileRef}
            type="file"
            multiple
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={(e) => {
              addFiles(e.target.files)
              e.target.value = ''
            }}
          />
        </div>

        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault()
            addFiles(e.dataTransfer.files)
          }}
          className="mt-4 rounded-xl border border-dashed border-line-strong p-4 text-center text-sm text-ink-muted"
        >
          {pending.length === 0 ? 'Or drop pictures here.' : 'Drop more pictures here.'}
        </div>

        {pending.length > 0 && (
          <div className="mt-4 flex flex-col gap-4">
            {pending.map((p) => (
              <div
                key={p.key}
                className="grid gap-4 rounded-xl border border-line p-3 sm:grid-cols-[160px_1fr]"
              >
                <div dir="ltr" className="flex items-center justify-center rounded-lg bg-white p-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.preview} alt="" className="max-h-36 object-contain" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium text-ink-muted">
                    Scene description (hidden from the candidate; used as alt text and for marking)
                    <textarea
                      rows={2}
                      value={p.description}
                      onChange={(e) => patchPending(p.key, { description: e.target.value })}
                      placeholder="e.g. A young man stands at a railway platform holding a letter while a train pulls away."
                      className={`${inputCls} mt-1`}
                    />
                  </label>
                  <label className="text-xs font-medium text-ink-muted">
                    Urdu description (optional)
                    <textarea
                      dir="rtl"
                      rows={1}
                      value={p.descriptionUr}
                      onChange={(e) => patchPending(p.key, { descriptionUr: e.target.value })}
                      className={`${inputCls} mt-1`}
                    />
                  </label>
                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <span className="truncate text-ink-muted">{p.file.name}</span>
                    {p.state === 'uploading' && <span className="text-ink-muted">Uploading…</span>}
                    {p.state === 'error' && (
                      <span role="alert" className="text-flare-600">
                        {p.error}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => removePending(p.key)}
                      className="ms-auto text-ink-muted underline hover:text-ink"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <div className="flex flex-wrap items-center gap-4">
              <label className="flex items-center gap-2 text-sm text-ink">
                <input
                  type="checkbox"
                  checked={publishNow}
                  onChange={(e) => setPublishNow(e.target.checked)}
                />
                Publish immediately (candidates see them in the Picture Story test)
              </label>
              <Button
                type="button"
                disabled={busy}
                onClick={() => void uploadAll()}
                className="ms-auto"
              >
                {busy
                  ? 'Uploading…'
                  : `Upload ${pending.length} picture${pending.length === 1 ? '' : 's'}`}
              </Button>
            </div>
          </div>
        )}
      </section>

      {/* Library */}
      <section className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="me-2 font-display text-lg font-semibold text-ink">Picture bank</h2>
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              aria-pressed={filter === f.key}
              className={`rounded-pill border px-3 py-1 text-sm ${
                filter === f.key
                  ? 'border-brand-600 bg-brand-600 text-white'
                  : 'border-line-strong text-ink-muted hover:bg-sunk'
              }`}
            >
              {f.label} <span className="tabular-nums">({counts[f.key]})</span>
            </button>
          ))}
        </div>

        {loadError && <p className="text-sm text-flare-600">{loadError}</p>}
        {!pictures && !loadError && <p className="text-sm text-ink-muted">Loading…</p>}
        {pictures && shown.length === 0 && (
          <p className="text-sm text-ink-muted">No pictures here yet.</p>
        )}

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((p) => (
            <PictureCard key={p.id} picture={p} canDelete={canDelete} onChanged={load} />
          ))}
        </ul>
      </section>
    </div>
  )
}

function PictureCard({
  picture,
  canDelete,
  onChanged,
}: {
  picture: Picture
  canDelete: boolean
  onChanged: () => Promise<void>
}) {
  const [editing, setEditing] = useState(false)
  const [description, setDescription] = useState(picture.description)
  const [descriptionUr, setDescriptionUr] = useState(picture.descriptionUr ?? '')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function patch(body: Record<string, unknown>) {
    setBusy(true)
    setError('')
    const res = await fetch(`/api/admin/picture-stories/${picture.id}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    })
    setBusy(false)
    if (!res.ok) return setError(await errorOf(res, 'Could not save'))
    setEditing(false)
    await onChanged()
  }

  async function remove() {
    if (!window.confirm('Delete this picture permanently?')) return
    setBusy(true)
    const res = await fetch(`/api/admin/picture-stories/${picture.id}`, { method: 'DELETE' })
    setBusy(false)
    if (!res.ok) return setError(await errorOf(res, 'Could not delete'))
    await onChanged()
  }

  const live = picture.status === 'published'
  return (
    <li className="flex flex-col overflow-hidden rounded-card border border-line bg-surface shadow-card">
      <div dir="ltr" className="flex h-52 items-center justify-center bg-white p-2">
        {picture.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={picture.imageUrl}
            alt={picture.description}
            className="max-h-48 object-contain"
          />
        ) : (
          <span className="text-sm text-ink-muted">Image missing</span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={live ? 'green' : picture.status === 'archived' ? 'neutral' : 'brass'}>
            {live ? 'Live' : picture.status === 'archived' ? 'Archived' : 'Draft'}
          </Badge>
          {picture.set && <Badge>{picture.set}</Badge>}
          {picture.width && (
            <span className="text-xs text-ink-muted tabular-nums">
              {picture.width}×{picture.height}
            </span>
          )}
        </div>

        {editing ? (
          <>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={inputCls}
            />
            <textarea
              dir="rtl"
              rows={2}
              value={descriptionUr}
              onChange={(e) => setDescriptionUr(e.target.value)}
              placeholder="Urdu description (optional)"
              className={inputCls}
            />
          </>
        ) : (
          <p className="text-sm text-ink">{picture.description}</p>
        )}

        {picture.reviewNote && (
          <p className="rounded-lg bg-brass-50 px-2 py-1 text-xs text-brass-700 dark:bg-brass-900 dark:text-brass-200">
            Review: {picture.reviewNote}
          </p>
        )}
        {error && (
          <p role="alert" className="text-xs text-flare-600">
            {error}
          </p>
        )}

        <div className="mt-auto flex flex-wrap gap-2 pt-2">
          {editing ? (
            <>
              <Button
                size="sm"
                disabled={busy}
                onClick={() => void patch({ description, descriptionUr: descriptionUr || null })}
              >
                Save
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button
                size="sm"
                variant={live ? 'outline' : 'primary'}
                disabled={busy}
                onClick={() => void patch({ status: live ? 'draft' : 'published' })}
              >
                {live ? 'Unpublish' : 'Publish'}
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setEditing(true)}>
                Edit
              </Button>
              {canDelete && !live && (
                <Button size="sm" variant="ghost" disabled={busy} onClick={() => void remove()}>
                  Delete
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </li>
  )
}
