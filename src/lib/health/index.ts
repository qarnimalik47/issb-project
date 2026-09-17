/**
 * Health checks for the application's critical dependencies.
 *
 * Split out from the route handler so it can be unit-tested and reused (e.g.
 * by the preflight script). Liveness = the process is up. Readiness = the
 * process can actually serve traffic (database + Redis reachable).
 */
import { sql } from '../db/index'
import { pingRedis } from '../redis/index'

export type DependencyCheck = {
  name: string
  ok: boolean
  latencyMs: number
  error?: string
}

export type HealthReport = {
  status: 'ok' | 'degraded'
  uptimeSeconds: number
  checks: DependencyCheck[]
}

async function timed(name: string, fn: () => Promise<unknown>): Promise<DependencyCheck> {
  const start = performance.now()
  try {
    await fn()
    return { name, ok: true, latencyMs: Math.round(performance.now() - start) }
  } catch (err) {
    return {
      name,
      ok: false,
      latencyMs: Math.round(performance.now() - start),
      error: err instanceof Error ? err.message : 'unknown error',
    }
  }
}

export function checkDatabase(): Promise<DependencyCheck> {
  return timed('database', async () => {
    await sql`select 1 as ok`
  })
}

export function checkRedis(): Promise<DependencyCheck> {
  return timed('redis', async () => {
    await pingRedis()
  })
}

/** Run all readiness checks concurrently and summarise. */
export async function healthReport(): Promise<HealthReport> {
  const checks = await Promise.all([checkDatabase(), checkRedis()])
  return {
    status: checks.every((c) => c.ok) ? 'ok' : 'degraded',
    uptimeSeconds: Math.round(process.uptime()),
    checks,
  }
}
