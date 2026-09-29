import { describe, it, expect } from 'vitest'
import { OPI_ITEMS, OPI_PAIRS, OPI_ITEM_BY_ID, type Trait } from '../../src/lib/opi/items'
import { scoreOpi, describeResult, missingItems } from '../../src/lib/opi/score'
import { TYPE_PROFILES } from '../../src/lib/opi/profiles'

/**
 * Answer as a person with the given trait levels (1..7 on the trait), keeping
 * the candour items honest unless told otherwise.
 */
function answersFor(levels: Record<Trait, number>, candour: 'honest' | 'fake' = 'honest') {
  const out: Record<string, number> = {}
  for (const item of OPI_ITEMS) {
    if (item.trait === 'K') {
      const idealised = candour === 'fake' ? 7 : 2
      out[item.id] = item.key === 1 ? idealised : 8 - idealised
    } else {
      const level = levels[item.trait]
      out[item.id] = item.key === 1 ? level : 8 - level
    }
  }
  return out
}

describe('OPI item bank', () => {
  it('has 50 trait items (10 per trait) and 8 candour items, all with Urdu', () => {
    expect(OPI_ITEMS).toHaveLength(58)
    for (const t of ['E', 'A', 'C', 'S', 'O', 'K']) {
      const n = OPI_ITEMS.filter((i) => i.trait === t).length
      expect(n).toBe(t === 'K' ? 8 : 10)
    }
    expect(new Set(OPI_ITEMS.map((i) => i.id)).size).toBe(58)
    for (const i of OPI_ITEMS) expect(i.textUr.trim().length).toBeGreaterThan(5)
  })

  it('pairs opposite-keyed statements of the same trait', () => {
    for (const [a, b] of OPI_PAIRS) {
      const ia = OPI_ITEM_BY_ID.get(a)!
      const ib = OPI_ITEM_BY_ID.get(b)!
      expect(ia.trait).toBe(ib.trait)
      expect(ia.key).toBe(-ib.key as 1 | -1)
    }
  })

  it('never shows two candour items back to back', () => {
    for (let i = 1; i < OPI_ITEMS.length; i++) {
      expect(OPI_ITEMS[i]!.trait === 'K' && OPI_ITEMS[i - 1]!.trait === 'K').toBe(false)
    }
  })

  it('has a profile for all sixteen codes', () => {
    const codes = ['E', 'I'].flatMap((a) =>
      ['N', 'S'].flatMap((b) => ['F', 'T'].flatMap((c) => ['J', 'P'].map((d) => a + b + c + d))),
    )
    for (const c of codes) expect(TYPE_PROFILES[c]?.name).toBeTruthy()
  })
})

describe('scoreOpi', () => {
  it('turns a consistent, honest profile into the matching type', () => {
    const r = scoreOpi(answersFor({ E: 6, A: 3, C: 6, S: 6, O: 6 }), 600)
    expect(r.code).toBe('ENTJ')
    expect(r.variant).toBe('Steady')
    expect(r.traits.E).toBe(83)
    expect(r.traits.A).toBe(33)
    expect(r.consistency).toBe(1)
    expect(r.flags).toEqual([])
    expect(describeResult(r).reliability).toBe('good')
  })

  it('reads low trait levels as the opposite letters and the Reactive variant', () => {
    const r = scoreOpi(answersFor({ E: 2, A: 6, C: 2, S: 2, O: 2 }), 600)
    expect(r.code).toBe('ISFP')
    expect(r.variant).toBe('Reactive')
  })

  it('flags idealised candour answers as faking good', () => {
    const r = scoreOpi(answersFor({ E: 5, A: 5, C: 5, S: 5, O: 5 }, 'fake'), 600)
    expect(r.candour).toBe(100)
    expect(r.flags.join(' ')).toMatch(/faking good/i)
    expect(describeResult(r).reliability).toBe('poor')
  })

  it('flags straight-lining and rushing', () => {
    const all7 = Object.fromEntries(OPI_ITEMS.map((i) => [i.id, 7]))
    const r = scoreOpi(all7, 30)
    expect(r.consistency).toBeLessThan(0.6)
    const text = r.flags.join(' ')
    expect(text).toMatch(/same answer/i)
    expect(text).toMatch(/very fast/i)
  })

  it('flags heavy fence-sitting', () => {
    const r = scoreOpi(answersFor({ E: 4, A: 4, C: 4, S: 4, O: 4 }), 600)
    expect(r.flags.join(' ')).toMatch(/neutral/i)
  })

  it('reports unanswered statements and ignores out-of-range values', () => {
    const answers = answersFor({ E: 5, A: 5, C: 5, S: 5, O: 5 })
    delete answers.e1
    answers.a1 = 9
    expect(missingItems(answers).sort()).toEqual(['a1', 'e1'])
  })

  it('weights OLQ factors from the traits', () => {
    const r = scoreOpi(answersFor({ E: 7, A: 7, C: 7, S: 7, O: 7 }), 600)
    for (const v of Object.values(r.olq)) expect(v).toBe(100)
  })
})
