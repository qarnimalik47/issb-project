/**
 * Question figures (non-verbal matrices, mechanical diagrams): upload, library
 * and removal. Library functions, like the rest of src/lib/content, so they
 * can be integration-tested without a request context.
 */
import { randomUUID } from 'node:crypto'
import { and, count, desc, eq, inArray } from 'drizzle-orm'
import { db } from '../db/index'
import { mediaAssets, questions } from '../db/schema/content'
import { storage, signedUrl } from '../storage/index'
import { sniffImage } from '../media/image'
import { ApiError } from '../api/errors'

export const MAX_FIGURE_BYTES = 5 * 1024 * 1024
export const FIGURE_KIND = 'question_figure'
/** Earlier rows used this kind; the library shows both. */
const FIGURE_KINDS = [FIGURE_KIND, 'nonverbal_figure']
const PREVIEW_TTL_SECONDS = 3600

export type FigureSummary = {
  id: string
  url: string
  width: number | null
  height: number | null
  sizeBytes: number
  name: string | null
  usedBy: number
  createdAt: Date
}

type Meta = { width?: number; height?: number; originalName?: string }

/**
 * Store an uploaded figure. The bytes decide the type — the filename and the
 * browser's content-type are ignored. The storage key is derived from the row
 * id (never from the filename), so storage and database cannot drift and a
 * crafted name cannot steer where the file lands.
 */
export async function createFigureAsset(input: {
  data: Buffer
  filename?: string
  userId: string
  /** Defaults to a question figure; Picture Story and GPE maps pass their own kind. */
  kind?: string
  /** Extra metadata stored beside the dimensions (e.g. the image's sha256). */
  meta?: Record<string, unknown>
}): Promise<FigureSummary> {
  if (input.data.length === 0) throw new ApiError('validation_failed', 'The file is empty')
  if (input.data.length > MAX_FIGURE_BYTES) {
    throw new ApiError('validation_failed', 'Images must be 5 MB or smaller')
  }
  const image = sniffImage(input.data)
  if (!image) {
    throw new ApiError('validation_failed', 'Only PNG, JPEG or WebP images are accepted')
  }

  const id = randomUUID()
  const storageKey = `media/${id}.${image.ext}`
  const meta: Meta & Record<string, unknown> = {
    ...input.meta,
    width: image.width,
    height: image.height,
    originalName: input.filename?.slice(0, 200),
  }
  await storage.put(storageKey, input.data, { mime: image.mime })
  try {
    const [row] = await db
      .insert(mediaAssets)
      .values({
        id,
        kind: input.kind ?? FIGURE_KIND,
        storageKey,
        mime: image.mime,
        sizeBytes: input.data.length,
        meta,
        createdBy: input.userId,
      })
      .returning()
    return summarise(row!, 0)
  } catch (err) {
    await storage.delete(storageKey)
    throw err
  }
}

function summarise(row: typeof mediaAssets.$inferSelect, usedBy: number): FigureSummary {
  const meta = (row.meta ?? {}) as Meta
  return {
    id: row.id,
    url: signedUrl(row.storageKey, PREVIEW_TTL_SECONDS),
    width: meta.width ?? null,
    height: meta.height ?? null,
    sizeBytes: row.sizeBytes,
    name: meta.originalName ?? null,
    usedBy,
    createdAt: row.createdAt,
  }
}

/** Newest first, with how many questions use each figure. */
export async function listFigures(page = 1, pageSize = 24) {
  const rows = await db
    .select()
    .from(mediaAssets)
    .where(inArray(mediaAssets.kind, FIGURE_KINDS))
    .orderBy(desc(mediaAssets.createdAt))
    .limit(pageSize)
    .offset((page - 1) * pageSize)
  const ids = rows.map((r) => r.id)
  const usage = ids.length
    ? await db
        .select({ mediaId: questions.mediaId, n: count() })
        .from(questions)
        .where(inArray(questions.mediaId, ids))
        .groupBy(questions.mediaId)
    : []
  const usedBy = new Map(usage.map((u) => [u.mediaId, u.n]))
  const [total] = await db
    .select({ n: count() })
    .from(mediaAssets)
    .where(inArray(mediaAssets.kind, FIGURE_KINDS))
  return {
    figures: rows.map((r) => summarise(r, usedBy.get(r.id) ?? 0)),
    page,
    pageSize,
    total: total?.n ?? 0,
  }
}

/**
 * Hard-delete a figure. Refused while any published question shows it —
 * removing it would leave that question unanswerable mid-exam. Drafts that
 * reference it simply lose the figure (the FK is ON DELETE SET NULL).
 */
export async function deleteFigure(id: string): Promise<void> {
  const [row] = await db.select().from(mediaAssets).where(eq(mediaAssets.id, id)).limit(1)
  if (!row || !FIGURE_KINDS.includes(row.kind)) throw new ApiError('not_found', 'Figure not found')
  const [live] = await db
    .select({ n: count() })
    .from(questions)
    .where(and(eq(questions.mediaId, id), eq(questions.status, 'published')))
  if ((live?.n ?? 0) > 0) {
    throw new ApiError(
      'conflict',
      `This figure is used by ${live!.n} published question(s). Unpublish or change them first.`,
    )
  }
  await db.delete(mediaAssets).where(eq(mediaAssets.id, id))
  await storage.delete(row.storageKey)
}
