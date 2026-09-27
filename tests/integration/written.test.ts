import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { db, sql } from '../../src/lib/db/index'
import { testTypes, questions } from '../../src/lib/db/schema/content'
import { users } from '../../src/lib/db/schema/identity'
import { attempts, writtenResponses } from '../../src/lib/db/schema/attempts'
import { and, desc, eq } from 'drizzle-orm'
import {
  startWrittenAttempt,
  saveWritten,
  submitWrittenAttempt,
  getWrittenAttempt,
  uploadAnswerSheet,
  processOcr,
  confirmOcr,
  getSubmittedWrittenResponses,
} from '../../src/lib/tests/written'
import { storage } from '../../src/lib/storage/index'
import { mediaAssets } from '../../src/lib/db/schema/content'

let testTypeId: string
let userId: string

describe('written capture pipeline (integration)', () => {
  beforeAll(async () => {
    const [tt] = await db
      .insert(testTypes)
      .values({
        code: `it_sct_${Date.now()}`,
        nameEn: 'IT SCT',
        nameUr: 'ٹیسٹ',
        dimension: 'psychologist',
        scoringType: 'rubric',
        timing: { totalSeconds: 300 },
      })
      .returning({ id: testTypes.id })
    testTypeId = tt!.id
    for (const stem of ['When I lead, I…', 'My biggest fear is…']) {
      await db.insert(questions).values({
        testTypeId,
        stemEn: stem,
        contentHash: `${testTypeId}:${stem}`,
        status: 'published',
      })
    }
    const [u] = await db
      .insert(users)
      .values({ name: 'W', email: `w_${Date.now()}@test.com` })
      .returning({ id: users.id })
    userId = u!.id
  })

  afterAll(async () => {
    await db.delete(attempts).where(eq(attempts.userId, userId))
    await db.delete(questions).where(eq(questions.testTypeId, testTypeId))
    await db.delete(users).where(eq(users.id, userId))
    await db.delete(testTypes).where(eq(testTypes.id, testTypeId))
    await sql.end()
  })

  it('captures typed responses and submits them', async () => {
    const attempt = await startWrittenAttempt(userId, testTypeId, 'typed')
    expect(attempt.items.length).toBe(2)

    await saveWritten(userId, attempt.id, attempt.items[0]!.ref, 'I take responsibility.')
    await saveWritten(userId, attempt.id, attempt.items[1]!.ref, 'Letting my team down.')

    const reloaded = await getWrittenAttempt(userId, attempt.id)
    expect(reloaded.responses[attempt.items[0]!.ref]?.text).toBe('I take responsibility.')

    await submitWrittenAttempt(userId, attempt.id)
    const submitted = await getSubmittedWrittenResponses(userId, testTypeId)
    expect(submitted.length).toBe(2)
  })

  it('paper mode: upload → OCR → mandatory confirmation', async () => {
    // Previous attempt is submitted, so a new one can start.
    const attempt = await startWrittenAttempt(userId, testTypeId, 'paper')
    const ref = attempt.items[0]!.ref

    const png = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 1, 2, 3, 4])
    await uploadAnswerSheet(userId, attempt.id, ref, png, 'image/png')

    // Find the stored answer image and run OCR (manual adapter → empty text).
    const afterUpload = await getWrittenAttempt(userId, attempt.id)
    expect(afterUpload.responses[ref]?.hasImage).toBe(true)

    const [media] = await db
      .select()
      .from(mediaAssets)
      .where(eq(mediaAssets.kind, 'answer_sheet'))
      .orderBy(desc(mediaAssets.createdAt))
      .limit(1)
    expect(await storage.exists(media!.storageKey)).toBe(true)

    // Run the worker's OCR step. The manual adapter returns empty text (honest;
    // no fabricated recognition), so the user must type/correct it.
    const [wr] = await db
      .select()
      .from(writtenResponses)
      .where(and(eq(writtenResponses.attemptId, attempt.id), eq(writtenResponses.itemRef, ref)))
      .limit(1)
    await processOcr(wr!.id, media!.storageKey)
    const afterOcr = await getWrittenAttempt(userId, attempt.id)
    expect(afterOcr.responses[ref]?.ocrText).toBe('')
    expect(afterOcr.responses[ref]?.ocrConfirmed).toBe(false)

    // Mandatory confirmation with corrected text.
    await confirmOcr(userId, attempt.id, ref, 'This is my corrected answer.')
    const confirmed = await getWrittenAttempt(userId, attempt.id)
    expect(confirmed.responses[ref]?.ocrConfirmed).toBe(true)
    expect(confirmed.responses[ref]?.text).toBe('This is my corrected answer.')
  })

  it('picture story: each item carries a signed link to its picture', async () => {
    const [tt] = await db
      .insert(testTypes)
      .values({
        code: `it_tat_${Date.now()}`,
        nameEn: 'IT TAT',
        nameUr: 'ٹیسٹ',
        dimension: 'psychologist',
        scoringType: 'rubric',
        timing: { viewSeconds: 30, writeSeconds: 210, itemCount: 4 },
      })
      .returning({ id: testTypes.id })
    const storageKey = `media/it-tat-${Date.now()}.jpg`
    await storage.put(storageKey, Buffer.from([0xff, 0xd8, 0xff]), { mime: 'image/jpeg' })
    const [media] = await db
      .insert(mediaAssets)
      .values({ kind: 'story_picture', storageKey, mime: 'image/jpeg', sizeBytes: 3 })
      .returning({ id: mediaAssets.id })
    await db.insert(questions).values({
      testTypeId: tt!.id,
      stemEn: 'A man leans out of a moving train.',
      mediaId: media!.id,
      contentHash: `${tt!.id}:tat`,
      status: 'published',
    })
    try {
      const attempt = await startWrittenAttempt(userId, tt!.id, 'typed')
      expect(attempt.items[0]!.mediaId).toBe(media!.id)
      expect(attempt.items[0]!.imageUrl).toMatch(/^\/api\/files\/media\/it-tat-.*sig=/)
      // A reload re-signs the link from the stored media id.
      const reloaded = await getWrittenAttempt(userId, attempt.id)
      expect(reloaded.items[0]!.imageUrl).toContain(storageKey)
    } finally {
      await db.delete(attempts).where(eq(attempts.testTypeId, tt!.id))
      await db.delete(questions).where(eq(questions.testTypeId, tt!.id))
      await db.delete(mediaAssets).where(eq(mediaAssets.id, media!.id))
      await db.delete(testTypes).where(eq(testTypes.id, tt!.id))
      await storage.delete(storageKey)
    }
  })
})
