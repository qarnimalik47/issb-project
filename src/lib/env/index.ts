/**
 * Validated, typed access to environment configuration.
 *
 * Import `env` anywhere on the server to read configuration. Validation runs
 * exactly once, on first import, and FAILS FAST with a human-readable report
 * listing every missing/invalid variable (rule 1.1 fail-fast, rule 1.3).
 *
 * Note: this module does NOT load the .env file itself. Next.js injects env
 * vars automatically; standalone scripts and Vitest load `.env` before
 * importing this module (see scripts/_bootstrap.ts and vitest.setup.ts).
 */
import { envSchema, type Env } from './schema'

function formatIssues(error: import('zod').ZodError): string {
  const lines = error.issues.map((issue) => {
    const path = issue.path.length > 0 ? issue.path.join('.') : '(root)'
    return `  • ${path}: ${issue.message}`
  })
  return lines.join('\n')
}

let cached: Env | null = null

function loadEnv(): Env {
  const parsed = envSchema.safeParse(process.env)
  if (!parsed.success) {
    const report =
      '\n[31m✗ Invalid environment configuration[0m\n' +
      formatIssues(parsed.error) +
      '\n\nFix your .env file (copy .env.example) and try again.\n'
    // Surface the full report, then throw so nothing runs with bad config.
    console.error(report)
    throw new Error('Invalid environment configuration — see the report above.')
  }

  // Cross-field safety: never let a "production" app point at an obvious dev DB.
  const value = parsed.data
  if (value.APP_ENV === 'production' && /_dev(\b|_|$)/.test(value.DATABASE_URL)) {
    throw new Error(
      'Refusing to start: APP_ENV=production but DATABASE_URL looks like a development database (contains "_dev").',
    )
  }

  return value
}

export const env: Env = (cached ??= loadEnv())

/** True when running the product's production configuration. */
export const isProduction = env.APP_ENV === 'production'
/** True in local development. */
export const isDevelopment = env.APP_ENV === 'development'
