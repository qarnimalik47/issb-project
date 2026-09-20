/**
 * GET /api/gk/flashcards — due + new cards for review. Auth: required.
 * `?deck=` narrows the session to one library.
 */
import { route, requireUser, json } from '@/lib/api/handler'
import { getDueCards, dueCount } from '@/lib/gk/flashcards'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const GET = route(async (req) => {
  const user = await requireUser()
  const deck = new URL(req.url).searchParams.get('deck')?.trim() || undefined
  const [cards, due] = await Promise.all([getDueCards(user.id, 20, deck), dueCount(user.id)])
  return json({ cards, dueCount: due })
})
