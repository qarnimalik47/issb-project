/** POST /api/written — start (or resume) a written test attempt. Auth: required. */
import { route, readBody, requireUser, enforceRateLimit, json } from '@/lib/api/handler'
import { startWrittenSchema } from '@/lib/validation/written'
import { startWrittenAttempt } from '@/lib/tests/written'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const POST = route(async (req) => {
  const user = await requireUser()
  await enforceRateLimit(`written-start:${user.id}`, 30, 3600)
  const { testTypeId, mode } = await readBody(req, startWrittenSchema)
  const attempt = await startWrittenAttempt(user.id, testTypeId, mode)
  return json({ attempt }, { status: 201 })
})
