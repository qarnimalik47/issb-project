/**
 * /api/admin/import/[id]
 *   GET   → batch detail + its staging items and source documents. Auth: editor/admin.
 *   PATCH → set the batch's test type { testTypeId }. Without one, none of its
 *           items can be approved. Auth: editor/admin.
 */
import { route, requireRole, readBody, clientIp, json } from '@/lib/api/handler'
import { ApiError } from '@/lib/api/errors'
import { batchUpdateSchema } from '@/lib/validation/content'
import { setBatchTestType } from '@/lib/import/service'
import { audit } from '@/lib/audit'
import { db } from '@/lib/db'
import { importBatches, sourceDocuments, stagingQuestions } from '@/lib/db/schema/content'
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

  const documents = await db
    .select()
    .from(sourceDocuments)
    .where(eq(sourceDocuments.batchId, batchId))
    .orderBy(asc(sourceDocuments.createdAt))

  return json({ batch, items, documents })
})

export const PATCH = route(async (req, ctx) => {
  const admin = await requireRole(['content_editor', 'admin'])
  const { id } = await ctx.params
  const batchId = String(id)
  const { testTypeId } = await readBody(req, batchUpdateSchema)
  await setBatchTestType(batchId, testTypeId)
  await audit({
    userId: admin.id,
    action: 'content.import.set_test_type',
    targetId: batchId,
    ip: clientIp(req),
    metadata: { testTypeId },
  })
  return json({ ok: true })
})
