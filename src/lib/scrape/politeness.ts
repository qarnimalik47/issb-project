/**
 * Per-domain politeness: at most one request per domain per gap, across every
 * worker process, using a Redis key that expires after the gap. A job that
 * finds the slot taken is told how long to wait and re-queued as delayed — it
 * does not burn a retry attempt, and it never sleeps holding a worker.
 */
import { ensureRedis, redis } from '../redis/index'

/** 0 if this caller may request now; otherwise milliseconds until it may. */
export async function acquireDomainSlot(domain: string, gapMs: number): Promise<number> {
  await ensureRedis()
  const key = `scrape:slot:${domain}`
  const acquired = await redis.set(key, '1', 'PX', gapMs, 'NX')
  if (acquired === 'OK') return 0
  const ttl = await redis.pttl(key)
  return ttl > 0 ? ttl : gapMs
}
