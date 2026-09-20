/**
 * Close timed MCQ attempts left in progress past their deadline: score what
 * was autosaved in time, or mark them abandoned if nothing was answered.
 * Resuming a test already does this lazily; this keeps history and analytics
 * honest for students who never come back. Run on a schedule (OS cron or
 * /schedule routine), e.g. hourly.
 *
 *   npm run sweep-attempts
 */
import 'dotenv/config'
import { sweepExpiredAttempts } from '../src/lib/tests/attempts'
import { sql as rawSql } from '../src/lib/db/index'

try {
  const closed = await sweepExpiredAttempts()
  console.warn(`Attempts: closed=${closed}`)
} finally {
  await rawSql.end()
}
