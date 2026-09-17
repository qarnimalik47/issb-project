/**
 * OPI (150-statement, 7-point agree/disagree) consistency & faking-good
 * analysis. Pure and unit-testable. OPI capture uses the objective engine with
 * scoringType 'consistency'; this analyses the collected responses.
 *
 *  - consistency: agreement between paired items measuring the same trait (one
 *    reverse-keyed). 1 = perfectly consistent.
 *  - fakingGood: proportion of extreme socially-desirable answers — a high value
 *    suggests impression management ("faking good"), which the board penalises.
 */
export type OpiResponse = {
  itemId: string
  value: number // 1..7
  pairId?: string
  reversed?: boolean
  sociallyDesirable?: boolean // extreme-agree on this item reads as faking-good
}

export type OpiAnalysis = {
  consistency: number
  fakingGood: number
  flags: string[]
}

export function analyzeOpi(responses: OpiResponse[]): OpiAnalysis {
  const flags: string[] = []

  // Consistency across paired items.
  const pairs = new Map<string, OpiResponse[]>()
  for (const r of responses) {
    if (r.pairId) {
      const list = pairs.get(r.pairId) ?? []
      list.push(r)
      pairs.set(r.pairId, list)
    }
  }
  let pairScoreSum = 0
  let pairCount = 0
  for (const list of pairs.values()) {
    if (list.length !== 2) continue
    const [a, b] = list as [OpiResponse, OpiResponse]
    // Normalise reverse-keyed item onto the same scale.
    const bVal = b.reversed ? 8 - b.value : b.value
    const aVal = a.reversed ? 8 - a.value : a.value
    const diff = Math.abs(aVal - bVal) // 0..6
    pairScoreSum += 1 - diff / 6
    pairCount += 1
  }
  const consistency = pairCount > 0 ? Number((pairScoreSum / pairCount).toFixed(2)) : 1
  if (pairCount > 0 && consistency < 0.6)
    flags.push('Low internal consistency — answers contradict each other.')

  // Faking-good: extreme agreement on socially-desirable items.
  const sd = responses.filter((r) => r.sociallyDesirable)
  const extreme = sd.filter((r) => r.value >= 6).length
  const fakingGood = sd.length > 0 ? Number((extreme / sd.length).toFixed(2)) : 0
  if (fakingGood > 0.7) flags.push('Possible "faking good" — many idealised responses.')

  return { consistency, fakingGood, flags }
}
