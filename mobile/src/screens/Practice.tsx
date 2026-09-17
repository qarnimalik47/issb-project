import { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native'
import NetInfo from '@react-native-community/netinfo'
import { api } from '../api/client'
import { queueSubmission } from '../storage'
import type { PlayerAttempt, AttemptResult } from '../api/types'

type TestType = { id: string; nameEn: string; publishedQuestions: number }

export function PracticeScreen() {
  const [types, setTypes] = useState<TestType[]>([])
  const [attempt, setAttempt] = useState<PlayerAttempt | null>(null)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [result, setResult] = useState<AttemptResult | null>(null)
  const [queued, setQueued] = useState(false)

  useEffect(() => {
    api<{ testTypes: (TestType & { scoringType: string })[] }>('/api/catalog/test-types')
      .then((d) => setTypes(d.testTypes.filter((t) => (t as { scoringType: string }).scoringType === 'objective' && t.publishedQuestions > 0)))
      .catch(() => {})
  }, [])

  async function start(testTypeId: string) {
    const d = await api<{ attempt: PlayerAttempt }>('/api/attempts', { method: 'POST', body: JSON.stringify({ testTypeId }) })
    setAttempt(d.attempt)
    setAnswers(d.attempt.answers ?? {})
    setResult(null)
  }

  async function submit() {
    if (!attempt) return
    const online = (await NetInfo.fetch()).isConnected
    if (!online) {
      // Never lose data on a weak connection — queue and sync later.
      await queueSubmission({ path: `/api/attempts/${attempt.id}/submit`, method: 'POST', body: { answers } })
      setQueued(true)
      return
    }
    const d = await api<{ result: AttemptResult }>(`/api/attempts/${attempt.id}/submit`, { method: 'POST', body: JSON.stringify({ answers }) })
    setResult(d.result)
  }

  if (result) {
    return (
      <View style={styles.center}>
        <Text style={styles.score}>
          {result.score} / {result.maxScore} ({result.percentage}%)
        </Text>
        {result.weakTopics.length > 0 ? <Text style={styles.weak}>Weak: {result.weakTopics.join(', ')}</Text> : null}
        <TouchableOpacity style={styles.btn} onPress={() => setAttempt(null)}>
          <Text style={styles.btnText}>Back to tests</Text>
        </TouchableOpacity>
      </View>
    )
  }

  if (queued) {
    return (
      <View style={styles.center}>
        <Text>Saved offline. It will submit automatically when you reconnect.</Text>
      </View>
    )
  }

  if (attempt) {
    return (
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        {attempt.questions.map((q, i) => (
          <View key={q.id} style={styles.card}>
            <Text style={styles.stem}>
              {i + 1}. {q.stemEn}
            </Text>
            {q.options?.map((o) => (
              <TouchableOpacity
                key={o.key}
                style={[styles.option, answers[q.id] === o.key && styles.optionSel]}
                onPress={() => setAnswers((a) => ({ ...a, [q.id]: o.key }))}
              >
                <Text>
                  {o.key}. {o.textEn}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
        <TouchableOpacity style={styles.submit} onPress={submit}>
          <Text style={styles.btnText}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>
    )
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      {types.map((t) => (
        <TouchableOpacity key={t.id} style={styles.card} onPress={() => start(t.id)}>
          <Text style={styles.stem}>{t.nameEn}</Text>
          <Text style={styles.meta}>{t.publishedQuestions} questions</Text>
        </TouchableOpacity>
      ))}
      {types.length === 0 ? <Text>No objective tests available.</Text> : null}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 16 },
  score: { fontSize: 28, fontWeight: '600' },
  weak: { color: '#b45309' },
  card: { borderWidth: 1, borderColor: '#ddd', borderRadius: 12, padding: 16, gap: 8 },
  stem: { fontWeight: '600' },
  meta: { color: '#888' },
  option: { borderWidth: 1, borderColor: '#eee', borderRadius: 8, padding: 10 },
  optionSel: { borderColor: '#111', backgroundColor: '#f2f2f2' },
  submit: { backgroundColor: '#16a34a', borderRadius: 8, padding: 14, alignItems: 'center' },
  btn: { backgroundColor: '#111', borderRadius: 8, padding: 12, paddingHorizontal: 20 },
  btnText: { color: '#fff', fontWeight: '600' },
})
