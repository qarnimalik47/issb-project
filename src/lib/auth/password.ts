/**
 * Password hashing with argon2id (rule 1.3). Never store plaintext or
 * reversible secrets. Uses @node-rs/argon2 (prebuilt binaries — no native
 * compile step).
 */
import { hash, verify } from '@node-rs/argon2'

// OWASP-aligned argon2id parameters.
const OPTIONS = {
  memoryCost: 19456, // 19 MiB
  timeCost: 2,
  parallelism: 1,
}

export function hashPassword(plain: string): Promise<string> {
  return hash(plain, OPTIONS)
}

export async function verifyPassword(hashed: string, plain: string): Promise<boolean> {
  try {
    return await verify(hashed, plain)
  } catch {
    // Malformed hash → treat as non-match rather than throwing.
    return false
  }
}
