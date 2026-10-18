/**
 * Operational view of the platform: dependency health, queue depth, storage,
 * content pipeline backlog and the audit trail.
 *
 * Everything here is read-only and safe to poll — the queue counts come from
 * BullMQ directly, and a queue that cannot be reached reports `reachable:
 * false` rather than throwing, so one dead Redis does not blank the screen.
 */
import { statSync } from 'node:fs'
import { readdir, stat } from 'node:fs/promises'
import { join } from 'node:path'
import { and, desc, eq, gte, ilike, or, sql, type SQL } from 'drizzle-orm'
import { db } from '../db/index'
import { auditLogs, users } from '../db/schema/identity'
import { questions, stagingQuestions } from '../db/schema/content'
import { evaluations } from '../db/schema/attempts'
import { expertReviews } from '../db/schema/billing'
import { getQueue, QUEUE_NAMES } from '../queue/index'
import { healthReport } from '../health/index'
import { env } from '../env/index'

export type QueueSnapshot = {
  name: string
  reachable: boolean
  waiting: number
  active: number
  delayed: number
  failed: number
  completed: number
}

async function queueSnapshots(): Promise<QueueSnapshot[]> {
  return Promise.all(
    Object.values(QUEUE_NAMES).map(async (name) => {
      try {
        const c = await getQueue(name).getJobCounts(
          'waiting',
          'active',
          'delayed',
          'failed',
          'completed',
        )
        return {
          name,
          reachable: true,
          waiting: c.waiting ?? 0,
          active: c.active ?? 0,
          delayed: c.delayed ?? 0,
          failed: c.failed ?? 0,
          completed: c.completed ?? 0,
        }
      } catch {
        return {
          name,
          reachable: false,
          waiting: 0,
          active: 0,
          delayed: 0,
          failed: 0,
          completed: 0,
        }
      }
    }),
  )
}

/** Recursive size of the upload directory, so disk pressure is visible early. */
async function storageUsage(): Promise<{ bytes: number; files: number; path: string }> {
  let bytes = 0
  let files = 0
  async function walk(dir: string): Promise<void> {
    let entries
    try {
      entries = await readdir(dir, { withFileTypes: true })
    } catch {
      return
    }
    for (const entry of entries) {
      const full = join(dir, entry.name)
      if (entry.isDirectory()) await walk(full)
      else {
        try {
          bytes += (await stat(full)).size
          files++
        } catch {
          /* a file removed mid-walk is not an error worth failing the page for */
        }
      }
    }
  }
  await walk(env.STORAGE_DIR)
  return { bytes, files, path: env.STORAGE_DIR }
}

function backupState(): { lastAt: string | null; path: string } {
  try {
    const s = statSync(env.BACKUP_DIR)
    return { lastAt: s.mtime.toISOString(), path: env.BACKUP_DIR }
  } catch {
    return { lastAt: null, path: env.BACKUP_DIR }
  }
}

/** The System screen in one call. */
export async function systemSnapshot() {
  const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)

  const [health, queues, storage, [content], [pipeline], [reviews], [evalHealth]] =
    await Promise.all([
      healthReport(),
      queueSnapshots(),
      storageUsage(),
      db
        .select({
          published: sql<number>`count(*) filter (where ${questions.status} = 'published')`.mapWith(
            Number,
          ),
          draft: sql<number>`count(*) filter (where ${questions.status} = 'draft')`.mapWith(Number),
          archived: sql<number>`count(*) filter (where ${questions.status} = 'archived')`.mapWith(
            Number,
          ),
        })
        .from(questions),
      db
        .select({
          pending:
            sql<number>`count(*) filter (where ${stagingQuestions.status} = 'pending')`.mapWith(
              Number,
            ),
          needsRewrite:
            sql<number>`count(*) filter (where ${stagingQuestions.reviewState} = 'needs_rewrite')`.mapWith(
              Number,
            ),
        })
        .from(stagingQuestions),
      db
        .select({
          queued: sql<number>`count(*) filter (where ${expertReviews.status} = 'queued')`.mapWith(
            Number,
          ),
          assigned:
            sql<number>`count(*) filter (where ${expertReviews.status} = 'assigned')`.mapWith(
              Number,
            ),
        })
        .from(expertReviews),
      db
        .select({
          last24h: sql<number>`count(*)`.mapWith(Number),
          failed: sql<number>`count(*) filter (where ${evaluations.status} = 'failed')`.mapWith(
            Number,
          ),
          needsReview:
            sql<number>`count(*) filter (where ${evaluations.status} = 'needs_review')`.mapWith(
              Number,
            ),
          p95LatencyMs:
            sql<number>`coalesce(percentile_disc(0.95) within group (order by ${evaluations.latencyMs}), 0)`.mapWith(
              Number,
            ),
        })
        .from(evaluations)
        .where(gte(evaluations.createdAt, dayAgo)),
    ])

  return {
    health,
    queues,
    storage,
    backup: backupState(),
    content: {
      published: content?.published ?? 0,
      draft: content?.draft ?? 0,
      archived: content?.archived ?? 0,
      stagingPending: pipeline?.pending ?? 0,
      stagingNeedsRewrite: pipeline?.needsRewrite ?? 0,
    },
    expertReviews: { queued: reviews?.queued ?? 0, assigned: reviews?.assigned ?? 0 },
    evaluations: {
      last24h: evalHealth?.last24h ?? 0,
      failed: evalHealth?.failed ?? 0,
      needsReview: evalHealth?.needsReview ?? 0,
      p95LatencyMs: evalHealth?.p95LatencyMs ?? 0,
    },
    runtime: {
      appEnv: env.APP_ENV,
      nodeEnv: env.NODE_ENV,
      nodeVersion: process.version,
      uptimeSeconds: Math.round(process.uptime()),
      memoryMb: Math.round(process.memoryUsage().rss / 1024 / 1024),
    },
  }
}

/** The audit trail, filterable by actor and action. */
export async function auditTrail(
  opts: { q?: string; action?: string; limit?: number; offset?: number } = {},
) {
  const where: SQL[] = []
  if (opts.action) where.push(ilike(auditLogs.action, `${opts.action}%`))
  if (opts.q) {
    const like = `%${opts.q}%`
    const match = or(
      ilike(users.email, like),
      ilike(users.name, like),
      ilike(auditLogs.targetId, like),
      ilike(auditLogs.action, like),
    )
    if (match) where.push(match)
  }

  const rows = await db
    .select({
      id: auditLogs.id,
      action: auditLogs.action,
      targetType: auditLogs.targetType,
      targetId: auditLogs.targetId,
      metadata: auditLogs.metadata,
      ip: auditLogs.ip,
      createdAt: auditLogs.createdAt,
      actorName: users.name,
      actorEmail: users.email,
    })
    .from(auditLogs)
    .leftJoin(users, eq(users.id, auditLogs.userId))
    .where(where.length ? and(...where) : undefined)
    .orderBy(desc(auditLogs.createdAt))
    .limit(Math.min(200, opts.limit ?? 50))
    .offset(opts.offset ?? 0)

  const actions = await db
    .select({ action: auditLogs.action, n: sql<number>`count(*)`.mapWith(Number) })
    .from(auditLogs)
    .groupBy(auditLogs.action)
    .orderBy(desc(sql`count(*)`))
    .limit(20)

  return { entries: rows, actions }
}
