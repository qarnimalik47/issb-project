/**
 * GET /api/catalog/test-types — list test types with counts of PUBLISHED
 * questions available to students. Auth: public.
 */
import { route, json } from '@/lib/api/handler'
import { db } from '@/lib/db'
import { testTypes, questions } from '@/lib/db/schema/content'
import { eq, and, sql } from 'drizzle-orm'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const GET = route(async () => {
  const rows = await db
    .select({
      id: testTypes.id,
      code: testTypes.code,
      nameEn: testTypes.nameEn,
      nameUr: testTypes.nameUr,
      dimension: testTypes.dimension,
      scoringType: testTypes.scoringType,
      timing: testTypes.timing,
      sortOrder: testTypes.sortOrder,
      publishedQuestions: sql<number>`count(${questions.id})`.mapWith(Number),
    })
    .from(testTypes)
    .leftJoin(
      questions,
      and(eq(questions.testTypeId, testTypes.id), eq(questions.status, 'published')),
    )
    .groupBy(testTypes.id)
    .orderBy(testTypes.sortOrder)

  return json({ testTypes: rows })
})
