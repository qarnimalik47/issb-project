/**
 * /api/admin/planning/[id]
 *   GET    → one scenario, split back into its parts, with a map preview. Auth: editor/admin.
 *   PUT    → replace the scenario's content, map and status. Auth: editor/admin.
 *   DELETE → remove a scenario that is not live. Auth: admin.
 */
import { route, readBody, requireRole, clientIp, json } from '@/lib/api/handler'
import { ApiError } from '@/lib/api/errors'
import { planningSchema } from '@/lib/validation/written-bank'
import { deletePlanning, getPlanning, savePlanning } from '@/lib/content/written-bank'
import { audit } from '@/lib/audit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

async function idOf(ctx: { params: Promise<Record<string, string | string[]>> }) {
  const { id } = await ctx.params
  const value = String(id)
  if (!UUID_RE.test(value)) throw new ApiError('not_found', 'Scenario not found')
  return value
}

export const GET = route(async (_req, ctx) => {
  await requireRole(['content_editor', 'admin'])
  return json({ scenario: await getPlanning(await idOf(ctx)) })
})

export const PUT = route(async (req, ctx) => {
  const admin = await requireRole(['content_editor', 'admin'])
  const id = await idOf(ctx)
  const input = await readBody(req, planningSchema)
  await savePlanning(id, input, admin.id)
  await audit({
    userId: admin.id,
    action: 'content.planning.update',
    targetId: id,
    ip: clientIp(req),
  })
  return json({ id })
})

export const DELETE = route(async (req, ctx) => {
  const admin = await requireRole(['admin'])
  const id = await idOf(ctx)
  await deletePlanning(id)
  await audit({
    userId: admin.id,
    action: 'content.planning.delete',
    targetId: id,
    ip: clientIp(req),
  })
  return json({ ok: true })
})
