import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { db, sql } from '../../src/lib/db/index'
import { testTypes, questions } from '../../src/lib/db/schema/content'
import { users } from '../../src/lib/db/schema/identity'
import { eq, inArray } from 'drizzle-orm'
import {
  bulkSetStatus,
  createQuestion,
  listQuestions,
  updateQuestion,
} from '../../src/lib/content/questions'
import { ApiError } from '../../src/lib/api/errors'
import { listQuestionsSchema } from '../../src/lib/validation/content'

let mcqTypeId: string
let writtenTypeId: string
let userId: string
const tag = `qa${Date.now()}`
const opts = (...keys: string[]) => keys.map((key) => ({ key, textEn: `${tag} option ${key}` }))

async function rejects(p: Promise<unknown>, code: string) {
  const err = await p.then(
    () => null,
    (e: unknown) => e,
  )
  expect(err).toBeInstanceOf(ApiError)
  expect((err as ApiError).code).toBe(code)
  return err as ApiError
}

describe('question bank admin (integration)', () => {
  beforeAll(async () => {
    const [mcq, written] = await db
      .insert(testTypes)
      .values([
        {
          code: `${tag}_mcq`,
          nameEn: 'QA MCQ',
          nameUr: 'ٹیسٹ',
          dimension: 'psychologist',
          scoringType: 'objective',
          timing: {},
        },
        {
          code: `${tag}_wat`,
          nameEn: 'QA WAT',
          nameUr: 'ٹیسٹ',
          dimension: 'psychologist',
          scoringType: 'rubric',
          timing: {},
        },
      ])
      .returning({ id: testTypes.id })
    mcqTypeId = mcq!.id
    writtenTypeId = written!.id
    const [u] = await db
      .insert(users)
      .values({ name: 'QA', email: `${tag}@test.com` })
      .returning({ id: users.id })
    userId = u!.id
  })

  afterAll(async () => {
    await db.delete(questions).where(inArray(questions.testTypeId, [mcqTypeId, writtenTypeId]))
    await db.delete(users).where(eq(users.id, userId))
    await db.delete(testTypes).where(inArray(testTypes.id, [mcqTypeId, writtenTypeId]))
    await sql.end()
  })

  it('creates drafts and refuses an exact duplicate with 409', async () => {
    const input = {
      testTypeId: mcqTypeId,
      stemEn: `${tag} duplicate?`,
      options: opts('A', 'B'),
      correctOption: 'A',
      difficulty: 'easy' as const,
    }
    const q = await createQuestion(input, userId)
    expect(q.status).toBe('draft')
    await rejects(createQuestion(input, userId), 'conflict')
  })

  it('re-checks a key-only PATCH against the stored options', async () => {
    const q = await createQuestion(
      {
        testTypeId: mcqTypeId,
        stemEn: `${tag} key?`,
        options: opts('A', 'B'),
        difficulty: 'medium',
      },
      userId,
    )
    const err = await rejects(updateQuestion(q.id, { correctOption: 'D' }), 'validation_failed')
    expect(err.message).toMatch(/"D" is not one of the options/)
    const ok = await updateQuestion(q.id, { correctOption: 'B' })
    expect(ok.correctOption).toBe('B')
    expect(ok.difficulty).toBe('medium') // untouched by the partial update
  })

  it('returns 409, not 500, when an edit collides with another question', async () => {
    await createQuestion(
      {
        testTypeId: mcqTypeId,
        stemEn: `${tag} first`,
        options: opts('A', 'B'),
        difficulty: 'easy',
      },
      userId,
    )
    const second = await createQuestion(
      {
        testTypeId: mcqTypeId,
        stemEn: `${tag} second`,
        options: opts('A', 'B'),
        difficulty: 'easy',
      },
      userId,
    )
    await rejects(updateQuestion(second.id, { stemEn: `${tag} first` }), 'conflict')
  })

  it('only publishes answerable questions, and keeps live ones answerable', async () => {
    const q = await createQuestion(
      {
        testTypeId: mcqTypeId,
        stemEn: `${tag} publish?`,
        options: opts('A', 'B'),
        difficulty: 'easy',
      },
      userId,
    )
    await rejects(updateQuestion(q.id, { status: 'published' }), 'validation_failed')
    await updateQuestion(q.id, { correctOption: 'A', status: 'published' })
    // Removing the keyed option from a live question is refused.
    await rejects(
      updateQuestion(q.id, { options: opts('B', 'C'), correctOption: null }),
      'validation_failed',
    )
  })

  it('publishes a written item with a stem and no options', async () => {
    const w = await createQuestion(
      { testTypeId: writtenTypeId, stemEn: `${tag} prompt`, difficulty: 'medium' },
      userId,
    )
    const live = await updateQuestion(w.id, { status: 'published' })
    expect(live.status).toBe('published')
  })

  it('bulk-publishes the ready ones and reports why the rest were skipped', async () => {
    const ready = await createQuestion(
      {
        testTypeId: mcqTypeId,
        stemEn: `${tag} bulk ready`,
        options: opts('A', 'B'),
        correctOption: 'B',
        difficulty: 'easy',
      },
      userId,
    )
    const notReady = await createQuestion(
      {
        testTypeId: mcqTypeId,
        stemEn: `${tag} bulk no key`,
        options: opts('A', 'B'),
        difficulty: 'easy',
      },
      userId,
    )
    const r = await bulkSetStatus([ready.id, notReady.id], 'publish')
    expect(r.updated).toBe(1)
    expect(r.skipped).toEqual([{ id: notReady.id, reasons: ['No correct answer is selected'] }])
    const [row] = await db.select().from(questions).where(eq(questions.id, ready.id))
    expect(row!.status).toBe('published')
  })

  it('searches stems, escapes wildcards, and filters missing Urdu', async () => {
    await createQuestion(
      {
        testTypeId: mcqTypeId,
        stemEn: `${tag} 50% off`,
        stemUr: 'اردو',
        options: opts('A', 'B'),
        difficulty: 'hard',
      },
      userId,
    )
    const found = await listQuestions(
      listQuestionsSchema.parse({ testTypeId: mcqTypeId, q: `${tag} 50%` }),
    )
    expect(found.questions.map((q) => q.stemEn)).toEqual([`${tag} 50% off`])
    // "5_%" must not match "50%" as a wildcard would.
    const literal = await listQuestions(
      listQuestionsSchema.parse({ testTypeId: mcqTypeId, q: '5_%' }),
    )
    expect(literal.total).toBe(0)

    const missing = await listQuestions(
      listQuestionsSchema.parse({ testTypeId: mcqTypeId, missingUrdu: 'true', pageSize: '100' }),
    )
    expect(missing.questions.every((q) => !q.stemUr)).toBe(true)
    expect(missing.questions.length).toBeGreaterThan(0)
    expect(missing.questions[0]!.readiness).toBeInstanceOf(Array)
  })
})
