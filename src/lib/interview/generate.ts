/**
 * Deterministic mock-interview question generation from the user's OWN PIQ
 * (build prompt §7). Produces tailored questions plus cross-questioning
 * follow-ups. When a real AI provider is configured, this can be swapped for
 * model-generated questions behind the same signature; the deterministic
 * generator keeps the feature working and testable without keys.
 */
import type { Piq } from './piq'

export type InterviewQuestion = { ref: string; question: string }

const TRACK_LABEL: Record<string, string> = {
  pma: 'PMA Long Course',
  gdp: 'GD Pilot',
  navy: 'Navy',
  lcc: 'Lady Cadet Course',
  technical: 'Technical branch',
  other: 'the armed forces',
}

export function generateInterviewQuestions(piq: Piq, track: string | null): InterviewQuestion[] {
  const qs: string[] = []

  qs.push('Tell me about yourself in two minutes.')
  if (piq.education)
    qs.push(`You studied ${piq.education}. Why did you choose that, and how did you perform?`)

  for (const hobby of piq.hobbies.slice(0, 2)) {
    qs.push(`You listed "${hobby}" as a hobby. What have you genuinely learned from it?`)
  }
  for (const sport of piq.gamesAndSports.slice(0, 1)) {
    qs.push(`You play ${sport}. Describe a moment it tested your temperament, and what you did.`)
  }
  if (piq.positionsOfResponsibility) {
    qs.push(
      'Describe a time in a position of responsibility when a decision of yours was unpopular. What happened?',
    )
  }
  if (piq.strengths)
    qs.push(
      `You said a strength of yours is "${piq.strengths}". Give a concrete example that proves it.`,
    )
  if (piq.weaknesses)
    qs.push(`You mentioned "${piq.weaknesses}" as a weakness. What are you doing about it?`)
  qs.push(
    `Why do you want to join ${TRACK_LABEL[track ?? 'other'] ?? 'the armed forces'} specifically?`,
  )
  qs.push('If you are not selected this time, what will you do?')

  // Cross-questioning follow-up.
  qs.push(
    'You gave an example earlier — if I spoke to someone who was there, would they describe it the same way? Why?',
  )

  return qs.slice(0, 10).map((question, i) => ({ ref: String(i), question }))
}
