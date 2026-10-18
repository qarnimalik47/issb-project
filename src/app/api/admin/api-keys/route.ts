/**
 * GET  /api/admin/api-keys — issued keys, with usage but never the key itself.
 * POST /api/admin/api-keys — mint a key. The plaintext is in this one response
 *                            and is never retrievable again.
 * Auth: admin.
 */
import { route, readBody, requireRole, clientIp, json } from '@/lib/api/handler'
import { z } from 'zod'
import { API_SCOPES, issueApiKey, listApiKeys, SCOPE_LABELS } from '@/lib/admin/api-clients'
import { audit } from '@/lib/audit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const schema = z.object({
  name: z.string().min(2).max(80),
  description: z.string().max(500).optional(),
  scopes: z.array(z.enum(API_SCOPES)).min(1),
  rateLimitPerMinute: z.number().int().min(1).max(10_000).default(60),
  /** Days until the key stops working; omit for a key that never expires. */
  expiresInDays: z.number().int().min(1).max(3650).optional(),
})

export const GET = route(async () => {
  await requireRole(['admin'])
  return json({
    keys: await listApiKeys(),
    scopes: API_SCOPES.map((s) => ({ value: s, label: SCOPE_LABELS[s] })),
  })
})

export const POST = route(async (req) => {
  const admin = await requireRole(['admin'])
  const body = await readBody(req, schema)

  const issued = await issueApiKey({
    name: body.name,
    description: body.description ?? null,
    scopes: body.scopes,
    rateLimitPerMinute: body.rateLimitPerMinute,
    expiresAt: body.expiresInDays
      ? new Date(Date.now() + body.expiresInDays * 24 * 60 * 60 * 1000)
      : null,
    createdBy: admin.id,
  })

  await audit({
    userId: admin.id,
    action: 'admin.apikey.issue',
    targetType: 'api_client',
    targetId: issued.id,
    metadata: { name: body.name, scopes: body.scopes, prefix: issued.keyPrefix },
    ip: clientIp(req),
  })

  return json({ ...issued, keys: await listApiKeys() })
})
