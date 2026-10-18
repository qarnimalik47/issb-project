/** DELETE /api/admin/api-keys/[id] — revoke a key immediately. Auth: admin. */
import { route, requireRole, clientIp, json } from '@/lib/api/handler'
import { listApiKeys, revokeApiKey } from '@/lib/admin/api-clients'
import { audit } from '@/lib/audit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const DELETE = route(async (req, ctx) => {
  const admin = await requireRole(['admin'])
  const { id } = await ctx.params
  await revokeApiKey(String(id))
  await audit({
    userId: admin.id,
    action: 'admin.apikey.revoke',
    targetType: 'api_client',
    targetId: String(id),
    ip: clientIp(req),
  })
  return json({ ok: true, keys: await listApiKeys() })
})
