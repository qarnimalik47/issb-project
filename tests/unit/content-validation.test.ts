import { describe, it, expect } from 'vitest'
import { optionProblems, publishReadiness } from '../../src/lib/content/readiness'
import { createQuestionSchema, updateQuestionSchema } from '../../src/lib/validation/content'

const TT = '11111111-1111-4111-8111-111111111111'
const opts = (...keys: string[]) => keys.map((key) => ({ key, textEn: `Option ${key}` }))

describe('publishReadiness', () => {
  it('passes a complete MCQ', () => {
    expect(
      publishReadiness({
        stemEn: 'Q?',
        options: opts('A', 'B'),
        correctOption: 'B',
        objective: true,
      }),
    ).toEqual([])
  })

  it('lists every reason an MCQ is not answerable', () => {
    const reasons = publishReadiness({
      stemEn: '  ',
      options: [{ key: 'A', textEn: '' }],
      correctOption: null,
      objective: true,
    })
    expect(reasons).toContain('The English question text is empty')
    expect(reasons).toContain('An MCQ needs at least 2 options')
    expect(reasons).toContain('Every option needs English text')
    expect(reasons).toContain('No correct answer is selected')
  })

  it('rejects a key that points at no option', () => {
    const reasons = publishReadiness({
      stemEn: 'Q?',
      options: opts('A', 'B'),
      correctOption: 'C',
      objective: true,
    })
    expect(reasons.join()).toMatch(/"C" is not one of the options/)
  })

  it('needs only a stem for written (non-objective) items', () => {
    expect(
      publishReadiness({
        stemEn: 'Describe…',
        options: null,
        correctOption: null,
        objective: false,
      }),
    ).toEqual([])
  })
})

describe('optionProblems', () => {
  it('catches duplicate keys', () => {
    expect(optionProblems(opts('A', 'A'), 'A')).toContain('Option keys must be unique')
  })

  it('is silent when either side is absent', () => {
    expect(optionProblems(null, 'A')).toEqual([])
    expect(optionProblems(opts('A', 'B'), null)).toEqual([])
  })
})

describe('question schemas', () => {
  it('rejects a create whose key is not an option', () => {
    const r = createQuestionSchema.safeParse({
      testTypeId: TT,
      stemEn: 'Q?',
      options: opts('A', 'B'),
      correctOption: 'D',
    })
    expect(r.success).toBe(false)
  })

  it('still accepts a written item with no options', () => {
    const r = createQuestionSchema.safeParse({ testTypeId: TT, stemEn: 'Write about…' })
    expect(r.success).toBe(true)
    expect(r.success && r.data.difficulty).toBe('medium')
  })

  it('accepts a figure id', () => {
    const r = createQuestionSchema.safeParse({ testTypeId: TT, stemEn: 'Q?', mediaId: TT })
    expect(r.success && r.data.mediaId).toBe(TT)
  })

  it('does not inject a default difficulty into a partial update', () => {
    const r = updateQuestionSchema.safeParse({ stemEn: 'Edited' })
    expect(r.success).toBe(true)
    expect(r.success && 'difficulty' in r.data ? r.data.difficulty : undefined).toBeUndefined()
  })

  it('lets a PATCH carry only the key (the route re-checks it against the stored options)', () => {
    expect(updateQuestionSchema.safeParse({ correctOption: 'C' }).success).toBe(true)
  })
})
