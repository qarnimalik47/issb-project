import { useEffect } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import NetInfo from '@react-native-community/netinfo'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import type { RootStackParamList } from '../../App'
import { api } from '../api/client'
import { flushQueue, type QueuedSubmission } from '../storage'
import { registerForPush, scheduleDailyReminder } from '../push'

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>

const TILES: { label: string; screen: keyof RootStackParamList }[] = [
  { label: 'Practice tests', screen: 'Practice' },
  { label: 'Flashcards', screen: 'Flashcards' },
  { label: 'Daily digest', screen: 'Digest' },
  { label: 'Profile', screen: 'Profile' },
]

export function HomeScreen({ navigation }: Props) {
  useEffect(() => {
    // Register push + set up a daily reminder (best effort).
    void registerForPush().then((t) => t && scheduleDailyReminder())

    // When connectivity returns, flush queued test submissions.
    const unsub = NetInfo.addEventListener((state) => {
      if (state.isConnected) {
        void flushQueue(async (s: QueuedSubmission) => {
          await api(s.path, { method: s.method, body: JSON.stringify(s.body) })
          return true
        })
      }
    })
    return () => unsub()
  }, [])

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {TILES.map((t) => (
        <TouchableOpacity key={t.screen} style={styles.tile} onPress={() => navigation.navigate(t.screen)}>
          <Text style={styles.tileText}>{t.label}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 12 },
  tile: { borderWidth: 1, borderColor: '#ddd', borderRadius: 12, padding: 20 },
  tileText: { fontSize: 18, fontWeight: '500' },
})
