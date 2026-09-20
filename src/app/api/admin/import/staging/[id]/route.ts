/**
 * POST /api/admin/import/staging/[id] — approve or reject a staged question.
 * `approve` inserts it into the live bank as a draft; `approve_publish` also
 * publishes it if it passes the readiness check (else 422, item stays pending).
 * Auth: editor/admin.
 */
import { route, requireRole, readBody, clientIp, json } from '@/lib/api/handler'
import { ApiError } from '@/lib/api/errors'
import { stagingEditSchema, staginReviewSchema } from '@/lib/validation/content'
import { approveStagingItem, rejectStagingItem, saveStagingEdit } from '@/lib/import/service'
import { audit } from '@/lib/audit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const POST = route(async (req, ctx) => {
  const admin = await requireRole(['content_editor', 'admin'])
  const { id } = await ctx.params
  const stagingId = String(id)
  const { action } = await readBody(req, staginReviewSchema)

  if (action === 'approve' || action === 'approve_publish') {
    let result
    try {
      result = await approveStagingItem(stagingId, admin.id, {
        publish: action === 'approve_publish',
      })
    } catch (err) {
      if (err instanceof ApiError) throw err
      throw new ApiError('bad_request', err instanceof Error ? err.message : 'approve failed')
    }
    await audit({
      userId: admin.id,
      action:
        action === 'approve_publish' ? 'content.import.approve_publish' : 'content.import.approve',
      targetId: stagingId,
      ip: clientIp(req),
    })
    return json({ ok: true, ...result })
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

/**
 * PATCH — save the reviewer's edit of a staged item. For third-party items the
 * server measures how close the edit still is to the source and decides
 * whether it now counts as rewritten. Auth: editor/admin.
 */
export const PATCH = route(async (req, ctx) => {
  const admin = await requireRole(['content_editor', 'admin'])
  const { id } = await ctx.params
  const edit = await readBody(req, stagingEditSchema)
  const result = await saveStagingEdit(String(id), {
    ...edit,
    stemUr: edit.stemUr ?? null,
    explanationUr: edit.explanationUr ?? null,
  })
  await audit({
    userId: admin.id,
    action: 'content.import.edit',
    targetId: String(id),
    ip: clientIp(req),
    metadata: result,
  })
  return json(result)
})
