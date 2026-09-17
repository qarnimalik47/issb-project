/**
 * Deterministic, server-side MCQ scoring (rule 1.5: objective tests are scored
 * exactly correctly, server-side; the client never sees the answer key before
 * submission). Kept pure so it can be exhaustively unit-tested.
 */
export type ScoringQuestion = {
  id: string
  correctOption: string | null
  topic?: string | null
}

export type PerQuestionResult = {
  questionId: string
  selected: string | null
  correctOption: string | null
  correct: boolean
}

export type TopicBreakdown = Record<string, { correct: number; total: number }>

export type ScoreResult = {
  score: number
  maxScore: number
  percentage: number
  perQuestion: PerQuestionResult[]
  byTopic: TopicBreakdown
}

/**
 * Score answers against questions. Answers is a map of questionId → selected
 * option. Unanswered or unknown answers count as incorrect. Only questions in
 * the provided list are scored (the server's fixed set), so a client cannot
 * inject extra questions or answers.
 */
export function scoreMcq(
  questions: ScoringQuestion[],
  answers: Record<string, string | null | undefined>,
): ScoreResult {
  const perQuestion: PerQuestionResult[] = []
  const byTopic: TopicBreakdown = {}
  let score = 0

  for (const q of questions) {
    const selectedRaw = answers[q.id]
    const selected = selectedRaw == null || selectedRaw === '' ? null : String(selectedRaw)
    const correct = q.correctOption != null && selected != null && selected === q.correctOption
    if (correct) score++

    perQuestion.push({
      questionId: q.id,
      selected,
      correctOption: q.correctOption,
      correct,
    })

    const topic = q.topic?.trim() || 'general'
    const bucket = (byTopic[topic] ??= { correct: 0, total: 0 })
    bucket.total++
    if (correct) bucket.correct++
  }

  const maxScore = questions.length
  const percentage = maxScore === 0 ? 0 : Math.round((score / maxScore) * 100)
  return { score, maxScore, percentage, perQuestion, byTopic }
}

/** Identify weak topics (accuracy below a threshold, with at least `minItems`). */
export function weakTopics(byTopic: TopicBreakdown, threshold = 0.6, minItems = 2): string[] {
  return Object.entries(byTopic)
    .filter(([, b]) => b.total >= minItems && b.correct / b.total < threshold)
    .map(([topic]) => topic)
}
