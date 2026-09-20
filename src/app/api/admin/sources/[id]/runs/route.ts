/**
 * POST /api/admin/sources/[id]/runs — queue a scrape of specific pages on an
 * enabled source { urls, testTypeId? }. Each page is fetched by the worker,
 * subject to both allow-list gates, robots.txt and per-domain politeness.
 * Auth: admin.
 */
import { route, readBody, requireRole, clientIp, json } from '@/lib/api/handler'
import { ApiError } from '@/lib/api/errors'
import { scrapeRunSchema } from '@/lib/validation/content'
import { createScrapeRun } from '@/lib/scrape/service'
import { audit } from '@/lib/audit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export const POST = route(async (req, ctx) => {
  const admin = await requireRole(['admin'])
  const { id } = await ctx.params
  if (!UUID_RE.test(String(id))) throw new ApiError('not_found', 'Source not found')
  const { urls, testTypeId } = await readBody(req, scrapeRunSchema)
  const run = await createScrapeRun({ sourceId: String(id), urls, testTypeId, userId: admin.id })
  await audit({
    userId: admin.id,
    action: 'content.scrape.run',
    targetId: run.batchId,
    ip: clientIp(req),
    metadata: { sourceId: String(id), documents: run.documents },
  })
  return json(run, { status: 202 })
})
