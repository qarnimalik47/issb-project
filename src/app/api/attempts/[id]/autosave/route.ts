/**
 * POST /api/attempts/[id]/autosave — persist partial answers + integrity events
 * (rule: a dropped connection must never lose completed responses).
 * Auth: required (owner only).
 */
import { route, readBody, requireUser, json } from '@/lib/api/handler'
import { autosaveSchema } from '@/lib/validation/tests'
import { saveAutosave } from '@/lib/tests/attempts'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const POST = route(async (req, ctx) => {
  const user = await requireUser()
  const { id } = await ctx.params
  const { answers, integrityEvent } = await readBody(req, autosaveSchema)
  await saveAutosave(user.id, String(id), answers, integrityEvent)
  return json({ ok: true })
})
