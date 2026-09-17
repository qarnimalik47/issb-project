import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import PDFDocument from 'pdfkit'
import { db, sql } from '../../src/lib/db/index'
import {
  importBatches,
  stagingQuestions,
  questions,
  testTypes,
} from '../../src/lib/db/schema/content'
import { users } from '../../src/lib/db/schema/identity'
import { storage } from '../../src/lib/storage/index'
import { processImportBatch, approveStagingItem } from '../../src/lib/import/service'
import { eq } from 'drizzle-orm'

function makePdf(lines: string[]): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument()
    const chunks: Buffer[] = []
    doc.on('data', (c: Buffer) => chunks.push(c))
    doc.on('end', () => resolve(Buffer.concat(chunks)))
    doc.on('error', reject)
    for (const line of lines) doc.text(line)
    doc.end()
  })
}

let testTypeId: string
let adminId: string
let batchId: string

describe('PDF import pipeline (integration)', () => {
  beforeAll(async () => {
    const [tt] = await db
      .insert(testTypes)
      .values({
        code: `it_gk_${Date.now()}`,
        nameEn: 'IT GK',
        nameUr: 'ٹیسٹ',
        dimension: 'cross_cutting',
        scoringType: 'objective',
      })
      .returning({ id: testTypes.id })
    testTypeId = tt!.id

    const [admin] = await db
      .insert(users)
      .values({ name: 'Admin', email: `admin_${Date.now()}@test.com`, role: 'admin' })
      .returning({ id: users.id })
    adminId = admin!.id
  })

  afterAll(async () => {
    if (batchId) await db.delete(importBatches).where(eq(importBatches.id, batchId))
    await db.delete(questions).where(eq(questions.testTypeId, testTypeId))
    await db.delete(users).where(eq(users.id, adminId))
    await db.delete(testTypes).where(eq(testTypes.id, testTypeId))
    await sql.end()
  })

  it('parses a PDF into staging, dedups, approves into the live bank', async () => {
    const pdf = await makePdf([
      '1. Capital of Pakistan? A) Lahore B) Islamabad C) Karachi D) Quetta Answer: B',
      '2. 5 x 3 = ? A) 8 B) 15 C) 20 D) 12 Answer: B',
    ])

    const [batch] = await db
      .insert(importBatches)
      .values({
        source: 'upload',
        filename: 'test.pdf',
        status: 'parsing',
        testTypeId,
        createdBy: adminId,
      })
      .returning({ id: importBatches.id })
    batchId = batch!.id

    const key = `imports/${batchId}/test.pdf`
    await storage.put(key, pdf, { mime: 'application/pdf' })
    await db
      .update(importBatches)
      .set({ meta: { storageKey: key } })
      .where(eq(importBatches.id, batchId))

    await processImportBatch(batchId)

    const staged = await db
      .select()
      .from(stagingQuestions)
      .where(eq(stagingQuestions.batchId, batchId))
    expect(staged.length).toBeGreaterThanOrEqual(2)

    const withAnswer = staged.find((s) => {
      const e = s.extracted as { correctOption: string | null }
      return e.correctOption === 'B'
    })
    expect(withAnswer).toBeTruthy()

    // Approve one → it should appear in the live bank as a draft.
    const questionId = await approveStagingItem(staged[0]!.id, adminId)
    expect(questionId).not.toBe('duplicate')

    const [live] = await db.select().from(questions).where(eq(questions.id, questionId)).limit(1)
    expect(live).toBeTruthy()
    expect(live!.status).toBe('draft')

    // Re-processing the same batch must not duplicate the approved question.
    await processImportBatch(batchId)
    const liveCount = await db.select().from(questions).where(eq(questions.testTypeId, testTypeId))
    // Only the approved question is live; re-parse dedups against it.
    expect(liveCount.length).toBe(1)
  })
})
