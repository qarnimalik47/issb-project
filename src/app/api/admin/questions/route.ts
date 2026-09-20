/**
 * /api/admin/questions
 *   GET  → paginated list (filters: testTypeId, status, topic, difficulty,
 *          q = text search, missingUrdu). Auth: editor/admin.
 *   POST → create a question (always as a draft). Auth: editor/admin.
 */
import { route, readBody, requireRole, clientIp, json } from '@/lib/api/handler'
import { createQuestionSchema, listQuestionsSchema } from '@/lib/validation/content'
import { createQuestion, listQuestions } from '@/lib/content/questions'
import { audit } from '@/lib/audit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const GET = route(async (req) => {
  await requireRole(['content_editor', 'admin'])
  const url = new URL(req.url)
  const filters = listQuestionsSchema.parse(Object.fromEntries(url.searchParams))
  return json(await listQuestions(filters))
})

export const POST = route(async (req) => {
  const admin = await requireRole(['content_editor', 'admin'])
  const input = await readBody(req, createQuestionSchema)
  const created = await createQuestion(input, admin.id)
  await audit({
    userId: admin.id,
    action: 'content.question.create',
    targetId: created.id,
    ip: clientIp(req),
  })
  return json({ question: created }, { status: 201 })
})
