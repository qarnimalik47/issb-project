/**
 * Encryption for secrets that must live in the database — currently the
 * third-party credentials an operator sets from the admin panel.
 *
 * AES-256-GCM with a random 12-byte IV per value and the auth tag kept
 * alongside it, so a tampered ciphertext fails to decrypt rather than
 * returning garbage. The key is derived from SESSION_SECRET with HKDF under a
 * dedicated `info` label, so rotating the session secret invalidates stored
 * credentials rather than silently decrypting them with a related key.
 *
 * Rule 1.3: plaintext never leaves the server. API responses carry a mask
 * (`sk-ant-…4f9c`) produced by `maskSecret`, never the value itself.
 */
import { createCipheriv, createDecipheriv, hkdfSync, randomBytes } from 'node:crypto'
import { env } from '../env/index'

const ALGO = 'aes-256-gcm'
const IV_BYTES = 12
const VERSION = 'v1'

function key(): Buffer {
  return Buffer.from(
    hkdfSync('sha256', env.SESSION_SECRET, 'issb-secretbox-salt', 'integration-credentials', 32),
  )
}

/** Encrypt a plaintext secret into a self-describing `v1.iv.tag.ciphertext` envelope. */
export function encryptSecret(plaintext: string): string {
  const iv = randomBytes(IV_BYTES)
  const cipher = createCipheriv(ALGO, key(), iv)
  const enc = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()])
  return [
    VERSION,
    iv.toString('base64url'),
    cipher.getAuthTag().toString('base64url'),
    enc.toString('base64url'),
  ].join('.')
}

/** Reverse `encryptSecret`. Returns null for anything malformed or tampered with. */
export function decryptSecret(envelope: string | null | undefined): string | null {
  if (!envelope) return null
  const [version, iv, tag, payload] = envelope.split('.')
  if (version !== VERSION || !iv || !tag || !payload) return null
  try {
    const decipher = createDecipheriv(ALGO, key(), Buffer.from(iv, 'base64url'))
    decipher.setAuthTag(Buffer.from(tag, 'base64url'))
    return Buffer.concat([
      decipher.update(Buffer.from(payload, 'base64url')),
      decipher.final(),
    ]).toString('utf8')
  } catch {
    return null
  }
}

/**
 * A display form that proves which credential is stored without revealing it:
 * enough leading characters to recognise the provider's prefix, the last four,
 * and nothing in between. Short secrets are masked entirely.
 */
export function maskSecret(plaintext: string): string {
  const s = plaintext.trim()
  if (s.length <= 8) return '•'.repeat(Math.max(s.length, 4))
  return `${s.slice(0, 6)}…${'•'.repeat(4)}${s.slice(-4)}`
}
