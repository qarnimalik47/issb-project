/**
 * Apply pending database migrations.
 *
 * Uses a dedicated single-use connection (not the app pool) and Drizzle's
 * migrator, which records applied migrations in the __drizzle_migrations table
 * so re-running is safe and idempotent.
 *
 *   npm run db:migrate
 */
import 'dotenv/config'
import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'

const url = process.env.DATABASE_URL
if (!url) {
  console.error('DATABASE_URL is not set. Copy .env.example to .env first.')
  process.exit(1)
}

const migrationClient = postgres(url, { max: 1 })

try {
  console.warn('Applying migrations from ./drizzle ...')
  await migrate(drizzle(migrationClient), { migrationsFolder: './drizzle' })
  console.warn('✓ Migrations up to date.')
} catch (err) {
  console.error('✗ Migration failed:', err)
  process.exitCode = 1
} finally {
  await migrationClient.end()
}
