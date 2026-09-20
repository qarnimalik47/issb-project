/**
 * POST /api/admin/questions/bulk — publish / unpublish / archive many at once.
 * Publishing applies the same readiness gate as a single publish; items that
 * fail it are skipped and reported with their reasons. Writes ONE audit row
 * with the count, not one per question. Auth: editor/admin.
 */
import { route, readBody, requireRole, clientIp, json } from '@/lib/api/handler'
import { bulkQuestionActionSchema } from '@/lib/validation/content'
import { bulkSetStatus } from '@/lib/content/questions'
import { audit } from '@/lib/audit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const POST = route(async (req) => {
  const admin = await requireRole(['content_editor', 'admin'])
  const { action, ids } = await readBody(req, bulkQuestionActionSchema)
  const result = await bulkSetStatus(ids, action)
  await audit({
    userId: admin.id,
    action: `content.question.bulk_${action}`,
    ip: clientIp(req),
    metadata: { requested: ids.length, updated: result.updated, skipped: result.skipped.length },
  })
  return json(result)
})
