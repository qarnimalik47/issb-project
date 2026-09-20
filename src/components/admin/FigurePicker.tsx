'use client'

import { useRef, useState } from 'react'

export type FigureValue = { id: string; url: string } | null

type LibraryFigure = {
  id: string
  url: string
  width: number | null
  height: number | null
  name: string | null
  usedBy: number
}

const btnCls =
  'rounded-lg border border-line-strong px-3 py-1.5 text-sm font-medium hover:bg-sunk disabled:opacity-40 dark:border-neutral-700 dark:hover:bg-neutral-800'

/**
 * Attach a figure to a question: upload a new image, reuse one from the
 * library, or remove it. Previews are `dir="ltr"` — a figure must never be
 * mirrored, in the editor any more than in the exam.
 */
export function FigurePicker({
  value,
  onChange,
}: {
  value: FigureValue
  onChange: (value: FigureValue) => void
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [library, setLibrary] = useState<LibraryFigure[] | null>(null)
  const [libraryOpen, setLibraryOpen] = useState(false)

  async function upload(file: File) {
    setUploading(true)
    setError('')
    const form = new FormData()
    form.set('file', file)
    const res = await fetch('/api/admin/media', { method: 'POST', body: form })
    const body = await res.json().catch(() => null)
    setUploading(false)
    if (!res.ok) {
      setError(body?.error?.message ?? 'Upload failed')
      return
    }
    onChange({ id: body.figure.id, url: body.figure.url })
    setLibrary(null)
  }

  async function openLibrary() {
    setLibraryOpen((open) => !open)
    if (library) return
    const res = await fetch('/api/admin/media')
    const body = await res.json().catch(() => null)
    if (res.ok) setLibrary(body.figures)
    else setError(body?.error?.message ?? 'Could not load the figure library')
  }

  return (
    <div className="flex flex-col gap-3">
      <div
        dir="ltr"
        className="flex min-h-40 items-center justify-center overflow-hidden rounded-xl border border-dashed border-line-strong bg-white p-3"
      >
        {value ? (
          // Signed API URL; see QuestionMedia for why next/image is not used.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value.url} alt="Question figure preview" className="max-h-72 object-contain" />
        ) : (
          <span className="text-sm text-ink-muted">No figure</span>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={btnCls}
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
        >
          {uploading ? 'Uploading…' : value ? 'Replace image' : 'Upload image'}
        </button>
        <button type="button" className={btnCls} onClick={() => void openLibrary()}>
          {libraryOpen ? 'Hide library' : 'Choose from library'}
        </button>
        {value && (
          <button type="button" className={btnCls} onClick={() => onChange(null)}>
            Remove figure
          </button>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            e.target.value = ''
            if (file) void upload(file)
          }}
        />
      </div>
      <p className="text-xs text-ink-muted">PNG, JPEG or WebP, up to 5 MB. SVG is not accepted.</p>
      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      {libraryOpen && (
        <div className="rounded-xl border border-line p-3">
          {!library ? (
            <p className="text-sm text-ink-muted">Loading…</p>
          ) : library.length === 0 ? (
            <p className="text-sm text-ink-muted">The library is empty — upload an image.</p>
          ) : (
            <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {library.map((f) => (
                <li key={f.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange({ id: f.id, url: f.url })
                      setLibraryOpen(false)
                    }}
                    aria-pressed={value?.id === f.id}
                    className={`flex w-full flex-col gap-1 rounded-lg border p-2 text-start text-xs hover:border-brand-500 ${
                      value?.id === f.id
                        ? 'border-brand-600 ring-2 ring-brand-500/40'
                        : 'border-line'
                    }`}
                  >
                    <span dir="ltr" className="flex h-20 items-center justify-center bg-white">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={f.url} alt="" className="max-h-20 object-contain" />
                    </span>
                    <span className="truncate text-ink-muted">{f.name ?? 'image'}</span>
                    <span className="text-ink-muted">
                      {f.width}×{f.height} · used by {f.usedBy}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
