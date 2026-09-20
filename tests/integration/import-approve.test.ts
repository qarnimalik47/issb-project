import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { db, sql } from '../../src/lib/db/index'
import {
  importBatches,
  questions,
  stagingQuestions,
  testTypes,
} from '../../src/lib/db/schema/content'
import { users } from '../../src/lib/db/schema/identity'
import { eq, inArray } from 'drizzle-orm'
import { approveStagingItem, setBatchTestType } from '../../src/lib/import/service'
import { ApiError } from '../../src/lib/api/errors'

const tag = `ia${Date.now()}`
let adminId: string
let mcqTypeId: string
let writtenTypeId: string
let batchId: string

async function stage(stemEn: string, correctOption: string | null) {
  const [row] = await db
    .insert(stagingQuestions)
    .values({
      batchId,
      page: 1,
      extracted: {
        stemEn,
        options: [
          { key: 'A', textEn: 'One' },
          { key: 'B', textEn: 'Two' },
        ],
        correctOption,
        explanation: null,
      },
      contentHash: `${tag}:${stemEn}`,
      confidence: '0.9',
      status: 'pending',
    })
    .returning({ id: stagingQuestions.id })
  return row!.id
}

describe('import approval (integration)', () => {
  beforeAll(async () => {
    const [u] = await db
      .insert(users)
      .values({ name: 'Admin', email: `${tag}@test.com`, role: 'admin' })
      .returning({ id: users.id })
    adminId = u!.id
    const [mcq, written] = await db
      .insert(testTypes)
      .values([
        {
          code: `${tag}_mcq`,
          nameEn: 'IA MCQ',
          nameUr: 'ٹیسٹ',
          dimension: 'psychologist',
          scoringType: 'objective',
          timing: {},
        },
        {
          code: `${tag}_wat`,
          nameEn: 'IA WAT',
          nameUr: 'ٹیسٹ',
          dimension: 'psychologist',
          scoringType: 'rubric',
          timing: {},
        },
      ])
      .returning({ id: testTypes.id })
    mcqTypeId = mcq!.id
    writtenTypeId = written!.id
    // Uploaded without a test type — the case that used to be stuck forever.
    const [b] = await db
      .insert(importBatches)
      .values({ source: 'upload', filename: 'x.pdf', status: 'ready', createdBy: adminId })
      .returning({ id: importBatches.id })
    batchId = b!.id
  })

  afterAll(async () => {
    await db.delete(stagingQuestions).where(eq(stagingQuestions.batchId, batchId))
    await db.delete(importBatches).where(eq(importBatches.id, batchId))
    await db.delete(questions).where(inArray(questions.testTypeId, [mcqTypeId, writtenTypeId]))
    await db.delete(testTypes).where(inArray(testTypes.id, [mcqTypeId, writtenTypeId]))
    await db.delete(users).where(eq(users.id, adminId))
    await sql.end()
  })

  it('cannot approve until the batch has a test type, which can now be set', async () => {
    const id = await stage(`${tag} first`, 'A')
    await expect(approveStagingItem(id, adminId)).rejects.toThrow(/no test type/)

    await expect(setBatchTestType(batchId, writtenTypeId)).rejects.toBeInstanceOf(ApiError)
    await setBatchTestType(batchId, mcqTypeId)

    const r = await approveStagingItem(id, adminId)
    expect(r).toEqual({ questionId: expect.any(String), duplicate: false, published: false })
  })

  it('approves and publishes an answerable item in one step', async () => {
    const id = await stage(`${tag} publish me`, 'B')
    const r = await approveStagingItem(id, adminId, { publish: true })
    expect(r.published).toBe(true)
    const [q] = await db.select().from(questions).where(eq(questions.id, r.questionId!))
    expect(q!.status).toBe('published')
  })

  it('refuses to publish an item with no key and leaves it pending', async () => {
    const id = await stage(`${tag} no key`, null)
    const err = await approveStagingItem(id, adminId, { publish: true }).catch((e: unknown) => e)
    expect(err).toBeInstanceOf(ApiError)
    expect((err as ApiError).message).toMatch(/No correct answer is selected/)
    const [row] = await db.select().from(stagingQuestions).where(eq(stagingQuestions.id, id))
    expect(row!.status).toBe('pending')
  })

  it('reports a duplicate structurally instead of a magic string', async () => {
    const first = await stage(`${tag} twice`, 'A')
    await approveStagingItem(first, adminId)
    // Same content hash staged again (e.g. from an overlapping PDF).
    await db.delete(stagingQuestions).where(eq(stagingQuestions.id, first))
    const second = await stage(`${tag} twice`, 'A')
    const r = await approveStagingItem(second, adminId)
    expect(r).toEqual({ questionId: null, duplicate: true, published: false })
  })
})
