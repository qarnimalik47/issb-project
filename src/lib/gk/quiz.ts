/**
 * Auto-generate quiz questions from APPROVED current-affairs items (build prompt
 * §4.5). Generated questions land as DRAFTS in the GK question bank and must be
 * reviewed/published by an admin before students see them — nothing is
 * auto-published. Deterministic generation (a real AI provider can replace this
 * behind the same function).
 */
import { and, desc, eq } from 'drizzle-orm'
import { db } from '../db/index'
import { gkArticles } from '../db/schema/gk'
import { questions, testTypes } from '../db/schema/content'
import { questionContentHash } from '../import/parse'

const CATEGORIES = ['pakistan', 'defence', 'international', 'economy', 'scitech', 'sports']

export async function generateGkQuizFromArticles(limit = 10): Promise<{ created: number }> {
  const [gk] = await db.select().from(testTypes).where(eq(testTypes.code, 'gk')).limit(1)
  if (!gk) return { created: 0 }

  const articles = await db
    .select()
    .from(gkArticles)
    .where(eq(gkArticles.status, 'published'))
    .orderBy(desc(gkArticles.publishedDate), desc(gkArticles.createdAt))
    .limit(limit)

  let created = 0
  for (const a of articles) {
    const stemEn = `Current affairs: which category does this relate to — "${a.headline}"?`
    const distractors = CATEGORIES.filter((c) => c !== a.category).slice(0, 3)
    const optionValues = [a.category, ...distractors]
    // Deterministic order to keep the correct option position stable per item.
    const options = optionValues.map((v, i) => ({ key: String.fromCharCode(65 + i), textEn: v }))
    const correctOption = options.find((o) => o.textEn === a.category)!.key
    const contentHash = questionContentHash(stemEn, options)

    const res = await db
      .insert(questions)
      .values({
        testTypeId: gk.id,
        stemEn,
        options,
        correctOption,
        explanationEn:
          `This item is categorised under "${a.category}". ${a.issbAngle ?? ''}`.trim(),
        topic: 'current-affairs',
        contentHash,
        status: 'draft', // requires admin review before publication
      })
      .onConflictDoNothing({ target: questions.contentHash })
      .returning({ id: questions.id })
    if (res[0]) created++
  }
  return { created }
}
