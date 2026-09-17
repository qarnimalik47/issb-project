import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { db, sql } from '../../src/lib/db/index'
import { testTypes, rubrics, questions } from '../../src/lib/db/schema/content'
import { users } from '../../src/lib/db/schema/identity'
import { attempts, writtenResponses, evaluations } from '../../src/lib/db/schema/attempts'
import { usageCounters } from '../../src/lib/db/schema/billing'
import { eq } from 'drizzle-orm'
import {
  evaluateWrittenResponse,
  requestEvaluation,
  getAttemptEvaluations,
} from '../../src/lib/eval/service'
import { assertQuota, consumeQuota } from '../../src/lib/billing/quota'
import {
  DEFAULT_RUBRIC_CRITERIA,
  DEFAULT_RUBRIC_OUTPUT_SCHEMA,
} from '../../src/lib/db/seed-data/rubrics'

let testTypeId: string
let userId: string
let attemptId: string
let normalRespId: string
let distressRespId: string

describe('AI evaluation pipeline (integration, mock provider)', () => {
  beforeAll(async () => {
    const [tt] = await db
      .insert(testTypes)
      .values({
        code: `it_eval_${Date.now()}`,
        nameEn: 'IT WAT',
        nameUr: 'ٹیسٹ',
        dimension: 'psychologist',
        scoringType: 'rubric',
      })
      .returning({ id: testTypes.id })
    testTypeId = tt!.id
    await db.insert(rubrics).values({
      testTypeId,
      version: 1,
      name: 'r',
      criteria: DEFAULT_RUBRIC_CRITERIA,
      outputSchema: DEFAULT_RUBRIC_OUTPUT_SCHEMA,
      status: 'published',
    })
    const [u] = await db
      .insert(users)
      .values({ name: 'E', email: `e_${Date.now()}@test.com` })
      .returning({ id: users.id })
    userId = u!.id
    const [a] = await db
      .insert(attempts)
      .values({
        userId,
        testTypeId,
        mode: 'typed',
        status: 'submitted',
        config: { items: [], timing: {} },
      })
      .returning({ id: attempts.id })
    attemptId = a!.id
    const [r1] = await db
      .insert(writtenResponses)
      .values({
        attemptId,
        itemRef: '0',
        prompt: 'Leadership',
        responseText: 'I led my team to plan and solve the problem responsibly and calmly.',
      })
      .returning({ id: writtenResponses.id })
    normalRespId = r1!.id
    const [r2] = await db
      .insert(writtenResponses)
      .values({
        attemptId,
        itemRef: '1',
        prompt: 'Fear',
        responseText: 'Honestly I want to end my life sometimes.',
      })
      .returning({ id: writtenResponses.id })
    distressRespId = r2!.id
  })

  afterAll(async () => {
    await db.delete(attempts).where(eq(attempts.userId, userId))
    await db.delete(usageCounters).where(eq(usageCounters.userId, userId))
    await db.delete(rubrics).where(eq(rubrics.testTypeId, testTypeId))
    await db.delete(questions).where(eq(questions.testTypeId, testTypeId))
    await db.delete(users).where(eq(users.id, userId))
    await db.delete(testTypes).where(eq(testTypes.id, testTypeId))
    await sql.end()
  })

  it('evaluates a normal response with the mock provider (rubric-conformant)', async () => {
    const res = await evaluateWrittenResponse(normalRespId)
    expect(res.status).toBe('completed')
    expect(res.usedMock).toBe(true)
    expect(res.output).toBeTruthy()
    expect(Object.keys(res.output!.criteria).length).toBe(DEFAULT_RUBRIC_CRITERIA.length)
    // Immutable audit record stored.
    const recs = await db.select().from(evaluations).where(eq(evaluations.subjectId, normalRespId))
    expect(recs.length).toBe(1)
    expect(recs[0]!.promptVersion).toBeTruthy()
    expect(recs[0]!.rubricVersion).toBe('1')
  })

  it('re-evaluation creates a NEW immutable record (never overwrites)', async () => {
    await evaluateWrittenResponse(normalRespId)
    const recs = await db.select().from(evaluations).where(eq(evaluations.subjectId, normalRespId))
    expect(recs.length).toBe(2)
  })

  it('blocks a distressed response with no scored critique', async () => {
    const res = await evaluateWrittenResponse(distressRespId)
    expect(res.status).toBe('blocked_distress')
    expect(res.output).toBeUndefined()
    expect(res.supportMessage).toBe(true)
    const recs = await db
      .select()
      .from(evaluations)
      .where(eq(evaluations.subjectId, distressRespId))
    expect(recs[0]!.status).toBe('blocked_distress')
    expect(recs[0]!.parsedOutput).toBeNull()
  })

  it('enforces daily quota before queuing AI work', async () => {
    // Free plan = 3/day. Consume the allowance, then assert it blocks.
    await consumeQuota(userId, 'ai_evaluation')
    await consumeQuota(userId, 'ai_evaluation')
    await consumeQuota(userId, 'ai_evaluation')
    await expect(assertQuota(userId, 'ai_evaluation')).rejects.toThrow()
  })

  it('requestEvaluation reports quota exhaustion', async () => {
    // Quota already exhausted above → request should throw quota_exceeded.
    await expect(requestEvaluation(userId, attemptId)).rejects.toThrow()
  })

  it('getAttemptEvaluations reflects per-item status', async () => {
    const views = await getAttemptEvaluations(userId, attemptId)
    const normal = views.find((v) => v.ref === '0')
    const distress = views.find((v) => v.ref === '1')
    expect(normal?.status).toBe('completed')
    expect(distress?.distress).toBe(true)
  })
})
