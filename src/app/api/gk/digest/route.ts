/** GET /api/gk/digest?category=&q= — published current-affairs items. Auth: public. */
import { route, json } from '@/lib/api/handler'
import { listPublished } from '@/lib/gk/articles'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const GET = route(async (req) => {
  const url = new URL(req.url)
  const category = url.searchParams.get('category') ?? undefined
  const q = url.searchParams.get('q') ?? undefined
  const items = await listPublished({ category, q })
  return json({ items })
})
