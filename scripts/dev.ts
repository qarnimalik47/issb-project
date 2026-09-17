/**
 * Start the Next.js dev server on a guaranteed-free port.
 *
 * Resolves the actual bind port through the port-conflict utility (rule 2.3):
 * never assumes APP_PORT is free, never kills whatever holds it, and reports
 * the chosen port clearly.
 *
 *   npm run dev
 */
import 'dotenv/config'
import { spawn } from 'node:child_process'
import path from 'node:path'
import { env } from '../src/lib/env/index'
import { findFreePort } from './lib/ports'
import { writePid, clearPid } from './lib/pidfile'

const { port, changed } = await findFreePort(env.APP_PORT, { host: env.APP_HOST })
if (changed) {
  console.warn(`⚠ Preferred port ${env.APP_PORT} is busy — using free port ${port} instead.`)
}
console.warn(`▶ Next.js (dev) → http://${env.APP_HOST}:${port}`)

const nextBin = path.resolve(process.cwd(), 'node_modules/.bin/next')
const child = spawn(nextBin, ['dev', '-p', String(port), '-H', env.APP_HOST], {
  stdio: 'inherit',
  env: { ...process.env, APP_RESOLVED_PORT: String(port) },
})
if (child.pid) writePid('dev', child.pid)
child.on('exit', (code) => {
  clearPid('dev')
  process.exit(code ?? 0)
})
