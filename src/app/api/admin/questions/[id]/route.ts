/**
 * /api/admin/questions/[id]
 *   PATCH  → update fields / publish / unpublish. Auth: editor/admin.
 *   DELETE → archive (soft) or hard-delete drafts. Auth: admin.
 */
import { route, readBody, requireRole, clientIp, json } from '@/lib/api/handler'
import { ApiError } from '@/lib/api/errors'
import { updateQuestionSchema } from '@/lib/validation/content'
import { db } from '@/lib/db'
import { questions } from '@/lib/db/schema/content'
import { eq } from 'drizzle-orm'
import { questionContentHash } from '@/lib/import/parse'
import { audit } from '@/lib/audit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const PATCH = route(async (req, ctx) => {
  const admin = await requireRole(['content_editor', 'admin'])
  const { id } = await ctx.params
  const patch = await readBody(req, updateQuestionSchema)

  const [existing] = await db
    .select()
    .from(questions)
    .where(eq(questions.id, String(id)))
    .limit(1)
  if (!existing) throw new ApiError('not_found', 'Question not found')

  const stemEn = patch.stemEn ?? existing.stemEn
  const options = patch.options ?? (existing.options as { textEn: string }[] | null) ?? []
  const contentHash = questionContentHash(stemEn, options)

  const [updated] = await db
    .update(questions)
    .set({
      ...patch,
      contentHash,
      version: existing.version + (patch.stemEn || patch.options ? 1 : 0),
      updatedAt: new Date(),
    })
    .where(eq(questions.id, String(id)))
    .returning()

  await audit({
    userId: admin.id,
    action: patch.status ? `content.question.${patch.status}` : 'content.question.update',
    targetId: String(id),
    ip: clientIp(req),
  })
  return json({ question: updated })
})

export const DELETE = route(async (req, ctx) => {
  const admin = await requireRole(['admin'])
  const { id } = await ctx.params
  await db
    .update(questions)
    .set({ status: 'archived', updatedAt: new Date() })
    .where(eq(questions.id, String(id)))
  await audit({
    userId: admin.id,
    action: 'content.question.archive',
    targetId: String(id),
    ip: clientIp(req),
  })
  return json({ ok: true })
})
