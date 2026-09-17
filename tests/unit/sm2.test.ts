import { describe, it, expect } from 'vitest'
import { reviewCard, nextDueAt, INITIAL_SM2 } from '../../src/lib/gk/sm2'

describe('SM-2', () => {
  it('first successful review → 1 day', () => {
    const r = reviewCard(INITIAL_SM2, 5)
    expect(r.repetitions).toBe(1)
    expect(r.intervalDays).toBe(1)
  })

  it('second successful review → 6 days', () => {
    let s = reviewCard(INITIAL_SM2, 4)
    s = reviewCard(s, 4)
    expect(s.repetitions).toBe(2)
    expect(s.intervalDays).toBe(6)
  })

  it('third review multiplies by easiness', () => {
    let s = reviewCard(INITIAL_SM2, 5)
    s = reviewCard(s, 5)
    const third = reviewCard(s, 5)
    expect(third.repetitions).toBe(3)
    expect(third.intervalDays).toBe(Math.round(6 * third.easiness))
  })

  it('failing resets repetitions and schedules tomorrow', () => {
    let s = reviewCard(INITIAL_SM2, 5)
    s = reviewCard(s, 5)
    const failed = reviewCard(s, 1)
    expect(failed.repetitions).toBe(0)
    expect(failed.intervalDays).toBe(1)
  })

  it('easiness never drops below 1.3', () => {
    let s = INITIAL_SM2
    for (let i = 0; i < 10; i++) s = reviewCard(s, 0)
    expect(s.easiness).toBeGreaterThanOrEqual(1.3)
  })

  it('good reviews raise easiness above default', () => {
    const r = reviewCard(INITIAL_SM2, 5)
    expect(r.easiness).toBeGreaterThan(2.5)
  })

  it('nextDueAt adds interval days', () => {
    const now = 1_000_000_000_000
    expect(nextDueAt(now, 6)).toBe(now + 6 * 86400000)
  })
})
