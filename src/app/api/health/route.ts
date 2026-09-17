/**
 * GET /api/health — liveness + readiness probe.
 *
 * Returns 200 when the app and all critical dependencies (Postgres, Redis) are
 * reachable, 503 when any dependency is down. Used by the start scripts and by
 * operators. Runs on the Node.js runtime because it touches the DB and Redis.
 */
import { NextResponse } from 'next/server'
import { healthReport } from '@/lib/health'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const report = await healthReport()
  return NextResponse.json(report, {
    status: report.status === 'ok' ? 200 : 503,
    headers: { 'cache-control': 'no-store' },
  })
}
