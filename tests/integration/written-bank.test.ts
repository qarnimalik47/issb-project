import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { randomBytes } from 'node:crypto'
import { deflateSync as zDeflate, crc32 as zCrc } from 'node:zlib'
import { and, eq, inArray } from 'drizzle-orm'
import { db, sql } from '../../src/lib/db/index'
import { mediaAssets, questionBanks, questions, testTypes } from '../../src/lib/db/schema/content'
import { attempts } from '../../src/lib/db/schema/attempts'
import { users } from '../../src/lib/db/schema/identity'
import {
  createPictureStory,
  deletePictureStory,
  deletePlanning,
  getPlanning,
  listPictureStories,
  listPlanning,
  savePlanning,
  updatePictureStory,
  uploadPlanningMap,
} from '../../src/lib/content/written-bank'
import { getOpiState, getOpiResult, saveOpiProgress, submitOpi } from '../../src/lib/opi/service'
import { OPI_ITEMS } from '../../src/lib/opi/items'
import { storage } from '../../src/lib/storage/index'
import { ApiError } from '../../src/lib/api/errors'

/** A decodable RGB PNG whose pixels vary per call, so each has a unique hash. */
function uniquePng(): Buffer {
  const chunk = (type: string, data: Buffer) => {
    const len = Buffer.alloc(4)
    len.writeUInt32BE(data.length)
    const body = Buffer.concat([Buffer.from(type, 'ascii'), data])
    const crc = Buffer.alloc(4)
    crc.writeUInt32BE(zCrc(body))
    return Buffer.concat([len, body, crc])
  }
  const w = 4
  const h = 3
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(w, 0)
  ihdr.writeUInt32BE(h, 4)
  ihdr[8] = 8
  ihdr[9] = 2
  const rows = Array.from({ length: h }, () =>
    Buffer.concat([Buffer.from([0]), randomBytes(w * 3)]),
  )
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zDeflate(Buffer.concat(rows))),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

async function code(p: Promise<unknown>) {
  const err = await p.then(
    () => null,
    (e: unknown) => e,
  )
  expect(err).toBeInstanceOf(ApiError)
  return (err as ApiError).code
}

let userId: string
const pictureIds: string[] = []
const planningIds: string[] = []
let banksBefore: string[] = []

const BRIEFING =
  'You are six students returning from a hike at 4 p.m. A bus has overturned on the canal road two kilometres from the nearest village. You have one motorcycle, a first-aid kit and two hours of daylight left.'

describe('picture story, planning and OPI (integration)', () => {
  beforeAll(async () => {
    const [u] = await db
      .insert(users)
      .values({ name: 'Bank', email: `bank_${Date.now()}@test.com` })
      .returning({ id: users.id })
    userId = u!.id
    banksBefore = (await db.select({ id: questionBanks.id }).from(questionBanks)).map((b) => b.id)
  })

  afterAll(async () => {
    await db.delete(attempts).where(eq(attempts.userId, userId))
    const ids = [...pictureIds, ...planningIds]
    if (ids.length) {
      const rows = await db
        .select({ id: questions.id, mediaId: questions.mediaId })
        .from(questions)
        .where(inArray(questions.id, ids))
      await db.delete(questions).where(inArray(questions.id, ids))
      for (const r of rows) {
        if (!r.mediaId) continue
        const [m] = await db.select().from(mediaAssets).where(eq(mediaAssets.id, r.mediaId))
        if (m) {
          await storage.delete(m.storageKey)
          await db.delete(mediaAssets).where(eq(mediaAssets.id, m.id))
        }
      }
    }
    // Drop any set these tests opened.
    const after = await db.select({ id: questionBanks.id }).from(questionBanks)
    const opened = after.map((b) => b.id).filter((id) => !banksBefore.includes(id))
    if (opened.length) await db.delete(questionBanks).where(inArray(questionBanks.id, opened))
    await db.delete(users).where(eq(users.id, userId))
    await sql.end()
  })

  it('uploads a picture as a draft, then publishing files it into a set', async () => {
    const pic = await createPictureStory({
      data: uniquePng(),
      filename: 'scene.png',
      description: 'Two boys push a broken-down car along a village road at dusk.',
      publish: false,
      userId,
    })
    pictureIds.push(pic.id)
    expect(pic.status).toBe('draft')
    expect(pic.set).toBeNull()
    expect(pic.width).toBe(4)
    const [media] = await db
      .select()
      .from(mediaAssets)
      .innerJoin(questions, eq(questions.mediaId, mediaAssets.id))
      .where(eq(questions.id, pic.id))
    expect(media!.media_assets.kind).toBe('story_picture')

    await updatePictureStory(pic.id, { status: 'published' })
    const [row] = await db.select().from(questions).where(eq(questions.id, pic.id))
    expect(row!.status).toBe('published')
    expect(row!.bankId).not.toBeNull()
    const [bank] = await db.select().from(questionBanks).where(eq(questionBanks.id, row!.bankId!))
    expect(bank!.status).toBe('published')
    expect(bank!.title).toMatch(/^Test \d+$/)
  })

  it('refuses the same image twice, a thin description, and deleting a live picture', async () => {
    const data = uniquePng()
    const first = await createPictureStory({
      data,
      description: 'A girl waits alone at a bus stop in heavy rain.',
      publish: true,
      userId,
    })
    pictureIds.push(first.id)
    expect(first.status).toBe('published')
    expect(
      await code(
        createPictureStory({ data, description: 'Same bytes again here.', publish: false, userId }),
      ),
    ).toBe('conflict')
    expect(
      await code(
        createPictureStory({ data: uniquePng(), description: 'short', publish: false, userId }),
      ),
    ).toBe('validation_failed')
    expect(await code(deletePictureStory(first.id))).toBe('conflict')
  })

  it('unpublishing takes a picture out of its set, and a draft can be deleted', async () => {
    const id = pictureIds[1]!
    await updatePictureStory(id, {
      status: 'draft',
      description: 'A girl waits alone at a bus stop in heavy rain, holding a torn letter.',
    })
    const [row] = await db.select().from(questions).where(eq(questions.id, id))
    expect(row!.status).toBe('draft')
    expect(row!.bankId).toBeNull()
    expect(row!.stemEn).toMatch(/torn letter/)

    await deletePictureStory(id)
    pictureIds.splice(1, 1)
    expect((await listPictureStories()).some((p) => p.id === id)).toBe(false)
  })

  it('creates, edits and reads back a planning scenario with a map', async () => {
    const map = await uploadPlanningMap({ data: uniquePng(), filename: 'map.png', userId })
    const input = {
      titleEn: `Canal road accident ${Date.now()}`,
      titleUr: null,
      narrativeEn: BRIEFING,
      narrativeUr: null,
      problems: ['Injured passengers', 'Fuel leak', 'Nightfall'],
      modelPlan: ['Send the motorcycle for help', 'Move people clear of the fuel', 'First aid'],
      difficulty: 'medium' as const,
      status: 'draft' as const,
      mapMediaId: map.id,
    }
    const id = await savePlanning(null, input, userId)
    planningIds.push(id)

    const got = await getPlanning(id)
    expect(got.titleEn).toBe(input.titleEn)
    expect(got.narrativeEn).toBe(BRIEFING)
    expect(got.problems).toEqual(input.problems)
    expect(got.modelPlan).toEqual(input.modelPlan)
    expect(got.map?.id).toBe(map.id)

    await savePlanning(
      id,
      { ...input, problems: [...input.problems, 'A missing child'], status: 'published' },
      userId,
    )
    const again = await getPlanning(id)
    expect(again.problems).toHaveLength(4)
    expect(again.status).toBe('published')
    const summary = (await listPlanning()).find((s) => s.id === id)
    expect(summary?.hasMap).toBe(true)
    expect(summary?.set).toMatch(/^Test \d+$/)
    expect(await code(deletePlanning(id))).toBe('conflict')
  })

  it('refuses to publish a scenario without problems or a model plan', async () => {
    expect(
      await code(
        savePlanning(
          null,
          {
            titleEn: 'Incomplete',
            narrativeEn: BRIEFING,
            problems: [],
            modelPlan: [],
            difficulty: 'easy',
            status: 'published',
            mapMediaId: null,
          },
          userId,
        ),
      ),
    ).toBe('validation_failed')
  })

  it('removing a map on save deletes the orphaned image', async () => {
    const id = planningIds[0]!
    const before = await getPlanning(id)
    const oldMap = before.map!.id
    await savePlanning(id, { ...before, status: 'draft', mapMediaId: null }, userId)
    const [gone] = await db.select().from(mediaAssets).where(eq(mediaAssets.id, oldMap))
    expect(gone).toBeUndefined()
    const [row] = await db.select().from(questions).where(eq(questions.id, id))
    expect(row!.bankId).toBeNull()
    await deletePlanning(id)
    planningIds.splice(0, 1)
  })

  it('saves OPI progress, refuses a partial submit, then scores a complete one', async () => {
    const half = Object.fromEntries(OPI_ITEMS.slice(0, 20).map((i) => [i.id, 5]))
    expect((await saveOpiProgress(userId, { ...half, bogus: 3, e1: 12 })).answered).toBe(19)
    const state = await getOpiState(userId)
    expect(Object.keys(state.answers)).toHaveLength(19)
    expect(state.startedAt).not.toBeNull()

    expect(await code(submitOpi(userId, {}))).toBe('validation_failed')

    const rest = Object.fromEntries(
      OPI_ITEMS.map((i, n) => [i.id, i.trait === 'K' ? (i.key === 1 ? 2 : 6) : (n % 3) + 3]),
    )
    const { id, result } = await submitOpi(userId, rest)
    expect(result.answered).toBe(OPI_ITEMS.length)
    expect(result.code).toMatch(/^[EI][NS][FT][JP]$/)

    const [row] = await db
      .select()
      .from(attempts)
      .where(and(eq(attempts.id, id), eq(attempts.userId, userId)))
    expect(row!.status).toBe('evaluated')
    expect(row!.score).toBeNull()

    const fetched = await getOpiResult(userId, id)
    expect(fetched.result.code).toBe(result.code)
    const after = await getOpiState(userId)
    expect(after.history[0]?.id).toBe(id)
    expect(Object.keys(after.answers)).toHaveLength(0)
  })

  it('keeps OPI results private to their owner', async () => {
    const { history } = await getOpiState(userId)
    const [other] = await db
      .insert(users)
      .values({ name: 'Other', email: `other_${Date.now()}@test.com` })
      .returning({ id: users.id })
    try {
      expect(await code(getOpiResult(other!.id, history[0]!.id))).toBe('not_found')
    } finally {
      await db.delete(users).where(eq(users.id, other!.id))
    }
  })

  it('has the seeded test types these features rely on', async () => {
    const codes = (await db.select({ code: testTypes.code }).from(testTypes)).map((t) => t.code)
    expect(codes).toEqual(expect.arrayContaining(['picture_story', 'gpe', 'opi']))
  })
})
