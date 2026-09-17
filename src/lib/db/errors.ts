/**
 * Database error helpers. Drizzle wraps the underlying postgres.js error, so
 * the SQLSTATE code may live on `err` OR on `err.cause`. These helpers unwrap
 * both so callers reliably detect constraint violations.
 */
function extractCode(err: unknown): string | undefined {
  if (err && typeof err === 'object') {
    const e = err as { code?: unknown; cause?: unknown }
    if (typeof e.code === 'string') return e.code
    if (e.cause) return extractCode(e.cause)
  }
  return undefined
}

function extractConstraint(err: unknown): string | undefined {
  if (err && typeof err === 'object') {
    const e = err as { constraint_name?: unknown; constraint?: unknown; cause?: unknown }
    const c = e.constraint_name ?? e.constraint
    if (typeof c === 'string') return c
    if (e.cause) return extractConstraint(e.cause)
  }
  return undefined
}

/** True for a unique-constraint violation (SQLSTATE 23505), optionally on a
 *  specific constraint/index name. */
export function isUniqueViolation(err: unknown, constraint?: string): boolean {
  if (extractCode(err) !== '23505') return false
  if (!constraint) return true
  return extractConstraint(err) === constraint
}
