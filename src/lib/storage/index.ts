/**
 * File storage abstraction (ADR 0002). A single interface with a local
 * filesystem adapter now; an S3-compatible adapter can be added later without
 * touching call sites. Files live OUTSIDE the web root and are only served
 * through short-lived signed URLs (rule 1.3).
 */
import { createHmac, timingSafeEqual } from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { env } from '../env/index'

export interface StorageAdapter {
  put(key: string, data: Buffer, meta: { mime: string }): Promise<void>
  get(key: string): Promise<Buffer>
  delete(key: string): Promise<void>
  exists(key: string): Promise<boolean>
}

const STORAGE_ROOT = path.resolve(process.cwd(), env.STORAGE_DIR)

/** Reject keys that could escape the storage root. */
function safeResolve(key: string): string {
  const normalised = path.normalize(key).replace(/^(\.\.[/\\])+/, '')
  const full = path.resolve(STORAGE_ROOT, normalised)
  if (!full.startsWith(STORAGE_ROOT + path.sep) && full !== STORAGE_ROOT) {
    throw new Error('Invalid storage key')
  }
  return full
}

class LocalStorage implements StorageAdapter {
  async put(key: string, data: Buffer): Promise<void> {
    const full = safeResolve(key)
    await fs.mkdir(path.dirname(full), { recursive: true })
    await fs.writeFile(full, data)
  }
  async get(key: string): Promise<Buffer> {
    return fs.readFile(safeResolve(key))
  }
  async delete(key: string): Promise<void> {
    await fs.rm(safeResolve(key), { force: true })
  }
  async exists(key: string): Promise<boolean> {
    try {
      await fs.access(safeResolve(key))
      return true
    } catch {
      return false
    }
  }
}

export const storage: StorageAdapter = new LocalStorage()

// --- Signed URLs ------------------------------------------------------------

function sign(key: string, expiresAt: number): string {
  return createHmac('sha256', env.SESSION_SECRET).update(`${key}:${expiresAt}`).digest('hex')
}

/** Build a signed, expiring URL path for a stored object. */
export function signedUrl(key: string, ttlSeconds = 300): string {
  const exp = Math.floor(Date.now() / 1000) + ttlSeconds
  const sig = sign(key, exp)
  return `/api/files/${key}?exp=${exp}&sig=${sig}`
}

/** Verify a signed URL's signature and expiry. */
export function verifySignedUrl(key: string, exp: string, sig: string): boolean {
  const expNum = Number(exp)
  if (!Number.isFinite(expNum) || expNum < Math.floor(Date.now() / 1000)) return false
  const expected = sign(key, expNum)
  const a = Buffer.from(expected, 'hex')
  const b = Buffer.from(sig, 'hex')
  if (a.length !== b.length) return false
  return timingSafeEqual(a, b)
}
