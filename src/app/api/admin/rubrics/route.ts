/**
 * /api/admin/rubrics
 *   GET  → list rubrics. Auth: editor/admin.
 *   POST → create a new rubric version for a test type (auto-incremented,
 *          published immediately as the active version). Auth: admin.
 * Rubrics are stored and served; content is authored with the domain expert.
 */
import { route, requireRole, readBody, clientIp, json } from '@/lib/api/handler'
import { createRubricSchema } from '@/lib/validation/content'
import { db } from '@/lib/db'
import { rubrics } from '@/lib/db/schema/content'
import { desc, eq, sql } from 'drizzle-orm'
import { audit } from '@/lib/audit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const GET = route(async () => {
  await requireRole(['content_editor', 'admin'])
  const rows = await db.select().from(rubrics).orderBy(desc(rubrics.createdAt)).limit(200)
  return json({ rubrics: rows })
})

export const POST = route(async (req) => {
  const admin = await requireRole(['admin'])
  const input = await readBody(req, createRubricSchema)

  const maxRows = await db
    .select({ maxV: sql<number>`coalesce(max(${rubrics.version}), 0)`.mapWith(Number) })
    .from(rubrics)
    .where(eq(rubrics.testTypeId, input.testTypeId))
  const maxV = maxRows[0]?.maxV ?? 0

  const [created] = await db
    .insert(rubrics)
    .values({
      testTypeId: input.testTypeId,
      version: maxV + 1,
      name: input.name,
      criteria: input.criteria,
      outputSchema: input.outputSchema,
      status: 'published',
      createdBy: admin.id,
    })
    .returning()

  await audit({
    userId: admin.id,
    action: 'content.rubric.create',
    targetId: created!.id,
    ip: clientIp(req),
  })
  return json({ rubric: created }, { status: 201 })
})
