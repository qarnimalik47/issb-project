/**
 * Vitest global setup. Loads .env, then redirects the database to the dedicated
 * `issb_test` database so integration tests never touch development data. This
 * runs before any test file (and before the env module reads process.env).
 */
import 'dotenv/config'

const overrides = process.env as Record<string, string>
if (process.env.DATABASE_URL) {
  // Swap the database name to the test database.
  overrides.DATABASE_URL = process.env.DATABASE_URL.replace(/\/issb_dev(\b|\?|$)/, '/issb_test$1')
}
overrides.APP_ENV = 'development'
