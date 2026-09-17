/**
 * Playwright global setup. Clears rate-limit keys (rl:*) from the project's
 * dedicated Redis DB so repeated local E2E runs — all originating from
 * 127.0.0.1 — don't trip the real per-IP limiter. Only touches rl:* keys, so
 * queue data is untouched.
 */
import 'dotenv/config'
import IORedis from 'ioredis'

export default async function globalSetup() {
  const url = process.env.REDIS_URL ?? 'redis://127.0.0.1:6379'
  const db = Number(process.env.REDIS_DB ?? 14)
  const redis = new IORedis(url, { db, maxRetriesPerRequest: 2 })
  try {
    const keys = await redis.keys('rl:*')
    if (keys.length) await redis.del(...keys)
  } finally {
    await redis.quit()
  }
}
