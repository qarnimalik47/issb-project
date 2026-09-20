/**
 * PATCH /api/admin/sources/[id] — enable/disable, record that the site's terms
 * were reviewed, or change licence and limits. Enabling requires the terms
 * review. Auth: admin.
 */
import { route, readBody, requireRole, clientIp, json } from '@/lib/api/handler'
import { ApiError } from '@/lib/api/errors'
import { updateSourceSchema } from '@/lib/validation/content'
import { updateSource } from '@/lib/scrape/service'
import { audit } from '@/lib/audit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export const PATCH = route(async (req, ctx) => {
  const admin = await requireRole(['admin'])
  const { id } = await ctx.params
  if (!UUID_RE.test(String(id))) throw new ApiError('not_found', 'Source not found')
  const patch = await readBody(req, updateSourceSchema)
  const source = await updateSource(String(id), patch)
  await audit({
    userId: admin.id,
    action: 'content.source.update',
    targetId: source.id,
    ip: clientIp(req),
    metadata: { ...patch, domain: source.domain },
  })
  return json({ source })
})
