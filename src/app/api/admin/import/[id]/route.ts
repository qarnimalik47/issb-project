/**
 * GET /api/admin/import/[id] — batch detail + its staging items (paginated).
 * Auth: editor/admin.
 */
import { route, requireRole, json } from '@/lib/api/handler'
import { ApiError } from '@/lib/api/errors'
import { db } from '@/lib/db'
import { importBatches, stagingQuestions } from '@/lib/db/schema/content'
import { eq, asc } from 'drizzle-orm'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const GET = route(async (req, ctx) => {
  await requireRole(['content_editor', 'admin'])
  const { id } = await ctx.params
  const batchId = String(id)

  const [batch] = await db
    .select()
    .from(importBatches)
    .where(eq(importBatches.id, batchId))
    .limit(1)
  if (!batch) throw new ApiError('not_found', 'Import batch not found')

  const items = await db
    .select()
    .from(stagingQuestions)
    .where(eq(stagingQuestions.batchId, batchId))
    .orderBy(asc(stagingQuestions.page))
    .limit(500)

  return json({ batch, items })
})
