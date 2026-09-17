/**
 * Redis client (ioredis).
 *
 * Uses a dedicated logical database index (env.REDIS_DB, default 14) so the
 * other projects sharing this machine's Redis are never affected (rule 2.4).
 * This connection backs the BullMQ queue (from Phase 4/5) and health checks.
 */
import Redis from 'ioredis'
import { env } from '../env/index'

const globalForRedis = globalThis as unknown as { __issbRedis?: Redis }

export const redis =
  globalForRedis.__issbRedis ??
  new Redis(env.REDIS_URL, {
    db: env.REDIS_DB,
    lazyConnect: true,
    maxRetriesPerRequest: 2,
    enableOfflineQueue: false,
    connectTimeout: 5000,
  })

if (env.NODE_ENV !== 'production') {
  globalForRedis.__issbRedis = redis
}

/** Ensure the (lazy) connection is established before issuing a command. */
export async function ensureRedis(): Promise<void> {
  const status: string = redis.status
  if (status === 'ready' || status === 'connecting' || status === 'connect') {
    return
  }
  try {
    await redis.connect()
  } catch (err) {
    // If a concurrent caller already connected, ignore the "already connecting"
    // style error; otherwise rethrow.
    const after: string = redis.status
    if (after !== 'ready' && after !== 'connecting') throw err
  }
}

/**
 * Ping Redis for a health check. Returns the round-trip result; throws on
 * failure so the caller can mark the dependency unhealthy.
 */
export async function pingRedis(): Promise<'PONG'> {
  await ensureRedis()
  return (await redis.ping()) as 'PONG'
}
