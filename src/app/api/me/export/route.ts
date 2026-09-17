/**
 * GET /api/me/export — download all of the current user's data as JSON
 * (rule 4.8: users can export their data). Auth: required.
 */
import { route, requireUser, clientIp } from '@/lib/api/handler'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { consents } from '@/lib/db/schema/identity'
import {
  attempts,
  mcqResponses,
  writtenResponses,
  evaluations,
  profileSnapshots,
} from '@/lib/db/schema/attempts'
import { eq, inArray } from 'drizzle-orm'
import { toPublicUser } from '@/lib/auth/serialize'
import { audit } from '@/lib/audit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const GET = route(async (req) => {
  const user = await requireUser()

  const [userConsents, userAttempts, userEvaluations, userProfiles] = await Promise.all([
    db.select().from(consents).where(eq(consents.userId, user.id)),
    db.select().from(attempts).where(eq(attempts.userId, user.id)),
    db.select().from(evaluations).where(eq(evaluations.userId, user.id)),
    db.select().from(profileSnapshots).where(eq(profileSnapshots.userId, user.id)),
  ])

  const attemptIds = userAttempts.map((a) => a.id)
  const [mcq, written] =
    attemptIds.length > 0
      ? await Promise.all([
          db.select().from(mcqResponses).where(inArray(mcqResponses.attemptId, attemptIds)),
          db.select().from(writtenResponses).where(inArray(writtenResponses.attemptId, attemptIds)),
        ])
      : [[], []]

  await audit({ userId: user.id, action: 'account.export', ip: clientIp(req) })

  const payload = {
    exportedAt: new Date().toISOString(),
    profile: toPublicUser(user),
    consents: userConsents,
    attempts: userAttempts,
    mcqResponses: mcq,
    writtenResponses: written,
    evaluations: userEvaluations,
    profileSnapshots: userProfiles,
  }

  return new NextResponse(JSON.stringify(payload, null, 2), {
    status: 200,
    headers: {
      'content-type': 'application/json',
      'content-disposition': `attachment; filename="issb-data-export-${user.id}.json"`,
      'cache-control': 'no-store',
    },
  })
})
