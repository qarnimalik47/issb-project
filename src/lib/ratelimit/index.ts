/**
 * Redis-backed fixed-window rate limiter (rule 1.4 / 1.3: rate limit every
 * public and AI-invoking endpoint). Keyed per identity+action so limits are
 * independent. Fails OPEN only for infrastructure errors is NOT acceptable for
 * security-sensitive limits, so callers decide; by default we fail CLOSED on a
 * Redis error for auth endpoints.
 */
import { redis, ensureRedis } from '../redis/index'

export type RateLimitResult = {
  ok: boolean
  remaining: number
  limit: number
  resetSeconds: number
}

/**
 * @param key           unique bucket, e.g. `login:ip:1.2.3.4` or `otp:user:<id>`
 * @param limit         max requests allowed in the window
 * @param windowSeconds window size in seconds
 */
export async function rateLimit(
  key: string,
  limit: number,
  windowSeconds: number,
): Promise<RateLimitResult> {
  await ensureRedis()
  const redisKey = `rl:${key}`
  const count = await redis.incr(redisKey)
  if (count === 1) {
    await redis.expire(redisKey, windowSeconds)
  }
  let ttl = await redis.ttl(redisKey)
  if (ttl < 0) ttl = windowSeconds
  return {
    ok: count <= limit,
    remaining: Math.max(0, limit - count),
    limit,
    resetSeconds: ttl,
  }
}

/** Clear a bucket (e.g. after a successful login resets the failure counter). */
export async function resetRateLimit(key: string): Promise<void> {
  await ensureRedis()
  await redis.del(`rl:${key}`)
}
