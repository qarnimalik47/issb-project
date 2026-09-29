/**
 * Admin management of the two picture-led written banks:
 *
 *   - Picture Story (TAT): an image plus a plain description of the scene. The
 *     description is the image's alt text and the stimulus the evaluator reads;
 *     the candidate never sees it while the picture is up.
 *   - Group Planning Exercise (GPE / "military planning"): a briefing narrative,
 *     an optional map, the problems and a model plan (see planning-format.ts).
 *
 * Both are ordinary `questions` rows of their test type, so the written player,
 * sets and evaluation need nothing new. Publishing files an item into a
 * numbered set; unpublishing or deleting takes it back out (set-filing.ts).
 */
import { createHash } from 'node:crypto'
import { and, asc, count, desc, eq, inArray, ne } from 'drizzle-orm'
import { db } from '../db/index'
import { mediaAssets, questions, testTypes } from '../db/schema/content'
import { storage, signedUrl } from '../storage/index'
import { ApiError } from '../api/errors'
import { isUniqueViolation } from '../db/errors'
import { questionContentHash } from '../import/parse'
import { createFigureAsset } from './media'
import {
  parsePlanning,
  planningExplanation,
  planningStemEn,
  planningStemUr,
  type PlanningParts,
} from './planning-format'
import { fileIntoSet, withdrawFromSet, setTitles } from '../tests/set-filing'

export const STORY_PICTURE_KIND = 'story_picture'
export const PLANNING_MAP_KIND = 'planning_map'
const PREVIEW_TTL_SECONDS = 3600

export type ContentState = 'draft' | 'published' | 'archived'
type Difficulty = 'easy' | 'medium' | 'hard'

async function testTypeId(code: 'picture_story' | 'gpe'): Promise<string> {
  const [tt] = await db
    .select({ id: testTypes.id })
    .from(testTypes)
    .where(eq(testTypes.code, code))
    .limit(1)
  if (!tt) throw new ApiError('not_found', `Test type ${code} is missing — run the seed first`)
  return tt.id
}

/** Load a question of the given type or 404. */
async function ownRow(id: string, typeId: string) {
  const [row] = await db
    .select()
    .from(questions)
    .where(and(eq(questions.id, id), eq(questions.testTypeId, typeId)))
    .limit(1)
  if (!row) throw new ApiError('not_found', 'Item not found')
  return row
}

/** Apply a status change and keep numbered sets in step with it. */
async function setStatus(id: string, status: ContentState) {
  if (status !== 'published') await withdrawFromSet(id)
  await db.update(questions).set({ status, updatedAt: new Date() }).where(eq(questions.id, id))
  if (status === 'published') await fileIntoSet(id)
}

/** Delete a media row and its file when no other question still uses it. */
async function dropMediaIfUnused(mediaId: string | null, exceptQuestionId: string) {
  if (!mediaId) return
  const [used] = await db
    .select({ n: count() })
    .from(questions)
    .where(and(eq(questions.mediaId, mediaId), ne(questions.id, exceptQuestionId)))
  if ((used?.n ?? 0) > 0) return
  const [media] = await db.select().from(mediaAssets).where(eq(mediaAssets.id, mediaId)).limit(1)
  if (!media) return
  await db.delete(mediaAssets).where(eq(mediaAssets.id, mediaId))
  await storage.delete(media.storageKey)
}

async function mediaUrls(ids: (string | null)[]) {
  const wanted = [...new Set(ids.filter((i): i is string => !!i))]
  if (wanted.length === 0) return new Map<string, { url: string; meta: Record<string, unknown> }>()
  const rows = await db
    .select({ id: mediaAssets.id, storageKey: mediaAssets.storageKey, meta: mediaAssets.meta })
    .from(mediaAssets)
    .where(inArray(mediaAssets.id, wanted))
  return new Map(
    rows.map((r) => [
      r.id,
      {
        url: signedUrl(r.storageKey, PREVIEW_TTL_SECONDS),
        meta: (r.meta ?? {}) as Record<string, unknown>,
      },
    ]),
  )
}

/* ------------------------------------------------------------------------ */
/* Picture Story                                                             */
/* ------------------------------------------------------------------------ */

export type PictureStorySummary = {
  id: string
  description: string
  descriptionUr: string | null
  status: ContentState
  imageUrl: string | null
  width: number | null
  height: number | null
  fileName: string | null
  reviewNote: string | null
  set: string | null
  createdAt: Date
}

export async function listPictureStories(): Promise<PictureStorySummary[]> {
  const typeId = await testTypeId('picture_story')
  const rows = await db
    .select()
    .from(questions)
    .where(eq(questions.testTypeId, typeId))
    .orderBy(desc(questions.createdAt), asc(questions.id))
  const media = await mediaUrls(rows.map((r) => r.mediaId))
  const sets = await setTitles(typeId)
  return rows.map((r) => {
    const m = r.mediaId ? media.get(r.mediaId) : undefined
    return {
      id: r.id,
      description: r.stemEn,
      descriptionUr: r.stemUr,
      status: r.status,
      imageUrl: m?.url ?? null,
      width: (m?.meta.width as number | undefined) ?? null,
      height: (m?.meta.height as number | undefined) ?? null,
      fileName: (m?.meta.originalName as string | undefined) ?? null,
      reviewNote: (m?.meta.reviewNote as string | undefined) ?? null,
      set: r.bankId ? (sets.get(r.bankId) ?? null) : null,
      createdAt: r.createdAt,
    }
  })
}

/**
 * Add one picture. The image bytes are the identity of a Picture Story item —
 * the same file uploaded twice is refused rather than duplicated, and the key
 * matches the one scripts/import-picture-stories.ts uses.
 */
export async function createPictureStory(input: {
  data: Buffer
  filename?: string
  description: string
  descriptionUr?: string | null
  publish: boolean
  userId: string
}): Promise<PictureStorySummary> {
  const typeId = await testTypeId('picture_story')
  const description = input.description.trim()
  if (description.length < 10) {
    throw new ApiError('validation_failed', 'Describe the scene in at least one short sentence')
  }
  const sha256 = createHash('sha256').update(input.data).digest('hex')
  const contentHash = questionContentHash(`picture_story:${sha256}`)
  const [dupe] = await db
    .select({ id: questions.id })
    .from(questions)
    .where(eq(questions.contentHash, contentHash))
    .limit(1)
  if (dupe) throw new ApiError('conflict', 'This picture is already in the bank')

  const figure = await createFigureAsset({
    data: input.data,
    filename: input.filename,
    userId: input.userId,
    kind: STORY_PICTURE_KIND,
    meta: { alt: description, sha256 },
  })
  let id: string
  try {
    const [row] = await db
      .insert(questions)
      .values({
        testTypeId: typeId,
        stemEn: description,
        stemUr: input.descriptionUr?.trim() || null,
        mediaId: figure.id,
        topic: 'picture_story',
        difficulty: 'medium',
        contentHash,
        status: 'draft',
        createdBy: input.userId,
      })
      .returning({ id: questions.id })
    id = row!.id
  } catch (err) {
    await dropMediaIfUnused(figure.id, '00000000-0000-0000-0000-000000000000')
    if (isUniqueViolation(err))
      throw new ApiError('conflict', 'This picture is already in the bank')
    throw err
  }
  if (input.publish) await setStatus(id, 'published')
  const all = await listPictureStories()
  return all.find((p) => p.id === id)!
}

export async function updatePictureStory(
  id: string,
  patch: { description?: string; descriptionUr?: string | null; status?: ContentState },
): Promise<void> {
  const typeId = await testTypeId('picture_story')
  const row = await ownRow(id, typeId)
  const set: Partial<typeof questions.$inferInsert> = {}
  if (patch.description !== undefined) {
    const d = patch.description.trim()
    if (d.length < 10) {
      throw new ApiError('validation_failed', 'Describe the scene in at least one short sentence')
    }
    set.stemEn = d
  }
  if (patch.descriptionUr !== undefined) set.stemUr = patch.descriptionUr?.trim() || null
  if (Object.keys(set).length) {
    await db
      .update(questions)
      .set({ ...set, updatedAt: new Date() })
      .where(eq(questions.id, row.id))
    if (set.stemEn && row.mediaId) {
      const [m] = await db
        .select({ meta: mediaAssets.meta })
        .from(mediaAssets)
        .where(eq(mediaAssets.id, row.mediaId))
      await db
        .update(mediaAssets)
        .set({ meta: { ...((m?.meta ?? {}) as object), alt: set.stemEn } })
        .where(eq(mediaAssets.id, row.mediaId))
    }
  }
  if (patch.status && patch.status !== row.status) await setStatus(row.id, patch.status)
}

/** Delete a picture outright. A live picture must be unpublished first. */
export async function deletePictureStory(id: string): Promise<void> {
  const row = await ownRow(id, await testTypeId('picture_story'))
  if (row.status === 'published') {
    throw new ApiError('conflict', 'Unpublish this picture before deleting it')
  }
  await withdrawFromSet(row.id)
  await db.delete(questions).where(eq(questions.id, row.id))
  await dropMediaIfUnused(row.mediaId, row.id)
}

/* ------------------------------------------------------------------------ */
/* Group Planning Exercise                                                   */
/* ------------------------------------------------------------------------ */

export type PlanningSummary = {
  id: string
  title: string
  difficulty: Difficulty
  status: ContentState
  hasMap: boolean
  hasUrdu: boolean
  problemCount: number
  set: string | null
  updatedAt: Date
}

export type PlanningDetail = PlanningParts & {
  id: string
  difficulty: Difficulty
  status: ContentState
  map: { id: string; url: string } | null
}

export type PlanningInput = PlanningParts & {
  difficulty: Difficulty
  status: ContentState
  mapMediaId: string | null
}

export async function listPlanning(): Promise<PlanningSummary[]> {
  const typeId = await testTypeId('gpe')
  const rows = await db
    .select()
    .from(questions)
    .where(eq(questions.testTypeId, typeId))
    .orderBy(desc(questions.updatedAt), asc(questions.id))
  const sets = await setTitles(typeId)
  return rows.map((r) => {
    const p = parsePlanning(r)
    return {
      id: r.id,
      title: p.titleEn || `${r.stemEn.slice(0, 70).trimEnd()}…`,
      difficulty: r.difficulty as Difficulty,
      status: r.status,
      hasMap: !!r.mediaId,
      hasUrdu: !!p.narrativeUr,
      problemCount: p.problems.length,
      set: r.bankId ? (sets.get(r.bankId) ?? null) : null,
      updatedAt: r.updatedAt,
    }
  })
}

export async function getPlanning(id: string): Promise<PlanningDetail> {
  const row = await ownRow(id, await testTypeId('gpe'))
  const media = await mediaUrls([row.mediaId])
  const m = row.mediaId ? media.get(row.mediaId) : undefined
  return {
    id: row.id,
    ...parsePlanning(row),
    difficulty: row.difficulty as Difficulty,
    status: row.status,
    map: m && row.mediaId ? { id: row.mediaId, url: m.url } : null,
  }
}

function validatePlanning(input: PlanningInput) {
  if (input.titleEn.trim().length < 3) throw new ApiError('validation_failed', 'Give it a title')
  if (input.narrativeEn.trim().length < 80) {
    throw new ApiError(
      'validation_failed',
      'The briefing is too short — set out the situation, resources and time available',
    )
  }
  if (input.narrativeUr?.trim() && !input.titleUr?.trim()) {
    throw new ApiError('validation_failed', 'Add the Urdu title too, or leave the Urdu blank')
  }
  if (input.status === 'published') {
    if (input.problems.filter((p) => p.trim()).length < 2) {
      throw new ApiError('validation_failed', 'List at least two problems before publishing')
    }
    if (input.modelPlan.filter((p) => p.trim()).length < 2) {
      throw new ApiError('validation_failed', 'Write the model plan before publishing')
    }
  }
}

async function checkMap(mapMediaId: string | null) {
  if (!mapMediaId) return
  const [m] = await db
    .select({ kind: mediaAssets.kind })
    .from(mediaAssets)
    .where(eq(mediaAssets.id, mapMediaId))
    .limit(1)
  if (!m || m.kind !== PLANNING_MAP_KIND)
    throw new ApiError('validation_failed', 'Unknown map image')
}

/** Create (id null) or update a planning scenario. Returns its id. */
export async function savePlanning(
  id: string | null,
  input: PlanningInput,
  userId: string,
): Promise<string> {
  validatePlanning(input)
  await checkMap(input.mapMediaId)
  const typeId = await testTypeId('gpe')
  const stemEn = planningStemEn(input)
  const values = {
    stemEn,
    stemUr: planningStemUr(input),
    explanationEn: planningExplanation(input),
    mediaId: input.mapMediaId,
    difficulty: input.difficulty,
    // Same hash as the seed uses, so an edited seeded scenario stays one row.
    contentHash: questionContentHash(stemEn, []),
  }
  try {
    if (!id) {
      const [row] = await db
        .insert(questions)
        .values({ ...values, testTypeId: typeId, topic: 'gpe', status: 'draft', createdBy: userId })
        .returning({ id: questions.id })
      if (input.status !== 'draft') await setStatus(row!.id, input.status)
      return row!.id
    }
    const row = await ownRow(id, typeId)
    await db
      .update(questions)
      .set({ ...values, updatedAt: new Date() })
      .where(eq(questions.id, row.id))
    if (row.mediaId && row.mediaId !== input.mapMediaId)
      await dropMediaIfUnused(row.mediaId, row.id)
    if (input.status !== row.status) await setStatus(row.id, input.status)
    return row.id
  } catch (err) {
    if (isUniqueViolation(err)) {
      throw new ApiError('conflict', 'Another scenario already has exactly this title and briefing')
    }
    throw err
  }
}

export async function deletePlanning(id: string): Promise<void> {
  const row = await ownRow(id, await testTypeId('gpe'))
  if (row.status === 'published') {
    throw new ApiError('conflict', 'Unpublish this scenario before deleting it')
  }
  await withdrawFromSet(row.id)
  await db.delete(questions).where(eq(questions.id, row.id))
  await dropMediaIfUnused(row.mediaId, row.id)
}

/** Upload a map for a planning scenario (attached when the scenario is saved). */
export async function uploadPlanningMap(input: {
  data: Buffer
  filename?: string
  userId: string
}) {
  const f = await createFigureAsset({ ...input, kind: PLANNING_MAP_KIND })
  return { id: f.id, url: f.url }
}
