/** GET /api/admin/audit — the audit trail, filterable by actor or action. Auth: admin. */
import { route, requireRole, json } from '@/lib/api/handler'
import { auditTrail } from '@/lib/admin/system'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const GET = route(async (req) => {
  await requireRole(['admin'])
  const p = new URL(req.url).searchParams
  return json(
    await auditTrail({
      q: p.get('q')?.trim() || undefined,
      action: p.get('action') || undefined,
      limit: Number(p.get('limit') ?? 50) || 50,
      offset: Number(p.get('offset') ?? 0) || 0,
    }),
  )
})
