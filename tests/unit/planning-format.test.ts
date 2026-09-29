import { describe, it, expect } from 'vitest'
import {
  parsePlanning,
  planningExplanation,
  planningStemEn,
  planningStemUr,
} from '../../src/lib/content/planning-format'
import { PLANNING_ITEMS } from '../../src/lib/db/seed-data/gpe-items'

describe('planning format', () => {
  it('round-trips every seeded scenario', () => {
    for (const item of PLANNING_ITEMS) {
      const parsed = parsePlanning({
        stemEn: planningStemEn(item),
        stemUr: planningStemUr(item),
        explanationEn: planningExplanation(item),
      })
      expect(parsed.titleEn).toBe(item.titleEn)
      expect(parsed.narrativeEn).toBe(item.narrativeEn.trim())
      expect(parsed.titleUr).toBe(item.titleUr)
      expect(parsed.narrativeUr).toBe(item.narrativeUr.trim())
      expect(parsed.problems).toEqual(item.problems)
      expect(parsed.modelPlan).toEqual(item.modelPlan)
    }
  })

  it('keeps the seeded stem layout unchanged (so content hashes stay stable)', () => {
    const item = PLANNING_ITEMS[0]!
    expect(
      planningStemEn(item).startsWith(`${item.titleEn}\n\n${item.narrativeEn.trim()}\n\n`),
    ).toBe(true)
  })

  it('folds blank lines inside an admin-written briefing so parsing stays exact', () => {
    const parts = {
      titleEn: 'Bridge down',
      narrativeEn: 'Line one.\n\nLine two after a blank line.',
      problems: ['A', 'B'],
      modelPlan: ['First', 'Second'],
    }
    const parsed = parsePlanning({
      stemEn: planningStemEn(parts),
      stemUr: planningStemUr({ titleUr: '', narrativeUr: '' }),
      explanationEn: planningExplanation(parts),
    })
    expect(parsed.narrativeEn).toBe('Line one.\nLine two after a blank line.')
    expect(parsed.narrativeUr).toBeNull()
    expect(parsed.problems).toEqual(['A', 'B'])
  })
})
