'use client'

import { useCallback, useEffect, useState } from 'react'

type Card = {
  id: string
  deck: string
  frontEn: string
  frontUr: string | null
  backEn: string
  backUr: string | null
  isNew: boolean
}

const CACHE_KEY = 'issb_flashcards_cache'

/** Decks the topic libraries generate into, plus everything. */
const DECKS = [
  { value: '', label: 'All decks' },
  { value: 'General knowledge', label: 'General knowledge' },
  { value: 'Current affairs', label: 'Current affairs' },
] as const

export function FlashcardReview() {
  const [deck, setDeck] = useState('')
  const [cards, setCards] = useState<Card[]>([])
  const [i, setI] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [loading, setLoading] = useState(true)
  const [offline, setOffline] = useState(false)

  const load = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/gk/flashcards${deck ? `?deck=${encodeURIComponent(deck)}` : ''}`,
      )
      if (!res.ok) throw new Error('offline')
      const data = await res.json()
      setCards(data.cards)
      setI(0)
      setFlipped(false)
      // Cache for offline use (build prompt: offline-friendly flashcards).
      localStorage.setItem(CACHE_KEY, JSON.stringify(data.cards))
      setOffline(false)
    } catch {
      const cached = localStorage.getItem(CACHE_KEY)
      if (cached) {
        setCards(JSON.parse(cached))
        setOffline(true)
      }
    } finally {
      setLoading(false)
    }
  }, [deck])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load()
  }, [load])

  async function grade(quality: number) {
    const card = cards[i]
    if (!card) return
    if (!offline) {
      await fetch('/api/gk/flashcards/review', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ cardId: card.id, quality }),
      }).catch(() => {})
    }
    setFlipped(false)
    setI((n) => n + 1)
  }

  const deckPicker = (
    <div className="inline-flex rounded-pill bg-sunk p-0.5">
      {DECKS.map((d) => (
        <button
          key={d.value}
          type="button"
          onClick={() => setDeck(d.value)}
          aria-pressed={deck === d.value}
          className={`rounded-pill px-3.5 py-1.5 text-sm font-medium transition-colors ${
            deck === d.value ? 'bg-surface text-ink shadow-card' : 'text-ink-muted hover:text-ink'
          }`}
        >
          {d.label}
        </button>
      ))}
    </div>
  )

  if (loading) return <p className="text-ink-muted">Loading cards…</p>
  if (cards.length === 0)
    return (
      <div className="flex flex-col items-center gap-5">
        {deckPicker}
        <p className="text-ink-muted">
          Nothing due in this deck. Topics you have not seen yet appear here as new cards.
        </p>
      </div>
    )
  if (i >= cards.length)
    return (
      <div className="flex flex-col items-center gap-5">
        {deckPicker}
        <p className="font-medium text-brand-700 dark:text-brand-300">
          Deck finished. Come back when the next cards fall due.
        </p>
      </div>
    )

  const card = cards[i]!
  return (
    <div className="flex flex-col items-center gap-6">
      {deckPicker}
      {offline && <p className="text-xs text-brass-600">Offline — reviews will not be saved.</p>}
      <div className="flex w-full max-w-md flex-col gap-2">
        <div className="flex items-center justify-between text-sm text-ink-muted">
          <span>
            {i + 1} of {cards.length} · {card.deck}
          </span>
          {card.isNew && <span className="text-brass-600">New card</span>}
        </div>
        <div className="h-1 w-full overflow-hidden rounded-pill bg-sunk">
          <div
            className="h-full origin-left rounded-pill bg-brand-600 transition-[width] duration-500 ease-out"
            style={{ width: `${Math.round((i / cards.length) * 100)}%` }}
          />
        </div>
      </div>
      {/* Both faces are always rendered, stacked; the card rotates between
          them so the answer turns into view instead of replacing the question. */}
      <div className="flip-scene w-full max-w-md">
        <button
          onClick={() => setFlipped((f) => !f)}
          data-flipped={flipped}
          aria-label={flipped ? 'Show the question' : 'Reveal the answer'}
          className="flip-card relative grid min-h-52 w-full text-center"
        >
          <span className="flip-face col-start-1 row-start-1 flex flex-col items-center justify-center gap-2 rounded-panel border border-line bg-surface p-8 shadow-card">
            <span className="text-lg text-ink">{card.frontEn}</span>
            {card.frontUr && (
              <span dir="rtl" className="text-ink-muted">
                {card.frontUr}
              </span>
            )}
            <span className="mt-3 text-xs text-ink-muted">Tap to reveal</span>
          </span>
          <span className="flip-face flip-face-back col-start-1 row-start-1 flex flex-col items-center justify-center gap-2 rounded-panel border border-brand-700 bg-brand-800 p-8 text-brand-50 shadow-raised">
            <span className="font-display text-xl font-semibold text-white">{card.backEn}</span>
            {card.backUr && (
              <span dir="rtl" className="text-brand-100">
                {card.backUr}
              </span>
            )}
            <span className="mt-3 text-xs text-brand-200">How did you do?</span>
          </span>
        </button>
      </div>
      {flipped && (
        <div className="flex flex-wrap justify-center gap-2">
          {[
            {
              q: 0,
              label: 'Again',
              hint: 'Did not know it',
              cls: 'bg-flare-500 hover:bg-flare-600 text-white',
            },
            {
              q: 3,
              label: 'Hard',
              hint: 'Recalled with effort',
              cls: 'bg-brass-500 hover:bg-brass-400 text-brand-950',
            },
            {
              q: 4,
              label: 'Good',
              hint: 'Recalled it',
              cls: 'bg-brand-600 hover:bg-brand-700 text-white',
            },
            {
              q: 5,
              label: 'Easy',
              hint: 'Instant',
              cls: 'bg-brand-500 hover:bg-brand-400 text-white',
            },
          ].map((b) => (
            <button
              key={b.q}
              onClick={() => grade(b.q)}
              title={b.hint}
              className={`rounded-pill px-5 py-2.5 text-sm font-medium transition-colors ${b.cls}`}
            >
              {b.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
