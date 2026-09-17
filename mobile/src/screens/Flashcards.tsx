import { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { api } from '../api/client'
import { cacheGet, cacheSet, queueSubmission } from '../storage'
import type { DueCard } from '../api/types'

export function FlashcardsScreen() {
  const [cards, setCards] = useState<DueCard[]>([])
  const [i, setI] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [offline, setOffline] = useState(false)

  useEffect(() => {
    ;(async () => {
      try {
        const data = await api<{ cards: DueCard[] }>('/api/gk/flashcards')
        setCards(data.cards)
        await cacheSet('flashcards', data.cards)
      } catch {
        const cached = await cacheGet<DueCard[]>('flashcards')
        if (cached) {
          setCards(cached)
          setOffline(true)
        }
      }
    })()
  }, [])

  async function grade(quality: number) {
    const card = cards[i]
    if (card) {
      // Queue the review so it syncs even offline.
      await queueSubmission({ path: '/api/gk/flashcards/review', method: 'POST', body: { cardId: card.id, quality } })
    }
    setFlipped(false)
    setI((n) => n + 1)
  }

  if (cards.length === 0) return <Center text="No cards due." />
  if (i >= cards.length) return <Center text="All caught up! ✓" />

  const card = cards[i]!
  return (
    <View style={styles.container}>
      {offline ? <Text style={styles.offline}>Offline — reviews will sync later.</Text> : null}
      <Text style={styles.meta}>
        {i + 1} / {cards.length} · {card.deck}
      </Text>
      <TouchableOpacity style={styles.card} onPress={() => setFlipped((f) => !f)}>
        <Text style={styles.cardText}>{flipped ? card.backEn : card.frontEn}</Text>
        {flipped && card.backUr ? <Text style={styles.cardUr}>{card.backUr}</Text> : null}
      </TouchableOpacity>
      {flipped ? (
        <View style={styles.row}>
          {[
            { q: 0, label: 'Again' },
            { q: 3, label: 'Hard' },
            { q: 4, label: 'Good' },
            { q: 5, label: 'Easy' },
          ].map((b) => (
            <TouchableOpacity key={b.q} style={styles.gradeBtn} onPress={() => grade(b.q)}>
              <Text style={styles.gradeText}>{b.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <Text style={styles.hint}>Tap the card to reveal</Text>
      )}
    </View>
  )
}

function Center({ text }: { text: string }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>{text}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 16, alignItems: 'center' },
  offline: { color: '#b45309' },
  meta: { color: '#888' },
  card: { minHeight: 160, width: '100%', borderWidth: 1, borderColor: '#ddd', borderRadius: 12, padding: 24, justifyContent: 'center', alignItems: 'center' },
  cardText: { fontSize: 20, textAlign: 'center' },
  cardUr: { fontSize: 16, color: '#666', marginTop: 8 },
  hint: { color: '#aaa' },
  row: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', justifyContent: 'center' },
  gradeBtn: { backgroundColor: '#111', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 16 },
  gradeText: { color: '#fff' },
})
