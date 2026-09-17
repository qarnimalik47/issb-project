import { describe, it, expect } from 'vitest'
import { analyzeOpi } from '../../src/lib/profile/opi'

describe('analyzeOpi', () => {
  it('scores consistent paired answers highly', () => {
    const r = analyzeOpi([
      { itemId: 'a', value: 6, pairId: 'p1' },
      { itemId: 'b', value: 2, pairId: 'p1', reversed: true }, // 8-2=6 → matches
    ])
    expect(r.consistency).toBeGreaterThanOrEqual(0.9)
    expect(r.flags).toHaveLength(0)
  })

  it('flags inconsistent paired answers', () => {
    const r = analyzeOpi([
      { itemId: 'a', value: 7, pairId: 'p1' },
      { itemId: 'b', value: 7, pairId: 'p1', reversed: true }, // 8-7=1 → far from 7
    ])
    expect(r.consistency).toBeLessThan(0.6)
    expect(r.flags.join(' ')).toMatch(/consistency/i)
  })

  it('flags faking-good on idealised responses', () => {
    const r = analyzeOpi([
      { itemId: 's1', value: 7, sociallyDesirable: true },
      { itemId: 's2', value: 7, sociallyDesirable: true },
      { itemId: 's3', value: 6, sociallyDesirable: true },
    ])
    expect(r.fakingGood).toBeGreaterThan(0.7)
    expect(r.flags.join(' ')).toMatch(/faking good/i)
  })
})
