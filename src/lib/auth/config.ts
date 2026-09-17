/**
 * Auth-related constants (durations, cookie name, lockout policy).
 */
export const SESSION_COOKIE = 'issb_session'
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30 // 30 days
export const REFRESH_TTL_SECONDS = 60 * 60 * 24 * 60 // 60 days (mobile)
export const ACCESS_TOKEN_TTL_SECONDS = 60 * 15 // 15 min (mobile JWT)

export const OTP_TTL_SECONDS = 60 * 10 // 10 min
export const OTP_MAX_ATTEMPTS = 5

// Account lockout on repeated login failures.
export const LOGIN_MAX_FAILURES = 5
export const LOGIN_LOCK_SECONDS = 60 * 15 // 15 min

export const TERMS_VERSION = '2026-09-01'
export const PRIVACY_VERSION = '2026-09-01'
