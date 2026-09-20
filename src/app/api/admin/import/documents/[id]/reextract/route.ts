/**
 * POST /api/admin/import/documents/[id]/reextract — run extraction again on a
 * stored page snapshot (e.g. after the extractor improved). Makes no request
 * to the source site. Auth: editor/admin.
 */
import { route, requireRole, clientIp, json } from '@/lib/api/handler'
import { ApiError } from '@/lib/api/errors'
import { reextractDocument } from '@/lib/scrape/service'
import { audit } from '@/lib/audit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export const POST = route(async (req, ctx) => {
  const admin = await requireRole(['content_editor', 'admin'])
  const { id } = await ctx.params
  if (!UUID_RE.test(String(id))) throw new ApiError('not_found', 'Document not found')
  const result = await reextractDocument(String(id))
  await audit({
    userId: admin.id,
    action: 'content.scrape.reextract',
    targetId: String(id),
    ip: clientIp(req),
    metadata: result,
  })
  return json(result)
})
