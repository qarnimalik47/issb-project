/**
 * POST /api/written/[id]/confirm-ocr — user confirms/corrects extracted text
 * before it is used (mandatory step, build prompt §4 Phase 4). Auth: owner.
 */
import { route, readBody, requireUser, json } from '@/lib/api/handler'
import { confirmOcrSchema } from '@/lib/validation/written'
import { confirmOcr } from '@/lib/tests/written'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const POST = route(async (req, ctx) => {
  const user = await requireUser()
  const { id } = await ctx.params
  const { ref, text } = await readBody(req, confirmOcrSchema)
  await confirmOcr(user.id, String(id), ref, text)
  return json({ ok: true })
})
