/**
 * Mock interview session: builds an interview "attempt" from generated PIQ
 * questions and reuses the written-response capture + evaluation pipeline for
 * answers and feedback.
 */
import { randomUUID } from 'node:crypto'
import { and, eq } from 'drizzle-orm'
import { db } from '../db/index'
import { attempts } from '../db/schema/attempts'
import { testTypes } from '../db/schema/content'
import { users } from '../db/schema/identity'
import { ApiError } from '../api/errors'
import { isUniqueViolation } from '../db/errors'
import { getPiq } from './piq'
import { generateInterviewQuestions } from './generate'
import { getWrittenAttempt, type WrittenAttemptView } from '../tests/written'

export async function startInterview(userId: string): Promise<WrittenAttemptView> {
  const [tt] = await db.select().from(testTypes).where(eq(testTypes.code, 'interview')).limit(1)
  if (!tt) throw new ApiError('bad_request', 'Interview test type not configured')

  // Resume an in-progress interview if one exists.
  const existing = await db
    .select()
    .from(attempts)
    .where(
      and(
        eq(attempts.userId, userId),
        eq(attempts.testTypeId, tt.id),
        eq(attempts.status, 'in_progress'),
      ),
    )
    .limit(1)
  if (existing[0]) return getWrittenAttempt(userId, existing[0].id)

  const piq = await getPiq(userId)
  if (!piq) throw new ApiError('bad_request', 'Complete your PIQ before starting a mock interview')

  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1)
  const questions = generateInterviewQuestions(piq, user?.courseTrack ?? null)
  const items = questions.map((q) => ({
    ref: q.ref,
    questionId: randomUUID(), // synthetic — interview questions are generated, not banked
    prompt: q.question,
    promptUr: null,
  }))

  try {
    const [attempt] = await db
      .insert(attempts)
      .values({
        userId,
        testTypeId: tt.id,
        mode: 'typed',
        status: 'in_progress',
        config: { items, timing: {} },
      })
      .returning()
    return getWrittenAttempt(userId, attempt!.id)
  } catch (err) {
    if (isUniqueViolation(err)) {
      const [ex] = await db
        .select()
        .from(attempts)
        .where(
          and(
            eq(attempts.userId, userId),
            eq(attempts.testTypeId, tt.id),
            eq(attempts.status, 'in_progress'),
          ),
        )
        .limit(1)
      if (ex) return getWrittenAttempt(userId, ex.id)
    }
    throw err
  }
}
