/**
 * GET /api/me/profile — the cross-test personality profile with evidence,
 * contradictions, confidence and a derived study plan. Persists a snapshot for
 * progress tracking over time. Auth: required.
 */
import { route, requireUser, json } from '@/lib/api/handler'
import { computeProfile, buildStudyPlan } from '@/lib/profile/engine'
import { db } from '@/lib/db'
import { profileSnapshots } from '@/lib/db/schema/attempts'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const GET = route(async () => {
  const user = await requireUser()
  const profile = await computeProfile(user.id)
  const studyPlan = buildStudyPlan(profile, user.targetIssbDate)

  // Persist an immutable snapshot for trend tracking.
  await db.insert(profileSnapshots).values({
    userId: user.id,
    qualities: profile.qualities,
    contradictions: profile.contradictions,
    authenticity: profile.authenticity,
    confidence: String(profile.confidence.coverage),
    testsCompleted: profile.confidence.testsCompleted,
  })

  return json({ profile, studyPlan })
})
