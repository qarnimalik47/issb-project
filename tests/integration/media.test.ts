import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { crc32, deflateSync } from 'node:zlib'
import { db, sql } from '../../src/lib/db/index'
import { testTypes, questions, mediaAssets } from '../../src/lib/db/schema/content'
import { users } from '../../src/lib/db/schema/identity'
import { attempts } from '../../src/lib/db/schema/attempts'
import { eq } from 'drizzle-orm'
import {
  createFigureAsset,
  deleteFigure,
  listFigures,
  MAX_FIGURE_BYTES,
} from '../../src/lib/content/media'
import { startAttempt } from '../../src/lib/tests/attempts'
import { storage } from '../../src/lib/storage/index'
import { ApiError } from '../../src/lib/api/errors'

/** A real, decodable RGB PNG — not just a header. */
function realPng(width: number, height: number): Buffer {
  const chunk = (type: string, data: Buffer) => {
    const len = Buffer.alloc(4)
    len.writeUInt32BE(data.length)
    const body = Buffer.concat([Buffer.from(type, 'ascii'), data])
    const crc = Buffer.alloc(4)
    crc.writeUInt32BE(crc32(body))
    return Buffer.concat([len, body, crc])
  }
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 2 // RGB
  const row = Buffer.concat([Buffer.from([0]), Buffer.alloc(width * 3, 0x80)])
  const raw = Buffer.concat(Array.from({ length: height }, () => row))
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

let userId: string
let testTypeId: string
const created: string[] = []

async function code(p: Promise<unknown>) {
  const err = await p.then(
    () => null,
    (e: unknown) => e,
  )
  expect(err).toBeInstanceOf(ApiError)
  return (err as ApiError).code
}

describe('question figures (integration)', () => {
  beforeAll(async () => {
    const [u] = await db
      .insert(users)
      .values({ name: 'Media', email: `media_${Date.now()}@test.com` })
      .returning({ id: users.id })
    userId = u!.id
    const [tt] = await db
      .insert(testTypes)
      .values({
        code: `it_nv_${Date.now()}`,
        nameEn: 'IT Non-verbal',
        nameUr: 'ٹیسٹ',
        dimension: 'psychologist',
        scoringType: 'objective',
        timing: { totalSeconds: 600 },
      })
      .returning({ id: testTypes.id })
    testTypeId = tt!.id
  })

  afterAll(async () => {
    await db.delete(attempts).where(eq(attempts.userId, userId))
    await db.delete(questions).where(eq(questions.testTypeId, testTypeId))
    for (const id of created) {
      const [row] = await db.select().from(mediaAssets).where(eq(mediaAssets.id, id))
      if (row) {
        await storage.delete(row.storageKey)
        await db.delete(mediaAssets).where(eq(mediaAssets.id, id))
      }
    }
    await db.delete(testTypes).where(eq(testTypes.id, testTypeId))
    await db.delete(users).where(eq(users.id, userId))
    await sql.end()
  })

  it('stores an image under a key derived from its id, with its dimensions', async () => {
    const fig = await createFigureAsset({ data: realPng(4, 3), filename: '../../evil.svg', userId })
    created.push(fig.id)
    expect(fig.width).toBe(4)
    expect(fig.height).toBe(3)
    const [row] = await db.select().from(mediaAssets).where(eq(mediaAssets.id, fig.id))
    // The crafted filename influences nothing but the display name.
    expect(row!.storageKey).toBe(`media/${fig.id}.png`)
    expect(row!.mime).toBe('image/png')
    expect(await storage.exists(row!.storageKey)).toBe(true)
    expect((await listFigures()).figures.some((f) => f.id === fig.id)).toBe(true)
  })

  it('rejects SVG, GIF, empty and oversized uploads', async () => {
    const svg = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"><script>x</script></svg>')
    expect(await code(createFigureAsset({ data: svg, filename: 'a.png', userId }))).toBe(
      'validation_failed',
    )
    const gif = Buffer.from('GIF89a\x01\x00\x01\x00\x00\x00\x00', 'latin1')
    expect(await code(createFigureAsset({ data: gif, userId }))).toBe('validation_failed')
    expect(await code(createFigureAsset({ data: Buffer.alloc(0), userId }))).toBe(
      'validation_failed',
    )
    const huge = Buffer.concat([realPng(1, 1), Buffer.alloc(MAX_FIGURE_BYTES)])
    expect(await code(createFigureAsset({ data: huge, userId }))).toBe('validation_failed')
  })

  it('reaches the player, and cannot be deleted while a published question shows it', async () => {
    const fig = await createFigureAsset({ data: realPng(8, 8), userId })
    created.push(fig.id)
    const [q] = await db
      .insert(questions)
      .values({
        testTypeId,
        stemEn: 'Which figure completes the matrix?',
        options: ['A', 'B', 'C', 'D'].map((key) => ({ key, textEn: key })),
        correctOption: 'C',
        mediaId: fig.id,
        contentHash: `media-it-${fig.id}`,
        status: 'published',
      })
      .returning({ id: questions.id })

    const attempt = await startAttempt(userId, testTypeId)
    const media = attempt.questions[0]!.media
    expect(media?.url).toMatch(new RegExp(`^/api/files/media/${fig.id}\\.png\\?exp=\\d+&sig=`))
    expect(media?.width).toBe(8)

    expect(await code(deleteFigure(fig.id))).toBe('conflict')
    await db.update(questions).set({ status: 'draft' }).where(eq(questions.id, q!.id))
    await deleteFigure(fig.id)
    const [after] = await db.select().from(questions).where(eq(questions.id, q!.id))
    expect(after!.mediaId).toBeNull()
  })
})
