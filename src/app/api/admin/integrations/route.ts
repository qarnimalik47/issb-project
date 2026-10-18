/**
 * GET  /api/admin/integrations — every known provider, its state and its usage.
 * POST /api/admin/integrations — save credentials/config for one provider.
 * Auth: admin.
 *
 * Responses carry masks, never secrets: `maskSecret` output is all the client
 * ever sees of a stored credential.
 */
import { route, readBody, requireRole, clientIp, json } from '@/lib/api/handler'
import { z } from 'zod'
import { ApiError } from '@/lib/api/errors'
import {
  integrationUsage,
  listIntegrations,
  providerDef,
  saveIntegration,
} from '@/lib/admin/integrations'
import { audit } from '@/lib/audit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const schema = z.object({
  slug: z.string().min(1).max(64),
  enabled: z.boolean().optional(),
  secrets: z.record(z.string(), z.string().max(4000)).optional(),
  config: z.record(z.string(), z.string().max(500)).optional(),
})

export const GET = route(async () => {
  await requireRole(['admin'])
  const [providers, usage] = await Promise.all([listIntegrations(), integrationUsage(30)])
  return json({ providers, usage })
})

export const POST = route(async (req) => {
  const admin = await requireRole(['admin'])
  const body = await readBody(req, schema)
  if (!providerDef(body.slug)) throw new ApiError('not_found', 'Unknown provider')

  await saveIntegration(
    body.slug,
    { enabled: body.enabled, secrets: body.secrets, config: body.config },
    admin.id,
  )
  await audit({
    userId: admin.id,
    action: 'admin.integration.save',
    targetType: 'integration',
    targetId: body.slug,
    // Which fields were written, never their values.
    metadata: { enabled: body.enabled, fields: Object.keys(body.secrets ?? {}) },
    ip: clientIp(req),
  })
  return json({ ok: true, providers: await listIntegrations() })
})
