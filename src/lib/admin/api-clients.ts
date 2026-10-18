/**
 * Inbound API keys.
 *
 * These are the credentials the mobile app and any partner integration present
 * to the versioned API. The full key is shown exactly once, at creation: only a
 * SHA-256 hash is stored, so a database copy cannot be replayed against the API
 * (the same rule passwords follow — rule 1.3).
 *
 * A key is `issb_<env>_<prefix>_<secret>`. The prefix is stored in clear and is
 * what the admin list, the audit log and the rate limiter refer to, so a key can
 * be identified and revoked without ever seeing the secret half.
 */
import { createHash, randomBytes, timingSafeEqual } from 'node:crypto'
import { and, desc, eq, sql } from 'drizzle-orm'
import { db } from '../db/index'
import { apiClients } from '../db/schema/admin'
import { users } from '../db/schema/identity'
import { env } from '../env/index'

/** What a key is allowed to reach. Kept coarse; the route still checks the user. */
export const API_SCOPES = [
  'catalog:read',
  'questions:read',
  'attempts:write',
  'evaluations:read',
  'gk:read',
  'users:read',
  'billing:read',
] as const

export type ApiScope = (typeof API_SCOPES)[number]

export const SCOPE_LABELS: Record<ApiScope, string> = {
  'catalog:read': 'Read the test-type catalogue',
  'questions:read': 'Read published questions',
  'attempts:write': 'Create and submit attempts',
  'evaluations:read': 'Read evaluation results',
  'gk:read': 'Read GK topics and digests',
  'users:read': 'Read user profiles',
  'billing:read': 'Read plans and subscription state',
}

function hashKey(key: string): string {
  return createHash('sha256').update(key).digest('hex')
}

export type IssuedKey = { id: string; key: string; keyPrefix: string }

/**
 * Mint a key. The plaintext in the return value is the only copy that will ever
 * exist — the caller shows it once and then forgets it.
 */
export async function issueApiKey(input: {
  name: string
  description?: string | null
  scopes: ApiScope[]
  rateLimitPerMinute: number
  expiresAt?: Date | null
  createdBy: string
}): Promise<IssuedKey> {
  const label = env.APP_ENV === 'production' ? 'live' : 'test'
  const prefix = randomBytes(4).toString('hex')
  const secret = randomBytes(24).toString('base64url')
  const key = `issb_${label}_${prefix}_${secret}`

  const [row] = await db
    .insert(apiClients)
    .values({
      name: input.name,
      description: input.description ?? null,
      keyPrefix: `issb_${label}_${prefix}`,
      keyHash: hashKey(key),
      scopes: input.scopes,
      rateLimitPerMinute: input.rateLimitPerMinute,
      expiresAt: input.expiresAt ?? null,
      createdBy: input.createdBy,
    })
    .returning({ id: apiClients.id, keyPrefix: apiClients.keyPrefix })

  return { id: row!.id, key, keyPrefix: row!.keyPrefix }
}

export async function listApiKeys() {
  return db
    .select({
      id: apiClients.id,
      name: apiClients.name,
      description: apiClients.description,
      keyPrefix: apiClients.keyPrefix,
      scopes: apiClients.scopes,
      rateLimitPerMinute: apiClients.rateLimitPerMinute,
      status: apiClients.status,
      requestCount: apiClients.requestCount,
      lastUsedAt: apiClients.lastUsedAt,
      lastUsedIp: apiClients.lastUsedIp,
      expiresAt: apiClients.expiresAt,
      createdAt: apiClients.createdAt,
      revokedAt: apiClients.revokedAt,
      createdByName: users.name,
      // Computed by the database so the answer does not depend on a browser clock.
      expired: sql<boolean>`${apiClients.expiresAt} is not null and ${apiClients.expiresAt} < now()`,
    })
    .from(apiClients)
    .leftJoin(users, eq(users.id, apiClients.createdBy))
    .orderBy(desc(apiClients.createdAt))
}

export async function revokeApiKey(id: string): Promise<void> {
  await db
    .update(apiClients)
    .set({ status: 'revoked', revokedAt: new Date() })
    .where(eq(apiClients.id, id))
}

export type VerifiedClient = {
  id: string
  name: string
  scopes: ApiScope[]
  rateLimitPerMinute: number
}

/**
 * Check a presented key. Returns the client when the key is active, unexpired
 * and matches a stored hash; null otherwise. The hash comparison is constant
 * time even though the lookup is by hash, so a timing signal cannot confirm a
 * near-miss.
 */
export async function verifyApiKey(presented: string): Promise<VerifiedClient | null> {
  if (!presented.startsWith('issb_')) return null
  const digest = hashKey(presented)
  const [row] = await db
    .select()
    .from(apiClients)
    .where(and(eq(apiClients.keyHash, digest), eq(apiClients.status, 'active')))
    .limit(1)
  if (!row) return null

  const a = Buffer.from(row.keyHash)
  const b = Buffer.from(digest)
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null
  if (row.expiresAt && row.expiresAt.getTime() < Date.now()) return null

  return {
    id: row.id,
    name: row.name,
    scopes: (row.scopes as ApiScope[]) ?? [],
    rateLimitPerMinute: row.rateLimitPerMinute,
  }
}

/** Book a request against a key. Best-effort: never blocks the request itself. */
export async function recordApiKeyUse(id: string, ip: string | null): Promise<void> {
  await db
    .update(apiClients)
    .set({
      requestCount: sql`${apiClients.requestCount} + 1`,
      lastUsedAt: new Date(),
      lastUsedIp: ip,
    })
    .where(eq(apiClients.id, id))
}
