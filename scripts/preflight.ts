/**
 * Preflight: verify env config and that critical dependencies (Postgres, Redis)
 * are reachable before starting the app. Exits non-zero if anything is down.
 *
 *   npm run preflight
 */
import 'dotenv/config'
import { healthReport } from '../src/lib/health/index'

const report = await healthReport()
for (const c of report.checks) {
  const mark = c.ok ? '✓' : '✗'
  const detail = c.ok ? `${c.latencyMs}ms` : (c.error ?? 'failed')
  console.warn(`  ${mark} ${c.name}: ${detail}`)
}

if (report.status === 'ok') {
  console.warn('✓ Preflight passed — all dependencies reachable.')
  process.exit(0)
} else {
  console.error('✗ Preflight failed — a required dependency is unreachable.')
  console.error(
    '  Is Postgres running? Is Redis running? Did you run: npm run db:setup && npm run db:migrate',
  )
  process.exit(1)
}
