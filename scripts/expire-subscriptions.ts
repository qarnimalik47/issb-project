/**
 * Subscription expiry job (build prompt §9: expiry & grace periods). Moves
 * past-period subscriptions into grace, then downgrades expired ones. Run on a
 * daily schedule (OS cron or /schedule routine).
 *
 *   npm run expire-subscriptions
 */
import 'dotenv/config'
import { expireDueSubscriptions } from '../src/lib/billing/subscriptions'
import { sql as rawSql } from '../src/lib/db/index'

try {
  const r = await expireDueSubscriptions()
  console.warn(`Subscriptions: graced=${r.graced} expired=${r.expired}`)
} finally {
  await rawSql.end()
}
