import { useEffect, useState } from 'react'
import { View, Text, FlatList, StyleSheet } from 'react-native'
import { api } from '../api/client'
import { cacheGet, cacheSet } from '../storage'
import type { DigestItem } from '../api/types'

export function DigestScreen() {
  const [items, setItems] = useState<DigestItem[]>([])
  const [offline, setOffline] = useState(false)

  useEffect(() => {
    ;(async () => {
      try {
        const data = await api<{ items: DigestItem[] }>('/api/gk/digest')
        setItems(data.items)
        await cacheSet('digest', data.items)
      } catch {
        const cached = await cacheGet<DigestItem[]>('digest')
        if (cached) {
          setItems(cached)
          setOffline(true)
        }
      }
    })()
  }, [])

  return (
    <View style={{ flex: 1 }}>
      {offline ? <Text style={styles.offline}>Offline — showing saved digest.</Text> : null}
      <FlatList
        data={items}
        keyExtractor={(a) => a.id}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.headline}>{item.headline}</Text>
            <Text style={styles.summary}>{item.summaryEn}</Text>
            {item.issbAngle ? <Text style={styles.angle}>ISSB angle: {item.issbAngle}</Text> : null}
            <Text style={styles.meta}>
              {item.category}
              {item.sourceName ? ` · ${item.sourceName}` : ''}
            </Text>
          </View>
        )}
        ListEmptyComponent={<Text style={{ padding: 16 }}>No items yet.</Text>}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  offline: { color: '#b45309', padding: 8, textAlign: 'center' },
  card: { borderWidth: 1, borderColor: '#ddd', borderRadius: 12, padding: 16 },
  headline: { fontWeight: '600', fontSize: 16 },
  summary: { color: '#444', marginTop: 4 },
  angle: { color: '#1d4ed8', marginTop: 6 },
  meta: { color: '#999', fontSize: 12, marginTop: 6 },
})
