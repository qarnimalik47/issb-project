/**
 * DELETE /api/admin/media/[id] — permanently delete a figure. Refused while a
 * published question uses it. Destructive, so admin only.
 */
import { route, requireRole, clientIp, json } from '@/lib/api/handler'
import { ApiError } from '@/lib/api/errors'
import { deleteFigure } from '@/lib/content/media'
import { audit } from '@/lib/audit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export const DELETE = route(async (req, ctx) => {
  const admin = await requireRole(['admin'])
  const { id } = await ctx.params
  const figureId = String(id)
  if (!UUID_RE.test(figureId)) throw new ApiError('not_found', 'Figure not found')
  await deleteFigure(figureId)
  await audit({
    userId: admin.id,
    action: 'content.media.delete',
    targetId: figureId,
    ip: clientIp(req),
  })
  return json({ ok: true })
})
