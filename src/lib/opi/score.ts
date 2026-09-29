/**
 * Score an OPI sitting. Pure: answers in, report out, so it is unit-tested
 * without a database and the stored result can always be recomputed.
 */
import { analyzeOpi, type OpiResponse } from '../profile/opi'
import { OPI_ITEMS, OPI_ITEM_BY_ID, OPI_PAIRS, OPI_VERSION, type Trait } from './items'
import { OLQ_FACTORS, TRAITS, TYPE_PROFILES } from './profiles'

export type OpiAnswers = Record<string, number>

export type OpiResult = {
  version: string
  /** 0–100 per trait; 50 is the scale midpoint, not a population average. */
  traits: Record<Trait, number>
  /** Four-letter code, e.g. "ENTJ". */
  code: string
  /** Emotional-stability variant. */
  variant: 'Steady' | 'Reactive'
  /** 0–100 per officer-like-quality factor. */
  olq: Record<string, number>
  /** 0–1: agreement between statements that ask the same thing. */
  consistency: number
  /** 0–100: how idealised the candour answers were. High = impression management. */
  candour: number
  flags: string[]
  answered: number
  durationSeconds: number | null
}

const TRAIT_KEYS: Trait[] = ['E', 'A', 'C', 'S', 'O']

/** Map a 1–7 answer onto the item's scoring direction. */
function keyed(value: number, key: 1 | -1) {
  return key === 1 ? value : 8 - value
}

function toPercent(mean: number) {
  return Math.round(((mean - 1) / 6) * 100)
}

export function missingItems(answers: OpiAnswers): string[] {
  return OPI_ITEMS.filter((i) => !isValidAnswer(answers[i.id])).map((i) => i.id)
}

export function isValidAnswer(v: unknown): v is number {
  return typeof v === 'number' && Number.isInteger(v) && v >= 1 && v <= 7
}

export function scoreOpi(answers: OpiAnswers, durationSeconds: number | null = null): OpiResult {
  const flags: string[] = []

  const sums = Object.fromEntries(TRAIT_KEYS.map((t) => [t, { total: 0, n: 0 }])) as Record<
    Trait,
    { total: number; n: number }
  >
  const candourVals: number[] = []
  for (const item of OPI_ITEMS) {
    const v = answers[item.id]
    if (!isValidAnswer(v)) continue
    if (item.trait === 'K') candourVals.push(keyed(v, item.key))
    else {
      sums[item.trait].total += keyed(v, item.key)
      sums[item.trait].n += 1
    }
  }
  const traits = Object.fromEntries(
    TRAIT_KEYS.map((t) => [t, sums[t].n ? toPercent(sums[t].total / sums[t].n) : 50]),
  ) as Record<Trait, number>

  const code =
    (traits.E >= 50 ? 'E' : 'I') +
    (traits.O >= 50 ? 'N' : 'S') +
    (traits.A >= 50 ? 'F' : 'T') +
    (traits.C >= 50 ? 'J' : 'P')
  const variant = traits.S >= 50 ? 'Steady' : 'Reactive'

  const olq = Object.fromEntries(
    OLQ_FACTORS.map((f) => {
      const entries = Object.entries(f.weights) as [Trait, number][]
      const weight = entries.reduce((s, [, w]) => s + w, 0)
      return [f.key, Math.round(entries.reduce((s, [t, w]) => s + traits[t] * w, 0) / weight)]
    }),
  )

  // Consistency: the existing pair analysis, fed the reverse-keyed flag per item.
  const responses: OpiResponse[] = []
  OPI_PAIRS.forEach(([a, b], i) => {
    for (const id of [a, b]) {
      const v = answers[id]
      const item = OPI_ITEM_BY_ID.get(id)
      if (item && isValidAnswer(v)) {
        responses.push({ itemId: id, value: v, pairId: `p${i}`, reversed: item.key === -1 })
      }
    }
  })
  // Faking-good: candour answers already keyed so 7 = most idealised.
  for (const item of OPI_ITEMS.filter((i) => i.trait === 'K')) {
    const v = answers[item.id]
    if (isValidAnswer(v)) {
      responses.push({ itemId: item.id, value: keyed(v, item.key), sociallyDesirable: true })
    }
  }
  const analysis = analyzeOpi(responses)
  flags.push(...analysis.flags)

  const candour = candourVals.length
    ? toPercent(candourVals.reduce((s, v) => s + v, 0) / candourVals.length)
    : 0
  if (candour >= 70 && !flags.some((f) => f.includes('faking'))) {
    flags.push('Your answers describe an unusually flawless person. Answer as you really are.')
  }

  // Straight-lining: the same answer to almost everything says nothing about you.
  const values = OPI_ITEMS.map((i) => answers[i.id]).filter(isValidAnswer)
  const counts = new Map<number, number>()
  for (const v of values) counts.set(v, (counts.get(v) ?? 0) + 1)
  const top = Math.max(0, ...counts.values())
  if (values.length > 0 && top / values.length > 0.6) {
    flags.push('Most statements got the same answer. Read each one and respond to it on its own.')
  }
  const neutral = counts.get(4) ?? 0
  if (values.length > 0 && neutral / values.length > 0.35) {
    flags.push('Many "Neutral" answers. The board reads frequent fence-sitting as indecision.')
  }
  if (durationSeconds != null && values.length > 0 && durationSeconds / values.length < 2) {
    flags.push('Answered very fast. Take the few seconds each statement needs.')
  }

  return {
    version: OPI_VERSION,
    traits,
    code,
    variant,
    olq,
    consistency: analysis.consistency,
    candour,
    flags,
    answered: values.length,
    durationSeconds,
  }
}

/** Everything the report page needs to describe a result. */
export function describeResult(result: OpiResult) {
  const profile = TYPE_PROFILES[result.code] ?? TYPE_PROFILES.ISTJ!
  const traits = TRAIT_KEYS.map((t) => {
    const info = TRAITS[t]
    const score = result.traits[t]
    return {
      key: t,
      ...info,
      score,
      band: score >= 60 ? 'high' : score <= 40 ? 'low' : 'mid',
      text: score >= 60 ? info.describeHigh : score <= 40 ? info.describeLow : info.describeMid,
    }
  })
  const olq = OLQ_FACTORS.map((f) => ({ ...f, score: result.olq[f.key] ?? 0 }))
  const reliability =
    result.consistency >= 0.75 && result.candour < 70
      ? 'good'
      : result.consistency >= 0.6 && result.candour < 80
        ? 'fair'
        : 'poor'
  return { profile, traits, olq, reliability }
}
