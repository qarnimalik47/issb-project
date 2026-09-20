import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { eq, inArray } from 'drizzle-orm'
import { db, sql } from '../../src/lib/db/index'
import { testTypes, questions, questionBanks } from '../../src/lib/db/schema/content'
import { users } from '../../src/lib/db/schema/identity'
import { attempts } from '../../src/lib/db/schema/attempts'
import { startAttempt, submitAttempt } from '../../src/lib/tests/attempts'
import { listTestSets, getSetProgressByType } from '../../src/lib/tests/sets'

let testTypeId: string
let code: string
let liveBankId: string
let draftBankId: string
const userIds: string[] = []
const OPTIONS = ['A', 'B', 'C', 'D'].map((key) => ({ key, textEn: `Option ${key}` }))

async function newUser(): Promise<string> {
  const [u] = await db
    .insert(users)
    .values({ name: 'Sets', email: `sets_${Date.now()}_${Math.random()}@test.com` })
    .returning({ id: users.id })
  userIds.push(u!.id)
  return u!.id
}

describe('numbered test sets (integration)', () => {
  beforeAll(async () => {
    code = `it_sets_${Date.now()}`
    const [tt] = await db
      .insert(testTypes)
      .values({
        code,
        nameEn: 'IT Sets',
        nameUr: 'سیٹ',
        dimension: 'psychologist',
        scoringType: 'objective',
        timing: { totalSeconds: 600, itemCount: 2 },
      })
      .returning({ id: testTypes.id })
    testTypeId = tt!.id

    const [live] = await db
      .insert(questionBanks)
      .values({ testTypeId, title: 'Test 1', status: 'published' })
      .returning({ id: questionBanks.id })
    liveBankId = live!.id
    const [draft] = await db
      .insert(questionBanks)
      .values({ testTypeId, title: 'Test 2', status: 'draft' })
      .returning({ id: questionBanks.id })
    draftBankId = draft!.id

    // Test 1: two published items. Test 2: one published, one draft — so it
    // stays locked even if someone flips the bank's own status.
    for (const [i, bank] of [liveBankId, liveBankId, draftBankId, draftBankId].entries()) {
      await db.insert(questions).values({
        testTypeId,
        bankId: bank,
        stemEn: `Set question ${i}`,
        options: OPTIONS,
        correctOption: 'A',
        contentHash: `sets-${code}-${i}`,
        status: i === 3 ? 'draft' : 'published',
      })
    }
  })

  afterAll(async () => {
    if (userIds.length) await db.delete(attempts).where(inArray(attempts.userId, userIds))
    await db.delete(questions).where(eq(questions.testTypeId, testTypeId))
    await db.delete(questionBanks).where(eq(questionBanks.testTypeId, testTypeId))
    if (userIds.length) await db.delete(users).where(inArray(users.id, userIds))
    await db.delete(testTypes).where(eq(testTypes.id, testTypeId))
    await sql.end()
  })

  it('lists sets with counts, and locks one whose items are not all published', async () => {
    const userId = await newUser()
    const data = await listTestSets(userId, code)
    expect(data).not.toBeNull()
    expect(data!.sets).toHaveLength(2)

    const [one, two] = data!.sets
    expect(one!.title).toBe('Test 1')
    expect(one!.itemCount).toBe(2)
    expect(one!.readyCount).toBe(2)
    expect(one!.state).toBe('available')

    expect(two!.state).toBe('locked')
    expect(two!.readyCount).toBe(1)
    expect(data!.doneCount).toBe(0)
  })

  it('returns null for an unknown test type code', async () => {
    expect(await listTestSets(await newUser(), 'no_such_code')).toBeNull()
  })

  it('runs exactly the set it was given, in a fixed order', async () => {
    const userId = await newUser()
    const first = await startAttempt(userId, testTypeId, liveBankId)
    expect(first.bankId).toBe(liveBankId)
    expect(first.questions).toHaveLength(2)
    const order = first.questions.map((q) => q.id)

    // Resuming hands back the same attempt, so the order cannot drift mid-test.
    const resumed = await startAttempt(userId, testTypeId, liveBankId)
    expect(resumed.questions.map((q) => q.id)).toEqual(order)
  })

  it('refuses a draft set', async () => {
    const userId = await newUser()
    await expect(startAttempt(userId, testTypeId, draftBankId)).rejects.toThrow(/not available/i)
  })

  it('refuses a second set while one is in progress', async () => {
    const userId = await newUser()
    await startAttempt(userId, testTypeId, liveBankId)
    // Same type, different set: the one-active-per-type rule must surface as a
    // conflict rather than silently returning the other test.
    await expect(startAttempt(userId, testTypeId, draftBankId)).rejects.toThrow(/in progress/i)
  })

  it('marks a set done once its attempt is submitted, and reports progress', async () => {
    const userId = await newUser()
    const attempt = await startAttempt(userId, testTypeId, liveBankId)
    const answers = Object.fromEntries(attempt.questions.map((q) => [q.id, 'A']))
    await submitAttempt(userId, attempt.id, answers)

    const data = await listTestSets(userId, code)
    const one = data!.sets.find((s) => s.id === liveBankId)!
    expect(one.state).toBe('done')
    expect(one.attemptCount).toBe(1)
    expect(one.bestPercentage).toBe(100)
    expect(data!.doneCount).toBe(1)

    const progress = await getSetProgressByType(userId)
    expect(progress.get(testTypeId)).toMatchObject({ total: 2, playable: 1, done: 1 })
  })

  it("does not leak another user's progress", async () => {
    const other = await newUser()
    const data = await listTestSets(other, code)
    expect(data!.doneCount).toBe(0)
    expect(data!.sets.every((s) => s.state !== 'done')).toBe(true)
  })
})
