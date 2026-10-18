import { describe, it, expect } from 'vitest'
import { encryptSecret, decryptSecret, maskSecret } from '../../src/lib/crypto/secrets'

describe('integration credential encryption', () => {
  it('round-trips a secret', () => {
    const plain = 'sk-ant-api03-not-a-real-key-0123456789'
    const envelope = encryptSecret(plain)
    expect(envelope).not.toContain(plain)
    expect(decryptSecret(envelope)).toBe(plain)
  })

  it('produces a different envelope each time (random IV)', () => {
    const a = encryptSecret('same-value')
    const b = encryptSecret('same-value')
    expect(a).not.toBe(b)
    expect(decryptSecret(a)).toBe('same-value')
    expect(decryptSecret(b)).toBe('same-value')
  })

  it('refuses a tampered ciphertext rather than returning garbage', () => {
    const envelope = encryptSecret('sensitive')
    const [v, iv, tag, payload] = envelope.split('.')
    // Flip the last character of the ciphertext.
    const flipped = payload!.slice(0, -1) + (payload!.endsWith('A') ? 'B' : 'A')
    expect(decryptSecret([v, iv, tag, flipped].join('.'))).toBeNull()
  })

  it('returns null for malformed or absent envelopes', () => {
    expect(decryptSecret(null)).toBeNull()
    expect(decryptSecret('')).toBeNull()
    expect(decryptSecret('not-an-envelope')).toBeNull()
    expect(decryptSecret('v9.a.b.c')).toBeNull()
  })

  it('masks a secret without revealing its middle', () => {
    const masked = maskSecret('sk-ant-api03-abcdefghijklmnop-4f9c')
    expect(masked.startsWith('sk-ant')).toBe(true)
    expect(masked.endsWith('4f9c')).toBe(true)
    expect(masked).not.toContain('abcdefghijklmnop')
  })

  it('masks a short secret entirely', () => {
    expect(maskSecret('abc123')).toBe('••••••')
  })
})
