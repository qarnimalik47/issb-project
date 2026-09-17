import { describe, it, expect } from 'vitest'
import { generateToken, hashToken, generateOtp, safeEqualHex } from '../../src/lib/auth/tokens'

describe('auth tokens', () => {
  it('generates distinct high-entropy tokens', () => {
    const a = generateToken()
    const b = generateToken()
    expect(a).not.toBe(b)
    expect(a.length).toBeGreaterThanOrEqual(40)
  })

  it('hashes deterministically', () => {
    expect(hashToken('abc')).toBe(hashToken('abc'))
    expect(hashToken('abc')).not.toBe(hashToken('abd'))
    expect(hashToken('abc')).toHaveLength(64)
  })

  it('generates 6-digit OTPs', () => {
    for (let i = 0; i < 50; i++) {
      expect(generateOtp(6)).toMatch(/^[0-9]{6}$/)
    }
  })

  it('safeEqualHex compares correctly', () => {
    const h = hashToken('secret')
    expect(safeEqualHex(h, hashToken('secret'))).toBe(true)
    expect(safeEqualHex(h, hashToken('other'))).toBe(false)
    expect(safeEqualHex(h, 'ab')).toBe(false)
  })
})
