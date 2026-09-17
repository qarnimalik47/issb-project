/**
 * GET /api/dev/last-otp — development-only helper that returns the last OTP
 * issued to the current user, so tests and local flows can complete OTP steps
 * without a real email/SMS provider. Returns 404 in production.
 */
import { route, requireUser, json } from '@/lib/api/handler'
import { ApiError } from '@/lib/api/errors'
import { getLastDevOtp } from '@/lib/notify'
import { isProduction } from '@/lib/env'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const GET = route(async () => {
  if (isProduction) throw new ApiError('not_found', 'Not found')
  const user = await requireUser()
  const code = await getLastDevOtp(user.id)
  return json({ code })
})
