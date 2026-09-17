import { describe, it, expect } from 'vitest'
import { scoreMcq, weakTopics } from '../../src/lib/tests/scoring'

const q = (id: string, correct: string | null, topic?: string) => ({
  id,
  correctOption: correct,
  topic,
})

describe('scoreMcq', () => {
  it('scores a perfect attempt', () => {
    const questions = [q('1', 'A'), q('2', 'B'), q('3', 'C')]
    const r = scoreMcq(questions, { '1': 'A', '2': 'B', '3': 'C' })
    expect(r.score).toBe(3)
    expect(r.maxScore).toBe(3)
    expect(r.percentage).toBe(100)
  })

  it('counts unanswered as incorrect', () => {
    const r = scoreMcq([q('1', 'A'), q('2', 'B')], { '1': 'A' })
    expect(r.score).toBe(1)
    expect(r.perQuestion[1]!.correct).toBe(false)
    expect(r.perQuestion[1]!.selected).toBeNull()
  })

  it('treats empty string and null identically', () => {
    const r = scoreMcq([q('1', 'A')], { '1': '' })
    expect(r.perQuestion[0]!.selected).toBeNull()
    expect(r.score).toBe(0)
  })

  it('ignores answers for questions not in the set (no client injection)', () => {
    const r = scoreMcq([q('1', 'A')], { '1': 'A', '999': 'A' })
    expect(r.maxScore).toBe(1)
    expect(r.score).toBe(1)
  })

  it('is wrong when correctOption is null', () => {
    const r = scoreMcq([q('1', null)], { '1': 'A' })
    expect(r.score).toBe(0)
  })

  it('handles an empty test', () => {
    const r = scoreMcq([], {})
    expect(r).toMatchObject({ score: 0, maxScore: 0, percentage: 0 })
  })

  it('rounds percentage', () => {
    const r = scoreMcq([q('1', 'A'), q('2', 'A'), q('3', 'A')], { '1': 'A' })
    expect(r.percentage).toBe(33)
  })

  it('breaks down by topic and finds weak topics', () => {
    const questions = [
      q('1', 'A', 'math'),
      q('2', 'A', 'math'),
      q('3', 'A', 'history'),
      q('4', 'A', 'history'),
    ]
    const r = scoreMcq(questions, { '1': 'A', '2': 'B', '3': 'B', '4': 'B' })
    expect(r.byTopic.math).toEqual({ correct: 1, total: 2 })
    expect(r.byTopic.history).toEqual({ correct: 0, total: 2 })
    expect(weakTopics(r.byTopic)).toEqual(expect.arrayContaining(['math', 'history']))
  })

  it('defaults missing topic to "general"', () => {
    const r = scoreMcq([q('1', 'A')], { '1': 'A' })
    expect(r.byTopic.general).toEqual({ correct: 1, total: 1 })
  })
})
