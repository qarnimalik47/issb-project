/** GET /api/admin/gk — list draft current-affairs items for editorial review. */
import { route, requireRole, json } from '@/lib/api/handler'
import { listDrafts } from '@/lib/gk/articles'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const GET = route(async () => {
  await requireRole(['content_editor', 'admin'])
  return json({ drafts: await listDrafts() })
})
