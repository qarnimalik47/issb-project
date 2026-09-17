import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { db, sql } from '../../src/lib/db/index'
import { flashcards, flashcardState, gkArticles } from '../../src/lib/db/schema/gk'
import { users } from '../../src/lib/db/schema/identity'
import { eq } from 'drizzle-orm'
import { reviewFlashcard, getDueCards } from '../../src/lib/gk/flashcards'
import { approveArticle, listPublished } from '../../src/lib/gk/articles'

let userId: string
let cardId: string
let articleId: string

describe('GK (integration)', () => {
  beforeAll(async () => {
    const stamp = Date.now()
    const [u] = await db
      .insert(users)
      .values({ name: 'G', email: `g_${stamp}@test.com` })
      .returning({ id: users.id })
    userId = u!.id
    const [c] = await db
      .insert(flashcards)
      .values({ deck: `it_${stamp}`, frontEn: 'Q?', backEn: 'A', status: 'published' })
      .returning({ id: flashcards.id })
    cardId = c!.id
    const [a] = await db
      .insert(gkArticles)
      .values({
        headline: 'Draft item',
        summaryEn: 'draft',
        category: 'pakistan',
        sourceUrl: `https://ex.com/${stamp}`,
        status: 'draft',
      })
      .returning({ id: gkArticles.id })
    articleId = a!.id
  })

  afterAll(async () => {
    await db.delete(flashcardState).where(eq(flashcardState.userId, userId))
    await db.delete(flashcards).where(eq(flashcards.id, cardId))
    await db.delete(gkArticles).where(eq(gkArticles.id, articleId))
    await db.delete(users).where(eq(users.id, userId))
    await sql.end()
  })

  it('surfaces a new card, then persists SM-2 state after review', async () => {
    const before = await getDueCards(userId, 20)
    expect(before.some((c) => c.id === cardId && c.isNew)).toBe(true)

    await reviewFlashcard(userId, cardId, 5)
    const [state] = await db.select().from(flashcardState).where(eq(flashcardState.cardId, cardId))
    expect(state!.repetitions).toBe(1)
    expect(state!.intervalDays).toBe(1)
    expect(Number(state!.easiness)).toBeGreaterThan(2.5)

    // Reviewed card is scheduled in the future → not immediately due.
    const after = await getDueCards(userId, 20)
    expect(after.some((c) => c.id === cardId)).toBe(false)
  })

  it('editorial approval publishes an item (nothing auto-publishes)', async () => {
    const draftsPublished = await listPublished({})
    expect(draftsPublished.some((a) => a.id === articleId)).toBe(false)

    await approveArticle(articleId, userId, { summaryEn: 'An original, edited summary.' })
    const published = await listPublished({})
    const found = published.find((a) => a.id === articleId)
    expect(found?.status).toBe('published')
    expect(found?.summaryEn).toBe('An original, edited summary.')
  })
})
