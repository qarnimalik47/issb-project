/**
 * Human expert-review queue (build prompt §9). Premium users can request expert
 * review of a submission; reviewers work a queue and submit feedback + a quality
 * rating that feeds a future training dataset.
 */
import { and, desc, eq, gte, or, isNull, sql } from 'drizzle-orm'
import { db } from '../db/index'
import { expertReviews } from '../db/schema/billing'
import { ApiError } from '../api/errors'
import { getEntitlements } from './quota'

export async function requestExpertReview(
  userId: string,
  subjectType: 'attempt' | 'written_response',
  subjectId: string,
): Promise<string> {
  const ent = await getEntitlements(userId)
  if (ent.expertReviewsPerMonth <= 0) {
    throw new ApiError('quota_exceeded', 'Expert review is a Premium feature. Please upgrade.')
  }
  const monthStart = new Date()
  monthStart.setDate(1)
  monthStart.setHours(0, 0, 0, 0)
  const usedRows = await db
    .select({ used: sql<number>`count(*)`.mapWith(Number) })
    .from(expertReviews)
    .where(and(eq(expertReviews.userId, userId), gte(expertReviews.requestedAt, monthStart)))
  const used = usedRows[0]?.used ?? 0
  if (used >= ent.expertReviewsPerMonth) {
    throw new ApiError('quota_exceeded', 'You have used all expert reviews for this month.')
  }

  const [row] = await db
    .insert(expertReviews)
    .values({ userId, subjectType, subjectId, status: 'queued' })
    .returning({ id: expertReviews.id })
  return row!.id
}

export async function reviewerQueue(reviewerId: string) {
  return db
    .select()
    .from(expertReviews)
    .where(
      or(
        eq(expertReviews.status, 'queued'),
        and(eq(expertReviews.status, 'assigned'), eq(expertReviews.reviewerId, reviewerId)),
      ),
    )
    .orderBy(desc(expertReviews.requestedAt))
    .limit(50)
}

export async function claimReview(reviewId: string, reviewerId: string): Promise<void> {
  await db
    .update(expertReviews)
    .set({ status: 'assigned', reviewerId })
    .where(
      and(
        eq(expertReviews.id, reviewId),
        or(eq(expertReviews.status, 'queued'), isNull(expertReviews.reviewerId)),
      ),
    )
}

export async function submitReview(
  reviewId: string,
  reviewerId: string,
  feedback: string,
  rating: number,
): Promise<void> {
  await db
    .update(expertReviews)
    .set({
      status: 'completed',
      reviewerId,
      reviewerFeedback: feedback,
      reviewerRating: rating,
      completedAt: new Date(),
    })
    .where(eq(expertReviews.id, reviewId))
}
