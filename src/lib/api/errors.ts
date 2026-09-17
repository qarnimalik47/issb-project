/**
 * Typed API errors. Handlers throw these; the route wrapper turns them into
 * safe JSON responses. User-facing messages never leak internals (rule 1.3).
 */
export type ApiErrorCode =
  | 'bad_request'
  | 'validation_failed'
  | 'unauthorized'
  | 'forbidden'
  | 'not_found'
  | 'conflict'
  | 'rate_limited'
  | 'quota_exceeded'
  | 'server_error'

const STATUS: Record<ApiErrorCode, number> = {
  bad_request: 400,
  validation_failed: 422,
  unauthorized: 401,
  forbidden: 403,
  not_found: 404,
  conflict: 409,
  rate_limited: 429,
  quota_exceeded: 402,
  server_error: 500,
}

export class ApiError extends Error {
  readonly code: ApiErrorCode
  readonly status: number
  readonly details?: unknown
  readonly headers?: Record<string, string>

  constructor(
    code: ApiErrorCode,
    message: string,
    opts?: { details?: unknown; headers?: Record<string, string> },
  ) {
    super(message)
    this.code = code
    this.status = STATUS[code]
    this.details = opts?.details
    this.headers = opts?.headers
  }
}

export const badRequest = (m = 'Bad request') => new ApiError('bad_request', m)
export const unauthorized = (m = 'Authentication required') => new ApiError('unauthorized', m)
export const forbidden = (m = 'You do not have access to this resource') =>
  new ApiError('forbidden', m)
export const notFound = (m = 'Not found') => new ApiError('not_found', m)
export const conflict = (m = 'Conflict') => new ApiError('conflict', m)
