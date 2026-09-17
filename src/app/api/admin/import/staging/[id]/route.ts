/**
 * POST /api/admin/import/staging/[id] — approve or reject a staged question.
 * Approving inserts it into the live bank as a draft. Auth: editor/admin.
 */
import { route, requireRole, readBody, clientIp, json } from '@/lib/api/handler'
import { ApiError } from '@/lib/api/errors'
import { staginReviewSchema } from '@/lib/validation/content'
import { approveStagingItem, rejectStagingItem } from '@/lib/import/service'
import { audit } from '@/lib/audit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const POST = route(async (req, ctx) => {
  const admin = await requireRole(['content_editor', 'admin'])
  const { id } = await ctx.params
  const stagingId = String(id)
  const { action } = await readBody(req, staginReviewSchema)

  if (action === 'approve') {
    let questionId: string
    try {
      questionId = await approveStagingItem(stagingId, admin.id)
    } catch (err) {
      throw new ApiError('bad_request', err instanceof Error ? err.message : 'approve failed')
    }
    await audit({
      userId: admin.id,
      action: 'content.import.approve',
      targetId: stagingId,
      ip: clientIp(req),
    })
    return json({ ok: true, questionId })
  }

  await rejectStagingItem(stagingId, admin.id)
  await audit({
    userId: admin.id,
    action: 'content.import.reject',
    targetId: stagingId,
    ip: clientIp(req),
  })
  return json({ ok: true })
})
