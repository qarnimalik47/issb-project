/**
 * Validate environment configuration and print a redacted summary.
 * Importing the env module runs full Zod validation and exits non-zero on
 * failure (fail fast). Runs before build/start.
 */
import 'dotenv/config'
import { env } from '../src/lib/env/index'

console.warn('✓ Environment configuration valid.')
console.warn(`  APP_ENV=${env.APP_ENV}  NODE_ENV=${env.NODE_ENV}  LOG_LEVEL=${env.LOG_LEVEL}`)
console.warn(`  Preferred port: ${env.APP_PORT}  Host: ${env.APP_HOST}`)
console.warn(`  Redis DB index: ${env.REDIS_DB}`)
const providers = [
  env.ANTHROPIC_API_KEY && 'anthropic',
  env.GOOGLE_API_KEY && 'google',
  env.OPENAI_API_KEY && 'openai',
].filter(Boolean)
console.warn(
  `  AI provider keys present: ${providers.length ? providers.join(', ') : '(none yet)'}`,
)
