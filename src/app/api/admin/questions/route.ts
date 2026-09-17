/**
 * /api/admin/questions
 *   GET  → paginated list (filters: testTypeId, status, topic). Auth: editor/admin.
 *   POST → create a question (draft). Auth: editor/admin.
 */
import { route, readBody, requireRole, clientIp, json } from '@/lib/api/handler'
import { createQuestionSchema, listQuestionsSchema } from '@/lib/validation/content'
import { db } from '@/lib/db'
import { questions } from '@/lib/db/schema/content'
import { and, eq, desc, sql } from 'drizzle-orm'
import { questionContentHash } from '@/lib/import/parse'
import { audit } from '@/lib/audit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const GET = route(async (req) => {
  await requireRole(['content_editor', 'admin'])
  const url = new URL(req.url)
  const q = listQuestionsSchema.parse(Object.fromEntries(url.searchParams))

  const conds = []
  if (q.testTypeId) conds.push(eq(questions.testTypeId, q.testTypeId))
  if (q.status) conds.push(eq(questions.status, q.status))
  if (q.topic) conds.push(eq(questions.topic, q.topic))
  const where = conds.length ? and(...conds) : undefined

  const [rows, countRows] = await Promise.all([
    db
      .select()
      .from(questions)
      .where(where)
      .orderBy(desc(questions.createdAt))
      .limit(q.pageSize)
      .offset((q.page - 1) * q.pageSize),
    db
      .select({ total: sql<number>`count(*)`.mapWith(Number) })
      .from(questions)
      .where(where),
  ])

  return json({
    questions: rows,
    page: q.page,
    pageSize: q.pageSize,
    total: countRows[0]?.total ?? 0,
  })
})

export const POST = route(async (req) => {
  const admin = await requireRole(['content_editor', 'admin'])
  const input = await readBody(req, createQuestionSchema)
  const contentHash = questionContentHash(input.stemEn, input.options ?? [])

  const [created] = await db
    .insert(questions)
    .values({
      testTypeId: input.testTypeId,
      bankId: input.bankId,
      stemEn: input.stemEn,
      stemUr: input.stemUr,
      options: input.options,
      correctOption: input.correctOption,
      explanationEn: input.explanationEn,
      explanationUr: input.explanationUr,
      difficulty: input.difficulty,
      topic: input.topic,
      contentHash,
      status: 'draft',
      createdBy: admin.id,
    })
    .onConflictDoNothing({ target: questions.contentHash })
    .returning()

  if (!created) {
    return json({ error: { code: 'conflict', message: 'Duplicate question' } }, { status: 409 })
  }
  await audit({
    userId: admin.id,
    action: 'content.question.create',
    targetId: created.id,
    ip: clientIp(req),
  })
  return json({ question: created }, { status: 201 })
})
