/** POST /api/written/[id]/save — autosave a typed response. Auth: required (owner). */
import { route, readBody, requireUser, json } from '@/lib/api/handler'
import { saveWrittenSchema } from '@/lib/validation/written'
import { saveWritten } from '@/lib/tests/written'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const POST = route(async (req, ctx) => {
  const user = await requireUser()
  const { id } = await ctx.params
  const { ref, text, timingMeta } = await readBody(req, saveWrittenSchema)
  await saveWritten(user.id, String(id), ref, text, timingMeta)
  return json({ ok: true })
})
