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

export function FlashcardReview() {
  const [cards, setCards] = useState<Card[]>([])
  const [i, setI] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [loading, setLoading] = useState(true)
  const [offline, setOffline] = useState(false)

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/gk/flashcards')
      if (!res.ok) throw new Error('offline')
      const data = await res.json()
      setCards(data.cards)
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
  }, [])

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

  if (loading) return <p className="text-neutral-500">Loading cards…</p>
  if (cards.length === 0) return <p className="text-neutral-500">No cards due. Come back later.</p>
  if (i >= cards.length) return <p className="text-green-600">All caught up! ✓</p>

  const card = cards[i]!
  return (
    <div className="flex flex-col items-center gap-6">
      {offline && <p className="text-xs text-amber-600">Offline — reviews will not be saved.</p>}
      <p className="text-sm text-neutral-500">
        {i + 1} / {cards.length} · {card.deck} {card.isNew && '· new'}
      </p>
      <button
        onClick={() => setFlipped((f) => !f)}
        className="min-h-40 w-full max-w-md rounded-xl border border-neutral-200 p-8 text-center text-lg dark:border-neutral-800"
      >
        {!flipped ? (
          <>
            <div>{card.frontEn}</div>
            {card.frontUr && (
              <div dir="rtl" className="mt-2 text-neutral-500">
                {card.frontUr}
              </div>
            )}
            <div className="mt-4 text-xs text-neutral-400">tap to reveal</div>
          </>
        ) : (
          <>
            <div className="font-semibold">{card.backEn}</div>
            {card.backUr && (
              <div dir="rtl" className="mt-2 text-neutral-500">
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
