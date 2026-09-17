/** POST /api/gk/bookmark — toggle a bookmark on an article. Auth: required. */
import { route, readBody, requireUser, json } from '@/lib/api/handler'
import { z } from 'zod'
import { toggleBookmark } from '@/lib/gk/articles'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const POST = route(async (req) => {
  const user = await requireUser()
  const { articleId } = await readBody(req, z.object({ articleId: z.uuid() }))
  const bookmarked = await toggleBookmark(user.id, articleId)
  return json({ bookmarked })
})
