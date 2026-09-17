import { describe, it, expect } from 'vitest'
import {
  splitQuestions,
  parseQuestionChunk,
  extractQuestions,
  questionContentHash,
} from '../../src/lib/import/parse'

describe('PDF MCQ extraction', () => {
  it('splits numbered questions', () => {
    const text = '1. First question A) x B) y 2. Second question A) p B) q'
    const chunks = splitQuestions(text)
    expect(chunks).toHaveLength(2)
    expect(chunks[0]).toContain('First question')
    expect(chunks[1]).toContain('Second question')
  })

  it('parses a well-formed MCQ with answer at high confidence', () => {
    const q = parseQuestionChunk('What is 2+2? A) 3 B) 4 C) 5 D) 6 Answer: B', 1)
    expect(q.stemEn).toBe('What is 2+2?')
    expect(q.options).toHaveLength(4)
    expect(q.correctOption).toBe('B')
    expect(q.confidence).toBeGreaterThanOrEqual(0.9)
  })

  it('flags low confidence when options are missing', () => {
    const q = parseQuestionChunk('Describe your leadership experience.', 1)
    expect(q.options).toHaveLength(0)
    expect(q.confidence).toBeLessThan(0.6)
  })

  it('produces stable content hashes for dedup', () => {
    const a = questionContentHash('What is 2+2?', [{ textEn: '3' }, { textEn: '4' }])
    const b = questionContentHash('what is  2+2? ', [{ textEn: '3' }, { textEn: '4' }])
    expect(a).toBe(b)
  })

  it('extracts multiple questions from a page', () => {
    const page =
      '1. Capital of Pakistan? A) Lahore B) Islamabad C) Karachi Answer: B ' +
      '2. 5 x 3 = ? A) 8 B) 15 C) 20 Answer: B'
    const qs = extractQuestions(page, 3)
    expect(qs).toHaveLength(2)
    expect(qs[0]!.page).toBe(3)
    expect(qs[1]!.correctOption).toBe('B')
  })
})
