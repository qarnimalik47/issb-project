/**
 * Start the Next.js production server on a guaranteed-free port.
 * Requires a prior `npm run build`. Same port-conflict handling as dev.
 *
 *   npm run build && npm start
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
console.warn(`▶ Next.js (production) → http://${env.APP_HOST}:${port}`)

const nextBin = path.resolve(process.cwd(), 'node_modules/.bin/next')
const child = spawn(nextBin, ['start', '-p', String(port), '-H', env.APP_HOST], {
  stdio: 'inherit',
  env: { ...process.env, APP_RESOLVED_PORT: String(port) },
})
if (child.pid) writePid('prod', child.pid)
child.on('exit', (code) => {
  clearPid('prod')
  process.exit(code ?? 0)
})
