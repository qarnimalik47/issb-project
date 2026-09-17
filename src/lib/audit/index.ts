/**
 * Audit logging of sensitive actions (rule 1.3 / Phase 1). Writes are
 * best-effort: an audit failure must never break the user action, but is
 * logged loudly.
 */
import { db } from '../db/index'
import { auditLogs } from '../db/schema/identity'
import { childLogger } from '../logger/index'

const log = childLogger('audit')

export type AuditEntry = {
  userId?: string | null
  action: string
  targetType?: string
  targetId?: string
  metadata?: Record<string, unknown>
  ip?: string | null
}

export async function audit(entry: AuditEntry): Promise<void> {
  try {
    await db.insert(auditLogs).values({
      userId: entry.userId ?? null,
      action: entry.action,
      targetType: entry.targetType,
      targetId: entry.targetId,
      metadata: entry.metadata,
      ip: entry.ip ?? null,
    })
  } catch (err) {
    log.error({ err, action: entry.action }, 'failed to write audit log')
  }
}
