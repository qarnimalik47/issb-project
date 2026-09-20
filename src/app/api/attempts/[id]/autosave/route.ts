/**
 * POST /api/attempts/[id]/autosave — persist partial answers + integrity events
 * (rule: a dropped connection must never lose completed responses).
 * Responds `{ ok, closed }`; `closed` means the attempt no longer accepts
 * writes (submitted, or past its deadline) and the client should submit.
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
  const { answers, integrityEvent, flags } = await readBody(req, autosaveSchema)
  const outcome = await saveAutosave(user.id, String(id), answers, integrityEvent, flags)
  return json({ ok: true, closed: outcome === 'closed' })
})
