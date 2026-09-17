import { describe, it, expect } from 'vitest'
import { analyzeLecturette } from '../../src/lib/voice/lecturette'
import { generateInterviewQuestions } from '../../src/lib/interview/generate'

describe('analyzeLecturette', () => {
  it('computes wpm, fillers and structure', () => {
    const transcript =
      'Today I will talk about discipline. Firstly, because it builds character. For example, soldiers rely on it. In conclusion, discipline is essential.'
    const a = analyzeLecturette(transcript, 60)
    expect(a.wordCount).toBeGreaterThan(10)
    expect(a.wpm).toBeGreaterThan(0)
    expect(a.structure.intro).toBe(true)
    expect(a.structure.analysis).toBe(true)
    expect(a.structure.conclusion).toBe(true)
  })

  it('flags fillers and missing structure', () => {
    const a = analyzeLecturette('um uh like basically um the thing', 60)
    expect(a.fillerCount).toBeGreaterThanOrEqual(4)
    expect(a.notes.join(' ')).toMatch(/filler|conclusion|introduction/i)
  })
})

describe('generateInterviewQuestions', () => {
  it('tailors questions to the PIQ', () => {
    const qs = generateInterviewQuestions(
      {
        hobbies: ['reading'],
        gamesAndSports: ['cricket'],
        strengths: 'calm under pressure',
        weaknesses: 'impatience',
        education: 'BSc CS',
      },
      'pma',
    )
    const text = qs.map((q) => q.question).join(' ')
    expect(text).toMatch(/reading/)
    expect(text).toMatch(/cricket/)
    expect(text).toMatch(/calm under pressure/)
    expect(text).toMatch(/PMA/)
    expect(qs.length).toBeGreaterThan(4)
    expect(qs.length).toBeLessThanOrEqual(10)
  })

  it('always includes a cross-questioning follow-up', () => {
    const qs = generateInterviewQuestions({ hobbies: [], gamesAndSports: [] }, null)
    expect(qs.some((q) => /the same way|someone who was there/i.test(q.question))).toBe(true)
  })
})
