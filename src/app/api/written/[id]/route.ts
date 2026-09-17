/** GET /api/written/[id] — resume/get a written attempt. Auth: required (owner). */
import { route, requireUser, json } from '@/lib/api/handler'
import { getWrittenAttempt } from '@/lib/tests/written'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const GET = route(async (_req, ctx) => {
  const user = await requireUser()
  const { id } = await ctx.params
  const attempt = await getWrittenAttempt(user.id, String(id))
  return json({ attempt })
})
