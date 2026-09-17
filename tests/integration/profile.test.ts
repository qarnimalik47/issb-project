import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { db, sql } from '../../src/lib/db/index'
import { testTypes } from '../../src/lib/db/schema/content'
import { users } from '../../src/lib/db/schema/identity'
import { evaluations } from '../../src/lib/db/schema/attempts'
import { eq, inArray } from 'drizzle-orm'
import { computeProfile, buildStudyPlan } from '../../src/lib/profile/engine'

let userId: string
let selfDescId: string
let srtId: string

/** Insert a completed evaluation with given per-quality scores + evidence. */
async function insertEval(testTypeId: string, scores: Record<string, number>, evidence: string) {
  const criteria: Record<string, { score: number; evidence: string }> = {}
  for (const [k, v] of Object.entries(scores)) criteria[k] = { score: v, evidence }
  await db.insert(evaluations).values({
    subjectType: 'written_response',
    subjectId: crypto.randomUUID(),
    userId,
    testTypeId,
    model: 'mock',
    modelVersion: 'mock-1',
    promptVersion: 'test',
    rubricVersion: '1',
    inputHash: crypto.randomUUID(),
    parsedOutput: { criteria, strengths: [], weaknesses: [], improvement: [], distress: false },
    status: 'completed',
  })
}

describe('personality profile (integration)', () => {
  beforeAll(async () => {
    const stamp = Date.now()
    const [sd] = await db
      .insert(testTypes)
      .values({
        code: `it_sd_${stamp}`,
        nameEn: 'Self Desc',
        nameUr: 'x',
        dimension: 'psychologist',
        scoringType: 'rubric',
      })
      .returning({ id: testTypes.id })
    const [srt] = await db
      .insert(testTypes)
      .values({
        code: `it_srt_${stamp}`,
        nameEn: 'SRT',
        nameUr: 'x',
        dimension: 'psychologist',
        scoringType: 'rubric',
      })
      .returning({ id: testTypes.id })
    selfDescId = sd!.id
    srtId = srt!.id
    const [u] = await db
      .insert(users)
      .values({ name: 'P', email: `p_${stamp}@test.com`, targetIssbDate: '2027-01-01' })
      .returning({ id: users.id })
    userId = u!.id

    // Deliberately inconsistent: high responsibility claimed in self-description,
    // low responsibility demonstrated in SRT.
    await insertEval(
      selfDescId,
      { responsibility: 5, initiative: 4 },
      'I always take charge and own every outcome.',
    )
    await insertEval(
      srtId,
      { responsibility: 2, initiative: 2 },
      'I waited for someone else to decide.',
    )
  })

  afterAll(async () => {
    await db.delete(evaluations).where(eq(evaluations.userId, userId))
    await db.delete(users).where(eq(users.id, userId))
    await db.delete(testTypes).where(inArray(testTypes.id, [selfDescId, srtId]))
    await sql.end()
  })

  it('aggregates qualities with evidence', async () => {
    const profile = await computeProfile(userId)
    const responsibility = profile.qualities.find((q) => q.key === 'responsibility')
    expect(responsibility).toBeTruthy()
    expect(responsibility!.count).toBe(2)
    expect(responsibility!.evidence.length).toBeGreaterThan(0)
  })

  it('surfaces the deliberate contradiction (Phase 6 acceptance)', async () => {
    const profile = await computeProfile(userId)
    const c = profile.contradictions.find((x) => x.quality === 'responsibility')
    expect(c).toBeTruthy()
    expect(c!.high.score).toBeGreaterThan(c!.low.score)
  })

  it('reports low confidence and a study plan with countdown', async () => {
    const profile = await computeProfile(userId)
    expect(profile.confidence.level).toBe('low')
    const plan = buildStudyPlan(profile, '2027-01-01')
    expect(plan.daysToTarget).toBeGreaterThan(0)
    expect(plan.focus.join(' ')).toMatch(/contradiction|confidence/i)
  })
})
