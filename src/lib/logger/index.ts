/**
 * Structured JSON logger (pino).
 *
 * Rule 1.6 / rule 3: logs are structured JSON and NEVER contain secrets or full
 * user answers. Sensitive fields are redacted here as a safety net; call sites
 * must still avoid logging raw user content.
 *
 * We intentionally do NOT attach a pino "transport" (e.g. pino-pretty) inside
 * the app: transports spawn worker threads that don't bundle cleanly in
 * Next.js. Output is always JSON. For pretty local logs, pipe it:
 *   npm run dev | npx pino-pretty
 */
import pino from 'pino'
import { env } from '../env/index'

export const logger = pino({
  level: env.LOG_LEVEL,
  base: { app: 'issb', env: env.APP_ENV },
  redact: {
    paths: [
      'password',
      '*.password',
      'token',
      '*.token',
      'secret',
      '*.secret',
      'sessionSecret',
      'apiKey',
      '*.apiKey',
      'authorization',
      'req.headers.authorization',
      'req.headers.cookie',
      'headers.authorization',
      'headers.cookie',
      'DATABASE_URL',
      'REDIS_URL',
    ],
    censor: '[redacted]',
  },
  formatters: {
    level: (label) => ({ level: label }),
  },
})

/** Create a child logger scoped to a subsystem (e.g. "db", "queue", "http"). */
export function childLogger(component: string) {
  return logger.child({ component })
}
