/**
 * Route-handler toolkit. Every API route composes these so that auth,
 * authorisation, input validation, rate limiting and error shaping are explicit
 * and consistent (rule 1.3: every route declares its authN/authZ; default deny).
 */
import { NextResponse } from 'next/server'
import type { z } from 'zod'
import { ZodError } from 'zod'
import { ApiError } from './errors'
import { getCurrentUser } from '../auth/session'
import type { User } from '../db/schema/identity'
import { rateLimit } from '../ratelimit/index'
import { childLogger } from '../logger/index'

const log = childLogger('http')

export function json(data: unknown, init?: ResponseInit): NextResponse {
  return NextResponse.json(data, init)
}

/** Best-effort client IP from proxy headers, falling back to a placeholder. */
export function clientIp(req: Request): string {
  const xf = req.headers.get('x-forwarded-for')
  if (xf) return xf.split(',')[0]!.trim()
  return req.headers.get('x-real-ip') ?? '127.0.0.1'
}

/** Parse + validate a JSON body against a Zod schema (throws 422 on failure). */
export async function readBody<T>(req: Request, schema: z.ZodType<T>): Promise<T> {
  let raw: unknown
  try {
    raw = await req.json()
  } catch {
    throw new ApiError('bad_request', 'Request body must be valid JSON')
  }
  const parsed = schema.safeParse(raw)
  if (!parsed.success) {
    throw new ApiError('validation_failed', 'Validation failed', {
      details: parsed.error.issues.map((i) => ({
        path: i.path.join('.'),
        message: i.message,
      })),
    })
  }
  return parsed.data
}

/** Require an authenticated user (throws 401). */
export async function requireUser(): Promise<User> {
  const user = await getCurrentUser()
  if (!user) throw new ApiError('unauthorized', 'Authentication required')
  return user
}

/** Require an authenticated user with one of the given roles (throws 401/403). */
export async function requireRole(roles: User['role'][]): Promise<User> {
  const user = await requireUser()
  if (!roles.includes(user.role)) {
    throw new ApiError('forbidden', 'You do not have access to this resource')
  }
  return user
}

/** Enforce a rate limit; throws 429 with Retry-After when exceeded. */
export async function enforceRateLimit(
  key: string,
  limit: number,
  windowSeconds: number,
): Promise<void> {
  const result = await rateLimit(key, limit, windowSeconds)
  if (!result.ok) {
    throw new ApiError('rate_limited', 'Too many requests. Please slow down.', {
      headers: { 'retry-after': String(result.resetSeconds) },
    })
  }
}

type Handler = (
  req: Request,
  ctx: { params: Promise<Record<string, string | string[]>> },
) => Promise<Response>

/**
 * Wrap a route handler so thrown ApiErrors / ZodErrors / unknown errors become
 * safe JSON responses. Unexpected errors are logged with a ref and never leak.
 */
export function route(fn: Handler): Handler {
  return async (req, ctx) => {
    try {
      return await fn(req, ctx)
    } catch (err) {
      if (err instanceof ApiError) {
        return NextResponse.json(
          { error: { code: err.code, message: err.message, details: err.details } },
          { status: err.status, headers: err.headers },
        )
      }
      if (err instanceof ZodError) {
        return NextResponse.json(
          {
            error: {
              code: 'validation_failed',
              message: 'Validation failed',
              details: err.issues.map((i) => ({ path: i.path.join('.'), message: i.message })),
            },
          },
          { status: 422 },
        )
      }
      const ref = crypto.randomUUID()
      log.error({ err, ref, url: req.url }, 'unhandled route error')
      return NextResponse.json(
        { error: { code: 'server_error', message: 'An unexpected error occurred', ref } },
        { status: 500 },
      )
    }
  }
}
