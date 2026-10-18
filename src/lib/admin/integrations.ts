/**
 * Third-party integrations, managed from the admin panel.
 *
 * The registry below is the catalogue of providers the platform knows how to
 * talk to. A row in `integrations` overrides the environment for that provider,
 * which is what lets an operator rotate an API key without a redeploy; with no
 * row (or a row with no credential) the process environment still wins, so
 * nothing about the existing `.env` setup breaks.
 *
 * Secrets are encrypted at rest and never serialised to the client — the list
 * endpoint returns a mask and a status, never the value.
 */
import { and, desc, eq, gte, sql } from 'drizzle-orm'
import { db } from '../db/index'
import { integrations } from '../db/schema/admin'
import { evaluations } from '../db/schema/attempts'
import { payments } from '../db/schema/billing'
import { decryptSecret, encryptSecret, maskSecret } from '../crypto/secrets'
import { env } from '../env/index'

export type IntegrationCategory = 'ai' | 'payments' | 'messaging' | 'storage' | 'analytics'

export type ProviderField = {
  key: string
  label: string
  /** `secret` fields are encrypted and write-only; `text` fields are plain config. */
  type: 'secret' | 'text'
  placeholder?: string
  required?: boolean
  help?: string
}

export type ProviderDef = {
  slug: string
  label: string
  category: IntegrationCategory
  summary: string
  docsUrl: string
  fields: ProviderField[]
  /** Whether `testIntegration` can make a real call for this provider. */
  testable: boolean
}

export const PROVIDER_REGISTRY: ProviderDef[] = [
  {
    slug: 'anthropic',
    label: 'Anthropic',
    category: 'ai',
    summary: 'Claude models for written-response evaluation and the dual-model cross-check.',
    docsUrl: 'https://docs.anthropic.com/en/api/overview',
    testable: true,
    fields: [
      {
        key: 'apiKey',
        label: 'API key',
        type: 'secret',
        placeholder: 'sk-ant-...',
        required: true,
      },
      { key: 'model', label: 'Model', type: 'text', placeholder: 'claude-sonnet-5' },
    ],
  },
  {
    slug: 'openai',
    label: 'OpenAI',
    category: 'ai',
    summary: 'GPT models — the second opinion when cross-checking an evaluation.',
    docsUrl: 'https://platform.openai.com/docs/api-reference',
    testable: true,
    fields: [
      { key: 'apiKey', label: 'API key', type: 'secret', placeholder: 'sk-...', required: true },
      { key: 'model', label: 'Model', type: 'text', placeholder: 'gpt-4.1' },
    ],
  },
  {
    slug: 'google',
    label: 'Google Gemini',
    category: 'ai',
    summary: 'Gemini models for evaluation and speech-to-text fallback.',
    docsUrl: 'https://ai.google.dev/gemini-api/docs',
    testable: true,
    fields: [
      { key: 'apiKey', label: 'API key', type: 'secret', placeholder: 'AIza...', required: true },
      { key: 'model', label: 'Model', type: 'text', placeholder: 'gemini-2.5-pro' },
    ],
  },
  {
    slug: 'jazzcash',
    label: 'JazzCash',
    category: 'payments',
    summary: 'Mobile-wallet checkout for Pakistani candidates. Webhooks are signature-verified.',
    docsUrl: 'https://sandbox.jazzcash.com.pk/',
    testable: false,
    fields: [
      { key: 'merchantId', label: 'Merchant ID', type: 'text', required: true },
      { key: 'password', label: 'Merchant password', type: 'secret', required: true },
      {
        key: 'integritySalt',
        label: 'Integrity salt',
        type: 'secret',
        required: true,
        help: 'Verifies the secure hash on every webhook.',
      },
    ],
  },
  {
    slug: 'easypaisa',
    label: 'Easypaisa',
    category: 'payments',
    summary: 'Telenor mobile-wallet checkout, alongside JazzCash.',
    docsUrl: 'https://easypaisa.com.pk/',
    testable: false,
    fields: [
      { key: 'storeId', label: 'Store ID', type: 'text', required: true },
      { key: 'integritySalt', label: 'Integrity salt', type: 'secret', required: true },
    ],
  },
  {
    slug: 'card',
    label: 'Card gateway',
    category: 'payments',
    summary: 'Card acquiring for candidates paying from outside Pakistan.',
    docsUrl: 'https://stripe.com/docs/api',
    testable: false,
    fields: [
      { key: 'publicKey', label: 'Publishable key', type: 'text' },
      { key: 'secretKey', label: 'Secret key', type: 'secret', required: true },
      { key: 'webhookSecret', label: 'Webhook signing secret', type: 'secret' },
    ],
  },
  {
    slug: 'smtp',
    label: 'Email (SMTP)',
    category: 'messaging',
    summary: 'Transactional email: verification codes, receipts, result notifications.',
    docsUrl: 'https://nodemailer.com/smtp/',
    testable: false,
    fields: [
      { key: 'host', label: 'Host', type: 'text', placeholder: 'smtp.example.com', required: true },
      { key: 'port', label: 'Port', type: 'text', placeholder: '587' },
      { key: 'username', label: 'Username', type: 'text' },
      { key: 'password', label: 'Password', type: 'secret' },
      { key: 'fromAddress', label: 'From address', type: 'text', placeholder: 'no-reply@...' },
    ],
  },
  {
    slug: 'sms',
    label: 'SMS gateway',
    category: 'messaging',
    summary: 'Phone OTP delivery for candidates who verify by number.',
    docsUrl: 'https://www.twilio.com/docs/sms',
    testable: false,
    fields: [
      { key: 'accountSid', label: 'Account SID', type: 'text', required: true },
      { key: 'authToken', label: 'Auth token', type: 'secret', required: true },
      { key: 'senderId', label: 'Sender ID', type: 'text', placeholder: 'ISSBPREP' },
    ],
  },
]

export function providerDef(slug: string): ProviderDef | undefined {
  return PROVIDER_REGISTRY.find((p) => p.slug === slug)
}

/** The environment value behind a provider, if one is configured. */
function envCredential(slug: string): string | null {
  switch (slug) {
    case 'anthropic':
      return env.ANTHROPIC_API_KEY ?? null
    case 'openai':
      return env.OPENAI_API_KEY ?? null
    case 'google':
      return env.GOOGLE_API_KEY ?? null
    case 'jazzcash':
      return process.env.JAZZCASH_INTEGRITY_SALT ?? null
    case 'easypaisa':
      return process.env.EASYPAISA_INTEGRITY_SALT ?? null
    default:
      return null
  }
}

type StoredCredentials = Record<string, string>

function readCredentials(row: { credentials: string | null }): StoredCredentials {
  const plain = decryptSecret(row.credentials)
  if (!plain) return {}
  try {
    return JSON.parse(plain) as StoredCredentials
  } catch {
    return {}
  }
}

/**
 * Resolve the live secret for a provider: a stored credential wins, then the
 * environment. Server-only — callers must never pass the result to a client.
 */
export async function resolveSecret(slug: string, field = 'apiKey'): Promise<string | null> {
  const [row] = await db.select().from(integrations).where(eq(integrations.slug, slug)).limit(1)
  if (row?.enabled) {
    const creds = readCredentials(row)
    if (creds[field]) return creds[field]
  }
  return envCredential(slug)
}

export type IntegrationView = {
  slug: string
  label: string
  category: IntegrationCategory
  summary: string
  docsUrl: string
  fields: ProviderField[]
  testable: boolean
  configured: boolean
  /** True when the only credential comes from the process environment. */
  fromEnv: boolean
  enabled: boolean
  status: 'unknown' | 'ok' | 'error'
  maskedSecrets: Record<string, string>
  config: Record<string, string>
  lastCheckedAt: string | null
  lastLatencyMs: number | null
  lastError: string | null
  updatedAt: string | null
}

/** Every known provider, merged with whatever is stored for it. */
export async function listIntegrations(): Promise<IntegrationView[]> {
  const rows = await db.select().from(integrations)
  const bySlug = new Map(rows.map((r) => [r.slug, r]))

  return PROVIDER_REGISTRY.map((def) => {
    const row = bySlug.get(def.slug)
    const creds = row ? readCredentials(row) : {}
    const masked: Record<string, string> = {}
    for (const field of def.fields) {
      const value = creds[field.key]
      if (field.type === 'secret' && value) masked[field.key] = maskSecret(value)
    }
    const hasStored = Object.keys(masked).length > 0
    const envValue = envCredential(def.slug)
    return {
      slug: def.slug,
      label: def.label,
      category: def.category,
      summary: def.summary,
      docsUrl: def.docsUrl,
      fields: def.fields,
      testable: def.testable,
      configured: hasStored || Boolean(envValue),
      fromEnv: !hasStored && Boolean(envValue),
      enabled: row?.enabled ?? Boolean(envValue),
      status: (row?.status as IntegrationView['status']) ?? 'unknown',
      maskedSecrets: masked,
      config: (row?.config as Record<string, string>) ?? {},
      lastCheckedAt: row?.lastCheckedAt?.toISOString() ?? null,
      lastLatencyMs: row?.lastLatencyMs ?? null,
      lastError: row?.lastError ?? null,
      updatedAt: row?.updatedAt?.toISOString() ?? null,
    }
  })
}

/**
 * Create or update a provider's settings. A secret field left blank keeps its
 * stored value, so an operator can edit a model name without re-entering keys;
 * the sentinel `__clear__` removes one.
 */
export async function saveIntegration(
  slug: string,
  input: { enabled?: boolean; secrets?: Record<string, string>; config?: Record<string, string> },
  actorId: string,
): Promise<void> {
  const def = providerDef(slug)
  if (!def) throw new Error(`unknown provider: ${slug}`)

  const [existing] = await db
    .select()
    .from(integrations)
    .where(eq(integrations.slug, slug))
    .limit(1)
  const creds = existing ? readCredentials(existing) : {}
  let secretsChanged = false
  for (const [key, value] of Object.entries(input.secrets ?? {})) {
    const trimmed = value.trim()
    if (!trimmed) continue
    if (trimmed === '__clear__') delete creds[key]
    else creds[key] = trimmed
    secretsChanged = true
  }

  const config = {
    ...((existing?.config as Record<string, string>) ?? {}),
    ...(input.config ?? {}),
  }
  const credentials = Object.keys(creds).length ? encryptSecret(JSON.stringify(creds)) : null
  const enabled = input.enabled ?? existing?.enabled ?? false

  if (existing) {
    await db
      .update(integrations)
      .set({
        enabled,
        credentials,
        config,
        label: def.label,
        category: def.category,
        // The credential changed, so the last check no longer describes it.
        status: secretsChanged ? 'unknown' : existing.status,
        lastError: secretsChanged ? null : existing.lastError,
        updatedBy: actorId,
        updatedAt: new Date(),
      })
      .where(eq(integrations.id, existing.id))
  } else {
    await db.insert(integrations).values({
      slug,
      label: def.label,
      category: def.category,
      enabled,
      credentials,
      config,
      updatedBy: actorId,
    })
  }
}

export type TestResult = { ok: boolean; latencyMs: number; detail: string }

/** A cheap, read-only call that proves the credential works. */
async function pingProvider(slug: string, apiKey: string): Promise<string> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 12_000)
  try {
    if (slug === 'anthropic') {
      const res = await fetch('https://api.anthropic.com/v1/models?limit=1', {
        headers: { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
        signal: controller.signal,
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return 'Credential accepted by the Anthropic API.'
    }
    if (slug === 'openai') {
      const res = await fetch('https://api.openai.com/v1/models', {
        headers: { authorization: `Bearer ${apiKey}` },
        signal: controller.signal,
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return 'Credential accepted by the OpenAI API.'
    }
    if (slug === 'google') {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(apiKey)}`,
        { signal: controller.signal },
      )
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return 'Credential accepted by the Gemini API.'
    }
    throw new Error('This provider has no automated connection test.')
  } finally {
    clearTimeout(timer)
  }
}

/** Run a live check and record the outcome against the provider. */
export async function testIntegration(slug: string): Promise<TestResult> {
  const def = providerDef(slug)
  if (!def) throw new Error(`unknown provider: ${slug}`)
  const started = Date.now()
  let result: TestResult

  try {
    if (!def.testable) throw new Error('No automated test exists for this provider yet.')
    const apiKey = await resolveSecret(slug)
    if (!apiKey) throw new Error('No credential is configured for this provider.')
    const detail = await pingProvider(slug, apiKey)
    result = { ok: true, latencyMs: Date.now() - started, detail }
  } catch (err) {
    result = {
      ok: false,
      latencyMs: Date.now() - started,
      detail: err instanceof Error ? err.message : 'Connection failed.',
    }
  }

  const [existing] = await db
    .select()
    .from(integrations)
    .where(eq(integrations.slug, slug))
    .limit(1)
  const patch = {
    status: result.ok ? ('ok' as const) : ('error' as const),
    lastCheckedAt: new Date(),
    lastLatencyMs: result.latencyMs,
    lastError: result.ok ? null : result.detail,
    updatedAt: new Date(),
  }
  if (existing) {
    await db.update(integrations).set(patch).where(eq(integrations.id, existing.id))
  } else {
    await db
      .insert(integrations)
      .values({ slug, label: def.label, category: def.category, enabled: false, ...patch })
  }
  return result
}

/**
 * What each integration has actually been used for. AI usage comes from the
 * evaluation records (the only place model spend is booked); gateway usage
 * comes from the payments table.
 */
export async function integrationUsage(days = 30) {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
  const [ai, gateways] = await Promise.all([
    db
      .select({
        slug: evaluations.model,
        calls: sql<number>`count(*)`.mapWith(Number),
        tokensIn: sql<number>`coalesce(sum(${evaluations.tokensInput}),0)`.mapWith(Number),
        tokensOut: sql<number>`coalesce(sum(${evaluations.tokensOutput}),0)`.mapWith(Number),
        costUsd: sql<number>`coalesce(sum(${evaluations.costUsd}),0)`.mapWith(Number),
        failures: sql<number>`count(*) filter (where ${evaluations.status} = 'failed')`.mapWith(
          Number,
        ),
      })
      .from(evaluations)
      .where(gte(evaluations.createdAt, since))
      .groupBy(evaluations.model),
    db
      .select({
        slug: payments.gateway,
        calls: sql<number>`count(*)`.mapWith(Number),
        paid: sql<number>`count(*) filter (where ${payments.status} = 'paid')`.mapWith(Number),
        failures: sql<number>`count(*) filter (where ${payments.status} = 'failed')`.mapWith(
          Number,
        ),
        volumeCents:
          sql<number>`coalesce(sum(${payments.amountCents}) filter (where ${payments.status} = 'paid'),0)`.mapWith(
            Number,
          ),
      })
      .from(payments)
      .where(gte(payments.createdAt, since))
      .groupBy(payments.gateway),
  ])
  return { ai, gateways, days }
}

/** AI providers currently switched on — drives the health strip on the overview. */
export async function aiProviderHealth() {
  const rows = await db
    .select()
    .from(integrations)
    .where(and(eq(integrations.category, 'ai'), eq(integrations.enabled, true)))
    .orderBy(desc(integrations.updatedAt))
  return rows.map((r) => ({
    slug: r.slug,
    status: r.status,
    lastCheckedAt: r.lastCheckedAt?.toISOString() ?? null,
  }))
}
