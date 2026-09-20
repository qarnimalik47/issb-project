/**
 * /api/admin/questions/[id]
 *   GET    → one question, with a signed preview URL for its figure. Auth: editor/admin.
 *   PATCH  → update fields / publish / unpublish. Publishing (or editing a live
 *            question) must pass the readiness check. Auth: editor/admin.
 *   DELETE → archive (soft). Auth: admin.
 */
import { route, readBody, requireRole, clientIp, json } from '@/lib/api/handler'
import { ApiError } from '@/lib/api/errors'
import { updateQuestionSchema } from '@/lib/validation/content'
import { getQuestionForEditor, updateQuestion } from '@/lib/content/questions'
import { db } from '@/lib/db'
import { questions } from '@/lib/db/schema/content'
import { eq } from 'drizzle-orm'
import { audit } from '@/lib/audit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

async function idOf(ctx: { params: Promise<Record<string, string | string[]>> }) {
  const { id } = await ctx.params
  const value = String(id)
  if (!UUID_RE.test(value)) throw new ApiError('not_found', 'Question not found')
  return value
}

export const GET = route(async (_req, ctx) => {
  await requireRole(['content_editor', 'admin'])
  const question = await getQuestionForEditor(await idOf(ctx))
  if (!question) throw new ApiError('not_found', 'Question not found')
  return json({ question })
})

export const PATCH = route(async (req, ctx) => {
  const admin = await requireRole(['content_editor', 'admin'])
  const id = await idOf(ctx)
  const patch = await readBody(req, updateQuestionSchema)
  const updated = await updateQuestion(id, patch)
  await audit({
    userId: admin.id,
    action: patch.status ? `content.question.${patch.status}` : 'content.question.update',
    targetId: id,
    ip: clientIp(req),
  })
  return json({ question: updated })
})

export const DELETE = route(async (req, ctx) => {
  const admin = await requireRole(['admin'])
  const id = await idOf(ctx)
  await db
    .update(questions)
    .set({ status: 'archived', updatedAt: new Date() })
    .where(eq(questions.id, id))
  await audit({
    userId: admin.id,
    action: 'content.question.archive',
    targetId: id,
    ip: clientIp(req),
  })
  return json({ ok: true })
})
