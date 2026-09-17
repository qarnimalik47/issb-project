/**
 * Local CI: the single command that must pass before any phase is accepted.
 * Runs formatting check, lint, typecheck and tests in sequence, stopping at
 * the first failure (rule 1.7: no phase is complete with a failing test).
 *
 *   npm run ci
 */
import { spawnSync } from 'node:child_process'

const steps = [
  ['Format check', ['run', 'format:check']],
  ['Lint', ['run', 'lint']],
  ['Typecheck', ['run', 'typecheck']],
  ['Unit/integration tests', ['run', 'test']],
]

const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm'

for (const [name, args] of steps) {
  console.log(`\n\x1b[1m=== ${name} ===\x1b[0m`)
  const result = spawnSync(npm, args, { stdio: 'inherit' })
  if (result.status !== 0) {
    console.error(`\n\x1b[31m✗ ${name} failed. CI aborted.\x1b[0m`)
    process.exit(result.status ?? 1)
  }
}

console.log('\n\x1b[32m✓ All CI checks passed.\x1b[0m')
