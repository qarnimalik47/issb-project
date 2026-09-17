/** GET /api/gk/flashcards — due + new cards for review. Auth: required. */
import { route, requireUser, json } from '@/lib/api/handler'
import { getDueCards, dueCount } from '@/lib/gk/flashcards'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const GET = route(async () => {
  const user = await requireUser()
  const [cards, due] = await Promise.all([getDueCards(user.id, 20), dueCount(user.id)])
  return json({ cards, dueCount: due })
})
