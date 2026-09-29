'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Locale } from '@/lib/i18n/config'
import { Button } from '@/components/ui/Button'
import { Progress } from '@/components/ui/Progress'

type Item = { id: string; textEn: string; textUr: string }
type ScalePoint = { value: number; en: string; ur: string }

const PAGE_SIZE = 8

/** Circle sizes: bigger at the extremes, like the familiar agree/disagree strip. */
const SIZES = ['h-11 w-11', 'h-9 w-9', 'h-7 w-7', 'h-6 w-6', 'h-7 w-7', 'h-9 w-9', 'h-11 w-11']

function tone(value: number, selected: boolean) {
  if (value < 4) return selected ? 'border-flare-500 bg-flare-500' : 'border-flare-500'
  if (value > 4) return selected ? 'border-brand-600 bg-brand-600' : 'border-brand-600'
  return selected ? 'border-ink-muted bg-ink-muted' : 'border-ink-muted'
}

const COPY = {
  en: {
    intro:
      'Read each statement and choose how well it describes you as you are now — not as you would like to be. There are no right or wrong answers, and no time limit, but first instincts are usually the most accurate.',
    agree: 'Agree',
    disagree: 'Disagree',
    back: 'Back',
    next: 'Next',
    finish: 'See my result',
    saving: 'Saving…',
    saved: 'Progress saved',
    answered: (n: number, total: number) => `${n} of ${total} answered`,
    start: 'Start the test',
    restart: 'Start over',
    blank: 'Answer every statement on this page to continue.',
  },
  ur: {
    intro:
      'ہر بیان پڑھیں اور بتائیں کہ یہ آپ کی موجودہ شخصیت کو کتنا بیان کرتا ہے — ویسی نہیں جیسی آپ بننا چاہتے ہیں۔ کوئی جواب درست یا غلط نہیں، اور کوئی وقت کی حد نہیں، مگر پہلا تاثر عموماً سب سے درست ہوتا ہے۔',
    agree: 'متفق',
    disagree: 'متفق نہیں',
    back: 'پیچھے',
    next: 'آگے',
    finish: 'میرا نتیجہ دیکھیں',
    saving: 'محفوظ ہو رہا ہے…',
    saved: 'پیش رفت محفوظ ہے',
    answered: (n: number, total: number) => `${total} میں سے ${n} کے جواب دیے گئے`,
    start: 'ٹیسٹ شروع کریں',
    restart: 'دوبارہ شروع کریں',
    blank: 'آگے بڑھنے کے لیے اس صفحے کے تمام بیانات کا جواب دیں۔',
  },
}

export function OpiPlayer({ locale }: { locale: Locale }) {
  const router = useRouter()
  const ur = locale === 'ur'
  const c = COPY[locale]
  const [items, setItems] = useState<Item[] | null>(null)
  const [scale, setScale] = useState<ScalePoint[]>([])
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [started, setStarted] = useState(false)
  const [page, setPage] = useState(0)
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved'>('idle')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showBlank, setShowBlank] = useState(false)
  const dirty = useRef<Record<string, number>>({})
  const topRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    void (async () => {
      const res = await fetch('/api/opi')
      const body = await res.json().catch(() => null)
      if (!res.ok) return setError(body?.error?.message ?? 'Could not load the test')
      setItems(body.items)
      setScale(body.scale)
      setAnswers(body.answers)
      const n = Object.keys(body.answers).length
      if (n > 0) {
        setStarted(true)
        // Resume on the first page with a blank.
        const firstBlank = (body.items as Item[]).findIndex((i) => !body.answers[i.id])
        setPage(firstBlank < 0 ? 0 : Math.floor(firstBlank / PAGE_SIZE))
      }
    })()
  }, [])

  const flush = useCallback(async () => {
    const batch = dirty.current
    if (Object.keys(batch).length === 0) return
    dirty.current = {}
    setSaveState('saving')
    const res = await fetch('/api/opi', {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ answers: batch }),
    })
    if (!res.ok) {
      dirty.current = { ...batch, ...dirty.current }
      setSaveState('idle')
      return
    }
    setSaveState('saved')
  }, [])

  // Debounced autosave: each change resets the timer; one PUT carries the batch.
  useEffect(() => {
    if (Object.keys(dirty.current).length === 0) return
    const t = setTimeout(() => void flush(), 800)
    return () => clearTimeout(t)
  }, [answers, flush])

  if (error) return <p className="text-flare-600">{error}</p>
  if (!items) return <p className="text-ink-muted">Loading…</p>

  const total = items.length
  const answeredCount = items.filter((i) => answers[i.id]).length
  const pages = Math.ceil(total / PAGE_SIZE)
  const pageItems = items.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
  const pageDone = pageItems.every((i) => answers[i.id])

  function choose(id: string, value: number) {
    setAnswers((a) => ({ ...a, [id]: value }))
    dirty.current[id] = value
    setSaveState('idle')
  }

  function go(to: number) {
    setShowBlank(false)
    setPage(to)
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  async function finish() {
    if (answeredCount < total) {
      setShowBlank(true)
      const firstBlank = items!.findIndex((i) => !answers[i.id])
      go(Math.floor(firstBlank / PAGE_SIZE))
      return
    }
    setSubmitting(true)
    await flush()
    const res = await fetch('/api/opi/submit', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ answers }),
    })
    const body = await res.json().catch(() => null)
    if (!res.ok) {
      setSubmitting(false)
      return setError(body?.error?.message ?? 'Could not submit')
    }
    router.push(`/opi/result/${body.id}`)
  }

  async function restart() {
    if (!window.confirm(ur ? 'تمام جوابات مٹا دیں؟' : 'Clear all your answers and start again?'))
      return
    await fetch('/api/opi', { method: 'DELETE' })
    dirty.current = {}
    setAnswers({})
    setPage(0)
    setStarted(false)
  }

  if (!started) {
    return (
      <div className="flex flex-col gap-4 rounded-card border border-line bg-surface p-6 shadow-card">
        <p className="max-w-prose text-ink" dir={ur ? 'rtl' : 'ltr'}>
          {c.intro}
        </p>
        <p className="text-sm text-ink-muted">
          {total} statements · about 10 minutes · saved as you go
        </p>
        <Button className="w-fit" onClick={() => setStarted(true)}>
          {c.start}
        </Button>
      </div>
    )
  }

  return (
    <div ref={topRef} className="flex scroll-mt-4 flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-sm text-ink-muted">
          <span className="tabular-nums">{c.answered(answeredCount, total)}</span>
          <span aria-live="polite">
            {saveState === 'saving' ? c.saving : saveState === 'saved' ? c.saved : ''}
          </span>
        </div>
        <Progress value={(answeredCount / total) * 100} label={c.answered(answeredCount, total)} />
      </div>

      <ol className="flex flex-col gap-4" start={page * PAGE_SIZE + 1}>
        {pageItems.map((item, i) => {
          const selected = answers[item.id]
          const missing = showBlank && !selected
          return (
            <li
              key={item.id}
              className={`rounded-card border bg-surface p-5 shadow-card ${
                missing ? 'border-flare-500' : 'border-line'
              }`}
            >
              <fieldset>
                <legend
                  className="w-full text-center font-medium text-ink"
                  dir={ur ? 'rtl' : 'ltr'}
                >
                  <span className="me-2 text-ink-muted tabular-nums">
                    {page * PAGE_SIZE + i + 1}.
                  </span>
                  {ur ? item.textUr : item.textEn}
                </legend>
                {ur && <p className="mt-1 text-center text-xs text-ink-muted">{item.textEn}</p>}
                <div dir="ltr" className="mt-4 flex items-center justify-center gap-2 sm:gap-4">
                  <span className="hidden w-20 text-end text-sm font-medium text-flare-600 sm:block">
                    {c.disagree}
                  </span>
                  {scale.map((s, k) => (
                    <label
                      key={s.value}
                      className="flex cursor-pointer items-center justify-center"
                    >
                      <input
                        type="radio"
                        name={item.id}
                        value={s.value}
                        checked={selected === s.value}
                        onChange={() => choose(item.id, s.value)}
                        className="peer sr-only"
                      />
                      <span
                        title={ur ? s.ur : s.en}
                        className={`${SIZES[k]} rounded-full border-2 transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-brand-500 peer-focus-visible:ring-offset-2 hover:opacity-80 ${tone(
                          s.value,
                          selected === s.value,
                        )}`}
                      />
                      <span className="sr-only">{ur ? s.ur : s.en}</span>
                    </label>
                  ))}
                  <span className="hidden w-20 text-sm font-medium text-brand-700 sm:block dark:text-brand-300">
                    {c.agree}
                  </span>
                </div>
                <div dir="ltr" className="mt-2 flex justify-between text-xs sm:hidden">
                  <span className="text-flare-600">{c.disagree}</span>
                  <span className="text-brand-700 dark:text-brand-300">{c.agree}</span>
                </div>
              </fieldset>
            </li>
          )
        })}
      </ol>

      {showBlank && !pageDone && (
        <p role="alert" className="text-sm text-flare-600">
          {c.blank}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <Button variant="outline" disabled={page === 0} onClick={() => go(page - 1)}>
          {c.back}
        </Button>
        <span className="text-sm text-ink-muted tabular-nums">
          {page + 1} / {pages}
        </span>
        {page + 1 < pages ? (
          <Button
            onClick={() => (pageDone ? go(page + 1) : setShowBlank(true))}
            className="ms-auto"
          >
            {c.next}
          </Button>
        ) : (
          <Button disabled={submitting} onClick={() => void finish()} className="ms-auto">
            {submitting ? '…' : c.finish}
          </Button>
        )}
      </div>
      <button
        type="button"
        onClick={() => void restart()}
        className="w-fit text-xs text-ink-muted underline hover:text-ink"
      >
        {c.restart}
      </button>
    </div>
  )
}
