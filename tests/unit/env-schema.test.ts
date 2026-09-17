import { describe, it, expect } from 'vitest'
import { envSchema } from '../../src/lib/env/schema'

/**
 * Unit tests for the environment schema. These lock in the fail-fast contract:
 * required fields, sane defaults, and the "empty string means absent" rule for
 * optional AI keys.
 */
const base = {
  DATABASE_URL: 'postgresql://issb_app:pw@127.0.0.1:5432/issb_dev',
  REDIS_URL: 'redis://127.0.0.1:6379',
  SESSION_SECRET: 'x'.repeat(32),
}

describe('envSchema', () => {
  it('accepts a minimal valid configuration and applies defaults', () => {
    const parsed = envSchema.parse(base)
    expect(parsed.APP_PORT).toBe(4310)
    expect(parsed.REDIS_DB).toBe(14)
    expect(parsed.APP_ENV).toBe('development')
    expect(parsed.LOG_LEVEL).toBe('info')
  })

  it('rejects a missing SESSION_SECRET', () => {
    const { SESSION_SECRET: _omit, ...withoutSecret } = base
    expect(envSchema.safeParse(withoutSecret).success).toBe(false)
  })

  it('rejects a too-short SESSION_SECRET', () => {
    const result = envSchema.safeParse({ ...base, SESSION_SECRET: 'short' })
    expect(result.success).toBe(false)
  })

  it('rejects a non-postgres DATABASE_URL', () => {
    const result = envSchema.safeParse({ ...base, DATABASE_URL: 'mysql://x/y' })
    expect(result.success).toBe(false)
  })

  it('treats an empty AI key as absent (undefined), not invalid', () => {
    const parsed = envSchema.parse({ ...base, ANTHROPIC_API_KEY: '' })
    expect(parsed.ANTHROPIC_API_KEY).toBeUndefined()
  })

  it('keeps a provided AI key', () => {
    const parsed = envSchema.parse({ ...base, OPENAI_API_KEY: 'sk-test-123' })
    expect(parsed.OPENAI_API_KEY).toBe('sk-test-123')
  })

  it('coerces numeric port from string', () => {
    const parsed = envSchema.parse({ ...base, APP_PORT: '5555' })
    expect(parsed.APP_PORT).toBe(5555)
  })
})
