/**
 * POST /api/admin/integrations/[slug]/test — make a live, read-only call to the
 * provider and record the outcome. Auth: admin.
 *
 * Rate-limited because each call reaches a third party on the operator's
 * credential; a stuck button should not hammer the vendor.
 */
import { route, requireRole, enforceRateLimit, clientIp, json } from '@/lib/api/handler'
import { ApiError } from '@/lib/api/errors'
import { listIntegrations, providerDef, testIntegration } from '@/lib/admin/integrations'
import { audit } from '@/lib/audit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const POST = route(async (req, ctx) => {
  const admin = await requireRole(['admin'])
  const { slug } = await ctx.params
  const provider = String(slug)
  if (!providerDef(provider)) throw new ApiError('not_found', 'Unknown provider')

  await enforceRateLimit(`admin:integration-test:${admin.id}`, 10, 60)
  const result = await testIntegration(provider)

  await audit({
    userId: admin.id,
    action: 'admin.integration.test',
    targetType: 'integration',
    targetId: provider,
    metadata: { ok: result.ok, latencyMs: result.latencyMs },
    ip: clientIp(req),
  })
  return json({ ...result, providers: await listIntegrations() })
})
