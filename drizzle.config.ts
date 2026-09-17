/**
 * Drizzle Kit configuration (migration generation & studio).
 *
 * Migrations are versioned SQL committed to git under /drizzle. Schema is never
 * edited by hand against the database (rule: "no manual schema edits"). Run:
 *   npm run db:generate   # create a migration from schema changes
 *   npm run db:migrate    # apply pending migrations (scripts/migrate.ts)
 */
import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'

const url = process.env.DATABASE_URL
if (!url) {
  throw new Error('DATABASE_URL is not set. Copy .env.example to .env first.')
}

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/lib/db/schema/index.ts',
  out: './drizzle',
  dbCredentials: { url },
  strict: true,
  verbose: true,
})
