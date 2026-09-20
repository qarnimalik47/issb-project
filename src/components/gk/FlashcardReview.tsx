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
      <p className="text-sm text-ink-muted">
        {i + 1} / {cards.length} · {card.deck} {card.isNew && '· new'}
      </p>
      <button
        onClick={() => setFlipped((f) => !f)}
        className="min-h-40 w-full max-w-md rounded-xl border border-line p-8 text-center text-lg"
      >
        {!flipped ? (
          <>
            <div>{card.frontEn}</div>
            {card.frontUr && (
              <div dir="rtl" className="mt-2 text-ink-muted">
                {card.frontUr}
              </div>
            )}
            <div className="mt-4 text-xs text-ink-muted">tap to reveal</div>
          </>
        ) : (
          <>
            <div className="font-semibold">{card.backEn}</div>
            {card.backUr && (
              <div dir="rtl" className="mt-2 text-ink-muted">
                {card.backUr}
              </div>
            )}
          </>
        )}
      </button>
      {flipped && (
        <div className="flex flex-wrap justify-center gap-2">
          {[
            { q: 0, label: 'Again', cls: 'bg-red-600' },
            { q: 3, label: 'Hard', cls: 'bg-amber-600' },
            { q: 4, label: 'Good', cls: 'bg-blue-600' },
            { q: 5, label: 'Easy', cls: 'bg-green-600' },
          ].map((b) => (
            <button
              key={b.q}
              onClick={() => grade(b.q)}
              className={`rounded px-4 py-2 text-sm text-white ${b.cls}`}
            >
              {b.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
