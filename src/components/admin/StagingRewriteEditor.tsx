'use client'

import { useState } from 'react'
import {
  REWRITE_MAX_SIMILARITY,
  isSufficientlyRewritten,
  rewriteSimilarity,
} from '@/lib/content/similarity'

export type StagedContent = {
  stemEn: string
  stemUr?: string | null
  options: { key: string; textEn: string; textUr?: string }[]
  correctOption: string | null
  explanation: string | null
  hasFigure?: boolean
}

const inputCls =
  'w-full rounded-lg border border-line-strong bg-white px-3 py-2 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-500/30 dark:border-neutral-700 dark:bg-neutral-900'

/**
 * Edit a staged question before approval. For third-party items the meter
 * shows how much of the source's wording survives; it is the same measure the
 * server applies on save and again on approve, so this is guidance, not the gate.
 */
export function StagingRewriteEditor({
  source,
  initial,
  gated,
  onSaved,
  onCancel,
  itemId,
}: {
  source: StagedContent
  initial: StagedContent
  gated: boolean
  onSaved: (result: { reviewState: string; similarity: number }) => void
  onCancel: () => void
  itemId: string
}) {
  const [stemEn, setStemEn] = useState(initial.stemEn)
  const [stemUr, setStemUr] = useState(initial.stemUr ?? '')
  const [options, setOptions] = useState(initial.options)
  const [correct, setCorrect] = useState(initial.correctOption ?? '')
  const [explanation, setExplanation] = useState(initial.explanation ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const similarity = rewriteSimilarity(
    { stemEn: source.stemEn, explanation: source.explanation },
    { stemEn, explanation },
  )
  const ok = isSufficientlyRewritten(similarity)

  async function save() {
    setSaving(true)
    setError('')
    const res = await fetch(`/api/admin/import/staging/${itemId}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        stemEn,
        stemUr: stemUr || null,
        options,
        correctOption: correct || null,
        explanation: explanation || null,
      }),
    })
    const body = await res.json().catch(() => null)
    setSaving(false)
    if (!res.ok) {
      setError(body?.error?.message ?? 'Save failed')
      return
    }
    onSaved(body)
  }

  return (
    <div className="mt-3 flex flex-col gap-3 rounded-lg border border-line bg-sunk p-3">
      {gated && (
        <div>
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium">Wording shared with the source</span>
            <span
              className={`font-semibold tabular-nums ${ok ? 'text-brand-700 dark:text-brand-300' : 'text-red-700 dark:text-red-300'}`}
            >
              {Math.round(similarity * 100)}% {ok ? '— rewritten enough' : '— still too close'}
            </span>
          </div>
          <div
            className="mt-1 flex h-1.5 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700"
            role="meter"
            aria-label="Wording shared with the source"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(similarity * 100)}
          >
            <div
              className={ok ? 'bg-brand-600' : 'bg-red-600'}
              style={{ width: `${Math.round(similarity * 100)}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-ink-muted">
            Reword the question and explanation in your own words (at most{' '}
            {Math.round(REWRITE_MAX_SIMILARITY * 100)}% shared). Facts in the options can stay.
          </p>
        </div>
      )}

      <label className="flex flex-col gap-1 text-xs font-medium">
        Question (English)
        <textarea
          className={`${inputCls} min-h-16`}
          value={stemEn}
          onChange={(e) => setStemEn(e.target.value)}
        />
      </label>
      <label className="flex flex-col gap-1 text-xs font-medium">
        Question (Urdu, optional)
        <textarea
          className={`${inputCls} min-h-16 leading-loose`}
          dir="rtl"
          lang="ur"
          value={stemUr}
          onChange={(e) => setStemUr(e.target.value)}
        />
      </label>
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1 text-xs font-medium">Options — select the correct one</legend>
        {options.map((o, i) => (
          <div key={o.key} className="flex items-center gap-2">
            <input
              type="radio"
              name={`correct-${itemId}`}
              aria-label={`Option ${o.key} is correct`}
              checked={correct === o.key}
              onChange={() => setCorrect(o.key)}
            />
            <span className="w-5 font-mono text-xs">{o.key}</span>
            <input
              className={inputCls}
              aria-label={`Option ${o.key}`}
              value={o.textEn}
              onChange={(e) =>
                setOptions(options.map((x, j) => (j === i ? { ...x, textEn: e.target.value } : x)))
              }
            />
          </div>
        ))}
      </fieldset>
      <label className="flex flex-col gap-1 text-xs font-medium">
        Explanation
        <textarea
          className={`${inputCls} min-h-16`}
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
        />
      </label>
      {error && (
        <p role="alert" className="text-xs text-red-600">
          {error}
        </p>
      )}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => void save()}
          disabled={saving || !stemEn.trim()}
          className="rounded-lg bg-brand-700 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-40"
        >
          {saving ? 'Saving…' : 'Save edit'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-line-strong px-3 py-1.5 text-xs"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
