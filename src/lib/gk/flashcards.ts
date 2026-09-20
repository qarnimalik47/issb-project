/**
 * Flashcard scheduling using SM-2 with per-user state. New (never-seen) cards
 * are surfaced first, then cards whose due time has passed.
 */
import { and, asc, eq, lte, notInArray, sql } from 'drizzle-orm'
import { db } from '../db/index'
import { flashcards, flashcardState } from '../db/schema/gk'
import { reviewCard, nextDueAt, type Sm2State } from './sm2'

export type DueCard = {
  id: string
  deck: string
  frontEn: string
  frontUr: string | null
  backEn: string
  backUr: string | null
  isNew: boolean
}

/**
 * `deck` narrows a session to one library. With a general-knowledge deck and a
 * current-affairs deck now both filling from topics, revising everything at
 * once is rarely what a candidate wants.
 */
export async function getDueCards(userId: string, limit = 20, deck?: string): Promise<DueCard[]> {
  // Cards with a due state that has elapsed.
  const dueRows = await db
    .select({ card: flashcards })
    .from(flashcardState)
    .innerJoin(flashcards, eq(flashcardState.cardId, flashcards.id))
    .where(
      and(
        eq(flashcardState.userId, userId),
        lte(flashcardState.dueAt, new Date()),
        eq(flashcards.status, 'published'),
        ...(deck ? [eq(flashcards.deck, deck)] : []),
      ),
    )
    .orderBy(asc(flashcardState.dueAt))
    .limit(limit)

  const due: DueCard[] = dueRows.map((r) => ({ ...toCard(r.card), isNew: false }))
  if (due.length >= limit) return due

  // Fill remaining slots with brand-new cards (no state yet).
  const seen = await db
    .select({ cardId: flashcardState.cardId })
    .from(flashcardState)
    .where(eq(flashcardState.userId, userId))
  const seenIds = seen.map((s) => s.cardId)
  // Ordered oldest-first so the cards a candidate is shown are stable between
  // sessions; without an order the database may return any subset.
  const newRows = await db
    .select()
    .from(flashcards)
    .where(
      and(
        eq(flashcards.status, 'published'),
        ...(seenIds.length ? [notInArray(flashcards.id, seenIds)] : []),
        ...(deck ? [eq(flashcards.deck, deck)] : []),
      ),
    )
    .orderBy(asc(flashcards.createdAt))
    .limit(limit - due.length)

  return [...due, ...newRows.map((c) => ({ ...toCard(c), isNew: true }))]
}

function toCard(c: typeof flashcards.$inferSelect) {
  return {
    id: c.id,
    deck: c.deck,
    frontEn: c.frontEn,
    frontUr: c.frontUr,
    backEn: c.backEn,
    backUr: c.backUr,
  }
}

export async function reviewFlashcard(
  userId: string,
  cardId: string,
  quality: number,
): Promise<void> {
  const [existing] = await db
    .select()
    .from(flashcardState)
    .where(and(eq(flashcardState.userId, userId), eq(flashcardState.cardId, cardId)))
    .limit(1)

  const prev: Sm2State = existing
    ? {
        repetitions: existing.repetitions,
        intervalDays: existing.intervalDays,
        easiness: Number(existing.easiness),
      }
    : { repetitions: 0, intervalDays: 0, easiness: 2.5 }

  const next = reviewCard(prev, quality)
  const dueAt = new Date(nextDueAt(Date.now(), next.intervalDays))

  await db
    .insert(flashcardState)
    .values({
      userId,
      cardId,
      repetitions: next.repetitions,
      intervalDays: next.intervalDays,
      easiness: String(next.easiness),
      dueAt,
      lastReviewedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: [flashcardState.userId, flashcardState.cardId],
      set: {
        repetitions: next.repetitions,
        intervalDays: next.intervalDays,
        easiness: String(next.easiness),
        dueAt,
        lastReviewedAt: new Date(),
      },
    })
}

export async function dueCount(userId: string): Promise<number> {
  const [row] = await db
    .select({ n: sql<number>`count(*)`.mapWith(Number) })
    .from(flashcardState)
    .where(and(eq(flashcardState.userId, userId), lte(flashcardState.dueAt, new Date())))
  return row?.n ?? 0
}
