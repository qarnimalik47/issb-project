/**
 * /api/admin/planning — Group Planning Exercise ("military planning") scenarios.
 *   GET  → every scenario, newest edit first. Auth: editor/admin.
 *   POST → create a scenario from a briefing, problems and model plan. Auth: editor/admin.
 */
import { route, readBody, requireRole, clientIp, json } from '@/lib/api/handler'
import { planningSchema } from '@/lib/validation/written-bank'
import { listPlanning, savePlanning } from '@/lib/content/written-bank'
import { audit } from '@/lib/audit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const GET = route(async () => {
  await requireRole(['content_editor', 'admin'])
  return json({ scenarios: await listPlanning() })
})

export const POST = route(async (req) => {
  const admin = await requireRole(['content_editor', 'admin'])
  const input = await readBody(req, planningSchema)
  const id = await savePlanning(null, input, admin.id)
  await audit({
    userId: admin.id,
    action: 'content.planning.create',
    targetId: id,
    ip: clientIp(req),
  })
  return json({ id }, { status: 201 })
})
