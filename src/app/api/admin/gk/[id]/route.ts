/**
 * POST /api/admin/gk/[id] — approve (with optional edits) or reject a draft
 * current-affairs item. Nothing publishes without this human step (§4.5).
 */
import { route, readBody, requireRole, clientIp, json } from '@/lib/api/handler'
import { z } from 'zod'
import { approveArticle, rejectArticle } from '@/lib/gk/articles'
import { audit } from '@/lib/audit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const schema = z.object({
  action: z.enum(['approve', 'reject']),
  edits: z
    .object({
      summaryEn: z.string().max(2000).optional(),
      summaryUr: z.string().max(2000).optional(),
      issbAngle: z.string().max(1000).optional(),
      oneLiner: z.string().max(500).optional(),
      category: z.string().max(40).optional(),
    })
    .optional(),
})

export const POST = route(async (req, ctx) => {
  const admin = await requireRole(['content_editor', 'admin'])
  const { id } = await ctx.params
  const { action, edits } = await readBody(req, schema)
  if (action === 'approve') {
    await approveArticle(String(id), admin.id, edits)
    await audit({
      userId: admin.id,
      action: 'gk.article.approve',
      targetId: String(id),
      ip: clientIp(req),
    })
  } else {
    await rejectArticle(String(id))
    await audit({
      userId: admin.id,
      action: 'gk.article.reject',
      targetId: String(id),
      ip: clientIp(req),
    })
  }
  return json({ ok: true })
})
