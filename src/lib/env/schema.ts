/**
 * Environment variable schema.
 *
 * This is the single source of truth for every configuration value the
 * application reads from the environment. Per non-negotiable rule 1.1 / 1.3:
 *  - configuration is never hardcoded and never guessed;
 *  - the app fails fast at startup if anything required is missing or malformed;
 *  - secrets only ever arrive through here (from a git-ignored .env file).
 *
 * Keep this file free of Node-only imports so it can be validated from any
 * server context (Next.js runtime, migration scripts, Vitest).
 */
import { z } from 'zod'

/** An optional string that treats an empty value ("") as absent. Useful for
 *  keys that are declared in .env but intentionally left blank until a later
 *  phase provides them. */
const optionalNonEmpty = z.preprocess(
  (v) => (v === '' ? undefined : v),
  z.string().min(1).optional(),
)

/** A dedicated, non-empty secret of reasonable length. */
const secret = (name: string) =>
  z
    .string({ error: `${name} is required` })
    .min(32, `${name} must be at least 32 characters (generate with: openssl rand -hex 32)`)

export const envSchema = z.object({
  // --- Runtime -------------------------------------------------------------
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  /**
   * The product's own environment concept. Production can run on the same Mac
   * Mini as development (rule 2.5) but MUST point at a separate database.
   */
  APP_ENV: z.enum(['development', 'production']).default('development'),

  // --- Network -------------------------------------------------------------
  /** Preferred port. The actual bound port is resolved at runtime with a
   *  conflict check and may differ; see src/lib/net/find-free-port.ts. */
  APP_PORT: z.coerce.number().int().min(1).max(65535).default(4310),
  /** Bind to loopback by default — this is a local, non-public machine. */
  APP_HOST: z.string().min(1).default('127.0.0.1'),
  /** Absolute base URL used for signed URLs, callbacks and E2E tests. */
  APP_BASE_URL: z.url().default('http://127.0.0.1:4310'),

  // --- Database ------------------------------------------------------------
  DATABASE_URL: z
    .url({ error: 'DATABASE_URL must be a valid postgres:// connection string' })
    .refine((v) => v.startsWith('postgres://') || v.startsWith('postgresql://'), {
      error: 'DATABASE_URL must use the postgres:// or postgresql:// scheme',
    }),
  DATABASE_POOL_MAX: z.coerce.number().int().min(1).max(100).default(10),
  /** Statement/connection timeout for the pool, in seconds. */
  DATABASE_TIMEOUT_SECONDS: z.coerce.number().int().min(1).max(120).default(15),

  // --- Redis (queue + caching; dedicated DB index, rule 2.4) ---------------
  REDIS_URL: z
    .url({ error: 'REDIS_URL must be a valid redis:// connection string' })
    .refine((v) => v.startsWith('redis://') || v.startsWith('rediss://'), {
      error: 'REDIS_URL must use the redis:// or rediss:// scheme',
    }),
  /** Dedicated Redis logical database index so other projects are unaffected. */
  REDIS_DB: z.coerce.number().int().min(0).max(15).default(14),

  // --- Storage (uploads live OUTSIDE the web root, rule 1.3) ---------------
  STORAGE_DIR: z.string().min(1).default('./storage'),
  BACKUP_DIR: z.string().min(1).default('./backups'),

  // --- Logging -------------------------------------------------------------
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),

  // --- Secrets -------------------------------------------------------------
  /** Signs web sessions (Phase 1). Declared now so config is complete. */
  SESSION_SECRET: secret('SESSION_SECRET'),

  // --- AI providers (adapters built in Phase 5; keys optional until then) --
  ANTHROPIC_API_KEY: optionalNonEmpty,
  GOOGLE_API_KEY: optionalNonEmpty,
  OPENAI_API_KEY: optionalNonEmpty,
})

export type Env = z.infer<typeof envSchema>
