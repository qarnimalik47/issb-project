import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { eq } from 'drizzle-orm'
import { db, sql } from '../../src/lib/db/index'
import { users, sessions } from '../../src/lib/db/schema/identity'
import { apiClients, integrations } from '../../src/lib/db/schema/admin'
import {
  issueApiKey,
  listApiKeys,
  revokeApiKey,
  verifyApiKey,
} from '../../src/lib/admin/api-clients'
import { listIntegrations, resolveSecret, saveIntegration } from '../../src/lib/admin/integrations'
import { listUsers, revokeSessions, setUserStatus, userProfile } from '../../src/lib/admin/users'

let adminId: string
let keyId: string

describe('admin platform (integration)', () => {
  beforeAll(async () => {
    const [u] = await db
      .insert(users)
      .values({ name: 'Admin tester', email: `admin_${Date.now()}@test.com`, role: 'admin' })
      .returning({ id: users.id })
    adminId = u!.id
  })

  afterAll(async () => {
    await db.delete(apiClients).where(eq(apiClients.createdBy, adminId))
    await db.delete(integrations).where(eq(integrations.slug, 'anthropic'))
    await db.delete(sessions).where(eq(sessions.userId, adminId))
    await db.delete(users).where(eq(users.id, adminId))
    await sql.end()
  })

  describe('API keys', () => {
    it('issues a key that verifies, and never stores the plaintext', async () => {
      const issued = await issueApiKey({
        name: 'Test client',
        scopes: ['catalog:read'],
        rateLimitPerMinute: 60,
        createdBy: adminId,
      })
      keyId = issued.id
      expect(issued.key.startsWith('issb_')).toBe(true)

      const [row] = await db.select().from(apiClients).where(eq(apiClients.id, keyId))
      expect(row?.keyHash).not.toBe(issued.key)
      expect(row?.keyHash).not.toContain(issued.key.split('_').pop())

      const verified = await verifyApiKey(issued.key)
      expect(verified?.name).toBe('Test client')
      expect(verified?.scopes).toEqual(['catalog:read'])
    })

    it('rejects an unknown or malformed key', async () => {
      expect(await verifyApiKey('issb_test_deadbeef_nonsense')).toBeNull()
      expect(await verifyApiKey('not-even-close')).toBeNull()
    })

    it('rejects an expired key', async () => {
      const issued = await issueApiKey({
        name: 'Expired client',
        scopes: ['catalog:read'],
        rateLimitPerMinute: 10,
        expiresAt: new Date(Date.now() - 1000),
        createdBy: adminId,
      })
      expect(await verifyApiKey(issued.key)).toBeNull()

      const listed = await listApiKeys()
      expect(listed.find((k) => k.id === issued.id)?.expired).toBe(true)
    })

    it('stops accepting a revoked key immediately', async () => {
      const issued = await issueApiKey({
        name: 'Doomed client',
        scopes: ['gk:read'],
        rateLimitPerMinute: 30,
        createdBy: adminId,
      })
      expect(await verifyApiKey(issued.key)).not.toBeNull()
      await revokeApiKey(issued.id)
      expect(await verifyApiKey(issued.key)).toBeNull()
    })
  })

  describe('integrations', () => {
    it('lists every registry provider even with nothing stored', async () => {
      const list = await listIntegrations()
      expect(list.map((p) => p.slug)).toContain('anthropic')
      expect(list.map((p) => p.slug)).toContain('jazzcash')
    })

    it('stores a credential encrypted and only ever exposes a mask', async () => {
      await saveIntegration(
        'anthropic',
        {
          enabled: true,
          secrets: { apiKey: 'sk-ant-test-value-12345678' },
          config: { model: 'claude-sonnet-5' },
        },
        adminId,
      )

      const [row] = await db.select().from(integrations).where(eq(integrations.slug, 'anthropic'))
      expect(row?.credentials).toBeTruthy()
      expect(row?.credentials).not.toContain('sk-ant-test-value')

      const view = (await listIntegrations()).find((p) => p.slug === 'anthropic')!
      expect(view.configured).toBe(true)
      expect(view.enabled).toBe(true)
      expect(view.maskedSecrets.apiKey).not.toContain('test-value')
      expect(view.config.model).toBe('claude-sonnet-5')
      expect(JSON.stringify(view)).not.toContain('sk-ant-test-value-12345678')
    })

    it('resolves the stored credential for server-side use', async () => {
      expect(await resolveSecret('anthropic')).toBe('sk-ant-test-value-12345678')
    })

    it('keeps the stored secret when a blank value is submitted', async () => {
      await saveIntegration(
        'anthropic',
        { secrets: { apiKey: '' }, config: { model: 'x' } },
        adminId,
      )
      expect(await resolveSecret('anthropic')).toBe('sk-ant-test-value-12345678')
    })

    it('clears a credential on the explicit sentinel', async () => {
      await saveIntegration('anthropic', { secrets: { apiKey: '__clear__' } }, adminId)
      const view = (await listIntegrations()).find((p) => p.slug === 'anthropic')!
      expect(view.maskedSecrets.apiKey).toBeUndefined()
    })

    it('refuses a provider that is not in the registry', async () => {
      await expect(saveIntegration('not-a-provider', { enabled: true }, adminId)).rejects.toThrow()
    })
  })

  describe('user administration', () => {
    it('finds the account by search and reports its plan and credits', async () => {
      const { users: rows } = await listUsers({ q: 'Admin tester' })
      const row = rows.find((r) => r.id === adminId)
      expect(row).toBeTruthy()
      expect(row?.planCode).toBe('free')
      expect(row?.credits).toBe(0)
    })

    it('filters by role', async () => {
      const { users: admins } = await listUsers({ role: 'admin', pageSize: 100 })
      expect(admins.every((u) => u.role === 'admin')).toBe(true)
      expect(admins.some((u) => u.id === adminId)).toBe(true)
    })

    it('suspending an account also revokes its live sessions', async () => {
      await db.insert(sessions).values({
        userId: adminId,
        tokenHash: `hash_${Date.now()}`,
        expiresAt: new Date(Date.now() + 86_400_000),
      })
      await setUserStatus(adminId, 'locked')

      const profile = await userProfile(adminId)
      expect(profile?.user.status).toBe('locked')
      expect(profile?.sessions.length).toBe(0)

      await setUserStatus(adminId, 'active')
    })

    it('revoking sessions reports how many it closed', async () => {
      await db.insert(sessions).values({
        userId: adminId,
        tokenHash: `hash2_${Date.now()}`,
        expiresAt: new Date(Date.now() + 86_400_000),
      })
      expect(await revokeSessions(adminId)).toBe(1)
      expect(await revokeSessions(adminId)).toBe(0)
    })
  })
})
