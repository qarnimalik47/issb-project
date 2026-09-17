/** POST /api/gk/flashcards/review — grade a card (SM-2). Auth: required. */
import { route, readBody, requireUser, json } from '@/lib/api/handler'
import { z } from 'zod'
import { reviewFlashcard } from '@/lib/gk/flashcards'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const schema = z.object({ cardId: z.uuid(), quality: z.number().int().min(0).max(5) })

export const POST = route(async (req) => {
  const user = await requireUser()
  const { cardId, quality } = await readBody(req, schema)
  await reviewFlashcard(user.id, cardId, quality)
  return json({ ok: true })
})
