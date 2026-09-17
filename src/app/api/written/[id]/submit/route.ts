/** POST /api/written/[id]/submit — finalise the written attempt. Auth: owner. */
import { route, requireUser, json } from '@/lib/api/handler'
import { submitWrittenAttempt } from '@/lib/tests/written'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const POST = route(async (_req, ctx) => {
  const user = await requireUser()
  const { id } = await ctx.params
  await submitWrittenAttempt(user.id, String(id))
  return json({ ok: true })
})
