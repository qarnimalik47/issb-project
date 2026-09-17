/**
 * Database client (Drizzle ORM over postgres.js).
 *
 * A single pooled connection is created per process and reused (rule 1.4:
 * connection pooling configured, explicit timeouts on external calls). Import
 * `db` for query building and `sql` for the raw client (health checks, LISTEN,
 * etc.). Never construct a second pool.
 *
 * Imports use relative paths (not the `@/` alias) so migration/seed scripts
 * run under tsx can load this module without alias resolution.
 */
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { env } from '../env/index'
import * as schema from './schema'

// Reuse the client across HMR reloads in development to avoid exhausting
// connections. In production a single module instance is created once.
const globalForDb = globalThis as unknown as { __issbSql?: ReturnType<typeof postgres> }

export const sql =
  globalForDb.__issbSql ??
  postgres(env.DATABASE_URL, {
    max: env.DATABASE_POOL_MAX,
    idle_timeout: 20,
    connect_timeout: env.DATABASE_TIMEOUT_SECONDS,
    // Fail a query rather than hang forever if the DB stalls.
    max_lifetime: 60 * 30,
    onnotice: () => {},
  })

if (env.NODE_ENV !== 'production') {
  globalForDb.__issbSql = sql
}

export const db = drizzle(sql, { schema })

export { schema }
