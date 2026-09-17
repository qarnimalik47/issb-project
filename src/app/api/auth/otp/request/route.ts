/**
 * POST /api/auth/otp/request — (re)send a verification OTP to the logged-in
 * user's email or phone. Auth: required. Rate limited per user.
 */
import { route, readBody, requireUser, enforceRateLimit, clientIp, json } from '@/lib/api/handler'
import { ApiError } from '@/lib/api/errors'
import { otpRequestSchema } from '@/lib/validation/auth'
import { issueOtp } from '@/lib/auth/otp'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const POST = route(async (req) => {
  const user = await requireUser()
  const { purpose } = await readBody(req, otpRequestSchema)
  await enforceRateLimit(`otp:user:${user.id}`, 5, 900)

  if (purpose === 'verify_email') {
    await issueOtp({ userId: user.id, channel: 'email', purpose, to: user.email })
  } else if (purpose === 'verify_phone') {
    if (!user.phone) throw new ApiError('bad_request', 'No phone number on file')
    await issueOtp({ userId: user.id, channel: 'phone', purpose, to: user.phone })
  } else {
    throw new ApiError('bad_request', 'Unsupported purpose for this endpoint')
  }

  return json({ ok: true })
})
