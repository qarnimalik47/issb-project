import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { db, sql } from '../../src/lib/db/index'
import { testTypes, questions, mediaAssets } from '../../src/lib/db/schema/content'
import { users } from '../../src/lib/db/schema/identity'
import { attempts, mcqResponses } from '../../src/lib/db/schema/attempts'
import { eq, inArray } from 'drizzle-orm'
import {
  startAttempt,
  saveAutosave,
  submitAttempt,
  getAttemptForPlayer,
  findInProgressAttempt,
  sweepExpiredAttempts,
  DEADLINE_GRACE_SECONDS,
} from '../../src/lib/tests/attempts'

let testTypeId: string
let mediaId: string
const userIds: string[] = []
const questionIds: string[] = []
const OPTIONS = ['A', 'B', 'C', 'D'].map((key) => ({ key, textEn: `Option ${key}` }))

async function newUser(): Promise<string> {
  const [u] = await db
    .insert(users)
    .values({ name: 'MCQ', email: `mcq_${Date.now()}_${Math.random()}@test.com` })
    .returning({ id: users.id })
  userIds.push(u!.id)
  return u!.id
}

/** Push an attempt's deadline into the past, beyond the grace window. */
async function expire(attemptId: string) {
  const past = new Date(Date.now() - (DEADLINE_GRACE_SECONDS + 60) * 1000)
  await db.update(attempts).set({ deadlineAt: past }).where(eq(attempts.id, attemptId))
}

describe('MCQ attempt engine (integration)', () => {
  beforeAll(async () => {
    const [tt] = await db
      .insert(testTypes)
      .values({
        code: `it_mcq_${Date.now()}`,
        nameEn: 'IT MCQ',
        nameUr: 'ٹیسٹ',
        dimension: 'psychologist',
        scoringType: 'objective',
        timing: { totalSeconds: 600, itemCount: 3 },
      })
      .returning({ id: testTypes.id })
    testTypeId = tt!.id

    const [m] = await db
      .insert(mediaAssets)
      .values({
        kind: 'nonverbal_figure',
        storageKey: `media/it-${Date.now()}.png`,
        mime: 'image/png',
        sizeBytes: 10,
        meta: { width: 640, height: 480 },
      })
      .returning({ id: mediaAssets.id })
    mediaId = m!.id

    // Every question's key is 'A', so a response's correctness is obvious.
    for (let i = 0; i < 3; i++) {
      const [q] = await db
        .insert(questions)
        .values({
          testTypeId,
          stemEn: `IT question ${i}`,
          options: OPTIONS,
          correctOption: 'A',
          mediaId: i === 0 ? mediaId : null,
          contentHash: `${testTypeId}:${i}`,
          status: 'published',
        })
        .returning({ id: questions.id })
      questionIds.push(q!.id)
    }
  })

  afterAll(async () => {
    const ids = (
      await db.select({ id: attempts.id }).from(attempts).where(inArray(attempts.userId, userIds))
    ).map((a) => a.id)
    if (ids.length) await db.delete(mcqResponses).where(inArray(mcqResponses.attemptId, ids))
    await db.delete(attempts).where(inArray(attempts.userId, userIds))
    await db.delete(questions).where(eq(questions.testTypeId, testTypeId))
    await db.delete(mediaAssets).where(eq(mediaAssets.id, mediaId))
    await db.delete(users).where(inArray(users.id, userIds))
    await db.delete(testTypes).where(eq(testTypes.id, testTypeId))
    await sql.end()
  })

  it('persists flags, and an autosave without flags does not wipe them', async () => {
    const userId = await newUser()
    const a = await startAttempt(userId, testTypeId)
    expect(a.flags).toEqual([])
    const [q1, q2] = a.questions.map((q) => q.id)

    expect(await saveAutosave(userId, a.id, { [q1!]: 'A' }, undefined, [q2!, q2!])).toBe('saved')
    let resumed = await getAttemptForPlayer(userId, a.id)
    expect(resumed.flags).toEqual([q2]) // de-duplicated
    expect(resumed.answers).toEqual({ [q1!]: 'A' })

    // Integrity-only / legacy payload: flags omitted → kept, answers updated.
    await saveAutosave(userId, a.id, { [q1!]: 'B' }, { type: 'hidden', at: 1 })
    resumed = await getAttemptForPlayer(userId, a.id)
    expect(resumed.flags).toEqual([q2])
    expect(resumed.answers).toEqual({ [q1!]: 'B' })

    // Flags for questions outside this attempt are dropped.
    await saveAutosave(userId, a.id, {}, undefined, ['00000000-0000-4000-8000-000000000000'])
    expect((await getAttemptForPlayer(userId, a.id)).flags).toEqual([])
  })

  it('scores the submitted answers before the deadline', async () => {
    const userId = await newUser()
    const a = await startAttempt(userId, testTypeId)
    const answers = Object.fromEntries(a.questions.map((q) => [q.id, 'A']))
    const r = await submitAttempt(userId, a.id, answers)
    expect(r.score).toBe(3)
    expect(r.expired).toBe(false)
    expect(r.durationSeconds).not.toBeNull()
  })

  it('ignores a submission after the deadline and scores only what was autosaved', async () => {
    const userId = await newUser()
    const a = await startAttempt(userId, testTypeId)
    const [q1] = a.questions.map((q) => q.id)
    await saveAutosave(userId, a.id, { [q1!]: 'A' })
    await expire(a.id)

    // Writes are refused once time is up…
    expect(await saveAutosave(userId, a.id, { [q1!]: 'A', x: 'A' })).toBe('closed')
    // …and a direct API call with a full answer sheet cannot beat the clock.
    const all = Object.fromEntries(a.questions.map((q) => [q.id, 'A']))
    const r = await submitAttempt(userId, a.id, all)
    expect(r.expired).toBe(true)
    expect(r.score).toBe(1)
    expect(r.durationSeconds).toBeLessThanOrEqual(600)
  })

  it('scores once when submitted twice', async () => {
    const userId = await newUser()
    const a = await startAttempt(userId, testTypeId)
    const answers = Object.fromEntries(a.questions.map((q) => [q.id, 'A']))
    const [r1, r2] = await Promise.all([
      submitAttempt(userId, a.id, answers),
      submitAttempt(userId, a.id, answers),
    ])
    expect(r1.score).toBe(3)
    expect(r2.score).toBe(3)
    const rows = await db.select().from(mcqResponses).where(eq(mcqResponses.attemptId, a.id))
    expect(rows).toHaveLength(3)
  })

  it('closes an expired attempt on resume: abandoned if blank, scored if answered', async () => {
    const blankUser = await newUser()
    const blank = await startAttempt(blankUser, testTypeId)
    await expire(blank.id)
    expect(await findInProgressAttempt(blankUser, testTypeId)).toBeNull()
    const [b] = await db.select().from(attempts).where(eq(attempts.id, blank.id))
    expect(b!.status).toBe('abandoned')

    const answeredUser = await newUser()
    const answered = await startAttempt(answeredUser, testTypeId)
    await saveAutosave(answeredUser, answered.id, { [answered.questions[0]!.id]: 'A' })
    await expire(answered.id)
    // Starting again closes the stale attempt and hands out a fresh one.
    const fresh = await startAttempt(answeredUser, testTypeId)
    expect(fresh.id).not.toBe(answered.id)
    const [s] = await db.select().from(attempts).where(eq(attempts.id, answered.id))
    expect(s!.status).toBe('evaluated')
    expect(Number(s!.score)).toBe(1)
  })

  it('returns a signed figure URL that outlives the test', async () => {
    const userId = await newUser()
    const a = await startAttempt(userId, testTypeId)
    const withFigure = a.questions.find((q) => q.mediaId === mediaId)!
    expect(withFigure.media).not.toBeNull()
    expect(withFigure.media!.width).toBe(640)
    expect(withFigure.media!.height).toBe(480)
    const exp = Number(new URL(withFigure.media!.url, 'http://x').searchParams.get('exp'))
    const ttl = exp - Math.floor(Date.now() / 1000)
    // remaining (~600 s) + 900 s slack — far beyond signedUrl's 300 s default.
    expect(ttl).toBeGreaterThan(1400)
    expect(ttl).toBeLessThanOrEqual(1501)
    expect(a.questions.filter((q) => q.media === null)).toHaveLength(2)
  })

  it('sweeps stale attempts', async () => {
    const userId = await newUser()
    const a = await startAttempt(userId, testTypeId)
    await expire(a.id)
    expect(await sweepExpiredAttempts()).toBeGreaterThanOrEqual(1)
    const [row] = await db.select().from(attempts).where(eq(attempts.id, a.id))
    expect(row!.status).toBe('abandoned')
  })
})
