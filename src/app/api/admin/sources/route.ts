/**
 * /api/admin/sources — the scraper's allow-list, as seen by admins.
 *   GET  → sources with their share of the live bank, plus the environment gate
 *          (whether scraping is switched on, and which domains it permits).
 *   POST → add a source. New sources start DISABLED. Auth: admin.
 */
import { route, readBody, requireRole, clientIp, json } from '@/lib/api/handler'
import { createSourceSchema } from '@/lib/validation/content'
import { createSource, listSources } from '@/lib/scrape/service'
import { scrapeConfig } from '@/lib/scrape/policy'
import { audit } from '@/lib/audit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const GET = route(async () => {
  await requireRole(['admin'])
  return json({ sources: await listSources(), config: scrapeConfig() })
})

export const POST = route(async (req) => {
  const admin = await requireRole(['admin'])
  const input = await readBody(req, createSourceSchema)
  const source = await createSource(input, admin.id)
  await audit({
    userId: admin.id,
    action: 'content.source.create',
    targetId: source.id,
    ip: clientIp(req),
    metadata: { domain: source.domain, licence: source.licence },
  })
  return json({ source }, { status: 201 })
})
