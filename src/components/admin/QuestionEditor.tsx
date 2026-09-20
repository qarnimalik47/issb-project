'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { publishReadiness } from '@/lib/content/readiness'
import { FigurePicker, type FigureValue } from './FigurePicker'

type TestTypeOption = { id: string; code: string; nameEn: string; scoringType: string }
type Option = { key: string; textEn: string; textUr?: string }

export type EditableQuestion = {
  id: string
  testTypeId: string
  stemEn: string
  stemUr: string | null
  options: Option[] | null
  correctOption: string | null
  explanationEn: string | null
  explanationUr: string | null
  difficulty: string
  topic: string | null
  mediaId: string | null
  mediaUrl: string | null
  status: 'draft' | 'published' | 'archived'
  version: number
}

type Row = Option & { uid: string }

const MAX_OPTIONS = 8
const LETTERS = 'ABCDEFGH'

const inputCls =
  'w-full rounded-lg border border-line-strong bg-white px-3 py-2 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-500/30 dark:border-neutral-700 dark:bg-neutral-900'
const labelCls = 'flex flex-col gap-1.5 text-sm font-medium'
const btnCls =
  'rounded-lg border border-line-strong px-3 py-1.5 text-sm font-medium hover:bg-sunk disabled:opacity-40 dark:border-neutral-700 dark:hover:bg-neutral-800'
const primaryCls =
  'rounded-lg bg-brand-700 px-4 py-2 text-sm font-medium text-white hover:bg-brand-800 disabled:opacity-40 dark:bg-brand-500 dark:text-brand-950'

let uidCounter = 0
const nextUid = () => `o${++uidCounter}`

function toRows(options: Option[] | null): Row[] {
  const list = options?.length ? options : ['A', 'B', 'C', 'D'].map((key) => ({ key, textEn: '' }))
  return list.map((o) => ({ ...o, uid: nextUid() }))
}

/**
 * Create or edit one question. Urdu fields are `dir="rtl" lang="ur"`; the
 * admin chrome itself is English-only by design.
 *
 * Reordering options moves rows but never renames their keys — renaming would
 * silently re-point the answer key and change the content hash. "Re-letter
 * A–D" is the explicit action that renames keys in their current order, and
 * it carries the correct answer along with it.
 */
export function QuestionEditor({
  testTypes,
  topics,
  question,
  canArchive,
}: {
  testTypes: TestTypeOption[]
  topics: string[]
  question: EditableQuestion | null
  canArchive: boolean
}) {
  const router = useRouter()
  const [testTypeId, setTestTypeId] = useState(question?.testTypeId ?? testTypes[0]?.id ?? '')
  const [stemEn, setStemEn] = useState(question?.stemEn ?? '')
  const [stemUr, setStemUr] = useState(question?.stemUr ?? '')
  const [rows, setRows] = useState<Row[]>(() => toRows(question?.options ?? null))
  const [correct, setCorrect] = useState(question?.correctOption ?? '')
  const [explanationEn, setExplanationEn] = useState(question?.explanationEn ?? '')
  const [explanationUr, setExplanationUr] = useState(question?.explanationUr ?? '')
  const [difficulty, setDifficulty] = useState(question?.difficulty ?? 'medium')
  const [topic, setTopic] = useState(question?.topic ?? '')
  const [figure, setFigure] = useState<FigureValue>(
    question?.mediaId && question.mediaUrl
      ? { id: question.mediaId, url: question.mediaUrl }
      : null,
  )
  const [status, setStatus] = useState(question?.status ?? 'draft')
  const [dirty, setDirty] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ tone: 'ok' | 'error'; lines: string[] } | null>(null)

  const testType = testTypes.find((t) => t.id === testTypeId)
  const objective = testType?.scoringType === 'objective'
  const options: Option[] = rows.map(({ key, textEn, textUr }) => ({
    key: key.trim(),
    textEn,
    ...(textUr?.trim() ? { textUr } : {}),
  }))

  const readiness = useMemo(
    () =>
      publishReadiness({
        stemEn,
        options: objective ? options : null,
        correctOption: objective ? correct || null : null,
        objective,
      }),
    // `options` is derived from rows each render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [stemEn, rows, correct, objective],
  )

  // Warn before leaving with unsaved edits.
  useEffect(() => {
    if (!dirty) return
    const onBeforeUnload = (e: BeforeUnloadEvent) => e.preventDefault()
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [dirty])

  function edit<T>(set: (v: T) => void) {
    return (v: T) => {
      set(v)
      setDirty(true)
    }
  }

  function updateRow(uid: string, patch: Partial<Option>) {
    setRows((prev) => prev.map((r) => (r.uid === uid ? { ...r, ...patch } : r)))
    setDirty(true)
    if (patch.key !== undefined) {
      const old = rows.find((r) => r.uid === uid)?.key
      if (old && old === correct) setCorrect(patch.key)
    }
  }

  function move(uid: string, delta: -1 | 1) {
    setRows((prev) => {
      const i = prev.findIndex((r) => r.uid === uid)
      const j = i + delta
      if (i < 0 || j < 0 || j >= prev.length) return prev
      const next = prev.slice()
      ;[next[i], next[j]] = [next[j]!, next[i]!]
      return next
    })
    setDirty(true)
  }

  function removeRow(uid: string) {
    const row = rows.find((r) => r.uid === uid)
    if (row?.key === correct) setCorrect('')
    setRows((prev) => prev.filter((r) => r.uid !== uid))
    setDirty(true)
  }

  function addRow() {
    const used = new Set(rows.map((r) => r.key))
    const key = [...LETTERS].find((l) => !used.has(l)) ?? ''
    setRows((prev) => [...prev, { uid: nextUid(), key, textEn: '' }])
    setDirty(true)
  }

  function reletter() {
    const mapping = new Map(rows.map((r, i) => [r.key, LETTERS[i]!]))
    setRows((prev) => prev.map((r, i) => ({ ...r, key: LETTERS[i]! })))
    if (correct) setCorrect(mapping.get(correct) ?? '')
    setDirty(true)
  }

  function payload() {
    return {
      testTypeId,
      stemEn: stemEn.trim(),
      stemUr: stemUr.trim() || null,
      options: objective ? options : null,
      correctOption: objective ? correct || null : null,
      explanationEn: explanationEn.trim() || null,
      explanationUr: explanationUr.trim() || null,
      difficulty,
      topic: topic.trim() || null,
      mediaId: figure?.id ?? null,
    }
  }

  async function save(nextStatus?: 'draft' | 'published') {
    setSaving(true)
    setMessage(null)
    const body = question
      ? { ...payload(), ...(nextStatus ? { status: nextStatus } : {}) }
      : payload()
    const res = await fetch(
      question ? `/api/admin/questions/${question.id}` : '/api/admin/questions',
      {
        method: question ? 'PATCH' : 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
      },
    )
    const data = await res.json().catch(() => null)
    setSaving(false)
    if (!res.ok) {
      const details: { message: string }[] = data?.error?.details ?? []
      setMessage({
        tone: 'error',
        lines: [data?.error?.message ?? 'Save failed', ...details.map((d) => d.message)],
      })
      return
    }
    setDirty(false)
    if (!question) {
      // Publishing needs a saved draft first; land on its edit page.
      router.replace(`/admin/questions/${data.question.id}`)
      return
    }
    setStatus(data.question.status)
    setMessage({
      tone: 'ok',
      lines: [
        nextStatus === 'published'
          ? 'Published — it is now live for students.'
          : nextStatus === 'draft'
            ? 'Moved back to draft.'
            : 'Saved.',
      ],
    })
  }

  async function archive() {
    if (!question) return
    setSaving(true)
    const res = await fetch(`/api/admin/questions/${question.id}`, { method: 'DELETE' })
    setSaving(false)
    if (res.ok) router.push('/admin/questions')
    else setMessage({ tone: 'error', lines: ['Archive failed'] })
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <form
        className="flex flex-col gap-6"
        onSubmit={(e) => {
          e.preventDefault()
          void save()
        }}
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <label className={labelCls}>
            Test type
            <select
              className={inputCls}
              value={testTypeId}
              onChange={(e) => edit(setTestTypeId)(e.target.value)}
            >
              {testTypes.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nameEn}
                  {t.scoringType !== 'objective' ? ' (written)' : ''}
                </option>
              ))}
            </select>
          </label>
          <label className={labelCls}>
            Difficulty
            <select
              className={inputCls}
              value={difficulty}
              onChange={(e) => edit(setDifficulty)(e.target.value)}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </label>
          <label className={labelCls}>
            Topic
            <input
              className={inputCls}
              list="topic-suggestions"
              value={topic}
              maxLength={120}
              placeholder="e.g. number-series"
              onChange={(e) => edit(setTopic)(e.target.value)}
            />
            <datalist id="topic-suggestions">
              {topics.map((t) => (
                <option key={t} value={t} />
              ))}
            </datalist>
          </label>
        </div>

        <label className={labelCls}>
          Question (English)
          <textarea
            className={`${inputCls} min-h-24`}
            value={stemEn}
            maxLength={4000}
            required
            onChange={(e) => edit(setStemEn)(e.target.value)}
          />
        </label>
        <label className={labelCls}>
          Question (Urdu)
          <textarea
            className={`${inputCls} min-h-24 leading-loose`}
            dir="rtl"
            lang="ur"
            value={stemUr}
            maxLength={4000}
            onChange={(e) => edit(setStemUr)(e.target.value)}
          />
        </label>

        {objective && (
          <fieldset className="flex flex-col gap-3 rounded-xl border border-line p-4">
            <legend className="px-1 text-sm font-semibold">Options</legend>
            <p className="text-xs text-ink-muted">
              Select the correct answer with the radio button. Moving an option keeps its letter;
              use “Re-letter A–D” to rename letters in the current order.
            </p>
            {rows.map((r, i) => (
              <div
                key={r.uid}
                className="grid grid-cols-[auto_4rem_minmax(0,1fr)_minmax(0,1fr)_auto] items-center gap-2"
              >
                <input
                  type="radio"
                  name="correct"
                  aria-label={`Option ${r.key || i + 1} is correct`}
                  checked={Boolean(r.key) && correct === r.key}
                  onChange={() => edit(setCorrect)(r.key)}
                />
                <input
                  className={`${inputCls} text-center font-mono`}
                  aria-label={`Option ${i + 1} key`}
                  value={r.key}
                  maxLength={4}
                  onChange={(e) => updateRow(r.uid, { key: e.target.value.toUpperCase() })}
                />
                <input
                  className={inputCls}
                  aria-label={`Option ${r.key || i + 1} English text`}
                  placeholder="English"
                  value={r.textEn}
                  maxLength={2000}
                  onChange={(e) => updateRow(r.uid, { textEn: e.target.value })}
                />
                <input
                  className={inputCls}
                  aria-label={`Option ${r.key || i + 1} Urdu text`}
                  placeholder="اردو"
                  dir="rtl"
                  lang="ur"
                  value={r.textUr ?? ''}
                  maxLength={2000}
                  onChange={(e) => updateRow(r.uid, { textUr: e.target.value })}
                />
                <div className="flex gap-1">
                  <button
                    type="button"
                    className={btnCls}
                    aria-label={`Move option ${r.key} up`}
                    disabled={i === 0}
                    onClick={() => move(r.uid, -1)}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    className={btnCls}
                    aria-label={`Move option ${r.key} down`}
                    disabled={i === rows.length - 1}
                    onClick={() => move(r.uid, 1)}
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    className={btnCls}
                    aria-label={`Remove option ${r.key}`}
                    onClick={() => removeRow(r.uid)}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
            <div className="flex gap-2">
              <button
                type="button"
                className={btnCls}
                disabled={rows.length >= MAX_OPTIONS}
                onClick={addRow}
              >
                Add option
              </button>
              <button type="button" className={btnCls} onClick={reletter}>
                Re-letter A–{LETTERS[Math.max(0, rows.length - 1)]}
              </button>
            </div>
          </fieldset>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <label className={labelCls}>
            Explanation (English)
            <textarea
              className={`${inputCls} min-h-20`}
              value={explanationEn}
              maxLength={4000}
              onChange={(e) => edit(setExplanationEn)(e.target.value)}
            />
          </label>
          <label className={labelCls}>
            Explanation (Urdu)
            <textarea
              className={`${inputCls} min-h-20 leading-loose`}
              dir="rtl"
              lang="ur"
              value={explanationUr}
              maxLength={4000}
              onChange={(e) => edit(setExplanationUr)(e.target.value)}
            />
          </label>
        </div>

        <section className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold">Figure</h2>
          {testType?.code === 'nonverbal' && !figure && (
            <p className="text-xs text-amber-700 dark:text-amber-300">
              Non-verbal questions are figure-based — most need an image.
            </p>
          )}
          <FigurePicker value={figure} onChange={edit(setFigure)} />
        </section>
      </form>

      <aside className="flex flex-col gap-4 lg:sticky lg:top-6 lg:self-start">
        <div className="rounded-xl border border-line p-4">
          <p className="text-sm">
            Status: <span className="font-semibold">{status}</span>
            {question && <span className="text-ink-muted"> · v{question.version}</span>}
          </p>
          <h2 className="mt-3 text-sm font-semibold">Ready to publish?</h2>
          {readiness.length === 0 ? (
            <p className="mt-1 text-sm text-brand-700 dark:text-brand-300">✓ Yes — answerable.</p>
          ) : (
            <ul className="mt-1 list-disc ps-5 text-sm text-red-700 dark:text-red-300">
              {readiness.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          )}
          {!stemUr.trim() && (
            <p className="mt-2 text-xs text-amber-700 dark:text-amber-300">
              No Urdu yet — Urdu-language students will see the English text.
            </p>
          )}

          <div className="mt-4 flex flex-col gap-2">
            <button type="button" className={btnCls} disabled={saving} onClick={() => void save()}>
              {saving ? 'Saving…' : question ? 'Save changes' : 'Create draft'}
            </button>
            {question && status !== 'published' && (
              <button
                type="button"
                className={primaryCls}
                disabled={saving || readiness.length > 0}
                onClick={() => void save('published')}
              >
                Save & publish
              </button>
            )}
            {question && status === 'published' && (
              <button
                type="button"
                className={btnCls}
                disabled={saving}
                onClick={() => void save('draft')}
              >
                Unpublish
              </button>
            )}
            {question && canArchive && status !== 'archived' && (
              <button
                type="button"
                className={`${btnCls} text-red-700 dark:text-red-300`}
                disabled={saving}
                onClick={() => void archive()}
              >
                Archive
              </button>
            )}
          </div>
        </div>

        {message && (
          <div
            role={message.tone === 'error' ? 'alert' : 'status'}
            className={`rounded-lg border p-3 text-sm ${
              message.tone === 'error'
                ? 'border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200'
                : 'border-brand-200 bg-brand-50 text-brand-900 dark:border-brand-800 dark:bg-brand-950/40 dark:text-brand-100'
            }`}
          >
            {message.lines.map((l) => (
              <p key={l}>{l}</p>
            ))}
          </div>
        )}
        <a href="/admin/questions" className="text-sm text-ink-muted hover:underline">
          ← Back to the question bank
        </a>
      </aside>
    </div>
  )
}
