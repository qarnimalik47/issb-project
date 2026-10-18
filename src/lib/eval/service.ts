/**
 * Evaluation orchestration (Phase 5).
 *
 * Flow per response: distress gate → load versioned rubric → build hardened
 * prompt → run provider(s) with retry + strict schema validation → optional
 * dual-model cross-check → store IMMUTABLE audit records. Malformed output is
 * retried then flagged for human review; a result is never fabricated (rule 1.5).
 */
import { createHash, randomUUID } from 'node:crypto'
import { and, desc, eq } from 'drizzle-orm'
import { db } from '../db/index'
import { writtenResponses, attempts, evaluations } from '../db/schema/attempts'
import { testTypes, rubrics } from '../db/schema/content'
import { childLogger } from '../logger/index'
import { detectDistress } from './distress'
import {
  buildSystemPrompt,
  buildUserMessage,
  PROMPT_VERSION,
  type RubricCriterion,
} from './prompts'
import { buildOutputSchema, averageScore, type EvaluationOutput } from './schema'
import { selectProviders, type EvalProvider, type EvalRequest } from './providers'
import { enqueue, QUEUE_NAMES } from '../queue/index'
import { getEntitlements, reserveEvaluation } from '../billing/quota'
import { getBalance } from '../billing/credits'
import { ApiError } from '../api/errors'

const log = childLogger('eval')

const DISAGREEMENT_THRESHOLD = 1.0 // avg-score gap that flags for human review
const MAX_SCORE = 5

// Rough cost estimates (USD per 1M tokens) for monitoring; mock = 0.
const PRICING: Record<string, { in: number; out: number }> = {
  anthropic: { in: 3, out: 15 },
  openai: { in: 2, out: 8 },
  google: { in: 1.25, out: 5 },
  mock: { in: 0, out: 0 },
}

function costUsd(model: string, tokensIn: number, tokensOut: number): number {
  const p = PRICING[model] ?? { in: 0, out: 0 }
  return Number(((tokensIn / 1e6) * p.in + (tokensOut / 1e6) * p.out).toFixed(6))
}

export type EvaluationResultView = {
  status: 'completed' | 'needs_review' | 'failed' | 'blocked_distress'
  usedMock: boolean
  disagreement: boolean
  output?: EvaluationOutput
  averageScore?: number
  supportMessage?: boolean
}

async function loadRubric(
  testTypeId: string,
): Promise<{ version: number; criteria: RubricCriterion[] } | null> {
  const [r] = await db
    .select()
    .from(rubrics)
    .where(and(eq(rubrics.testTypeId, testTypeId), eq(rubrics.status, 'published')))
    .orderBy(desc(rubrics.version))
    .limit(1)
  if (!r) return null
  return { version: r.version, criteria: r.criteria as RubricCriterion[] }
}

/** Run one provider with retries and strict validation. Returns parsed output. */
async function runProvider(
  provider: EvalProvider,
  req: EvalRequest,
  schema: ReturnType<typeof buildOutputSchema>,
): Promise<{
  output: EvaluationOutput
  raw: string
  tokensIn: number
  tokensOut: number
  latencyMs: number
  modelVersion: string
}> {
  let lastErr: unknown
  for (let attempt = 0; attempt < 2; attempt++) {
    const start = performance.now()
    try {
      const res = await provider.evaluate(req)
      const parsed = schema.safeParse(res.json)
      if (!parsed.success) {
        lastErr = new Error(`schema validation failed: ${parsed.error.issues[0]?.message}`)
        continue
      }
      return {
        output: parsed.data as EvaluationOutput,
        raw: res.rawText,
        tokensIn: res.tokensInput,
        tokensOut: res.tokensOutput,
        latencyMs: Math.round(performance.now() - start),
        modelVersion: res.modelVersion,
      }
    } catch (err) {
      lastErr = err
    }
  }
  throw lastErr ?? new Error('provider failed')
}

/**
 * Evaluate a single written response. Idempotency is handled by the queue
 * (jobId); this function always inserts new immutable records (re-evaluation
 * creates new rows, never overwrites — rule 1.5).
 */
export async function evaluateWrittenResponse(
  writtenResponseId: string,
): Promise<EvaluationResultView> {
  const [wr] = await db
    .select()
    .from(writtenResponses)
    .where(eq(writtenResponses.id, writtenResponseId))
    .limit(1)
  if (!wr) throw new Error('written response not found')

  const [attempt] = await db.select().from(attempts).where(eq(attempts.id, wr.attemptId)).limit(1)
  if (!attempt) throw new Error('attempt not found')
  const [tt] = await db
    .select()
    .from(testTypes)
    .where(eq(testTypes.id, attempt.testTypeId))
    .limit(1)
  if (!tt) throw new Error('test type not found')

  const text = (wr.responseText ?? '').trim()
  const inputHash = createHash('sha256').update(text).digest('hex')

  // 1) Distress gate — before any AI call (build prompt §4.8).
  if (detectDistress(text)) {
    await db.insert(evaluations).values({
      subjectType: 'written_response',
      subjectId: writtenResponseId,
      userId: attempt.userId,
      testTypeId: tt.id,
      model: 'none',
      modelVersion: 'none',
      promptVersion: PROMPT_VERSION,
      inputHash,
      status: 'blocked_distress',
    })
    log.warn({ writtenResponseId }, 'distress signal — evaluation blocked, flagged for review')
    return {
      status: 'blocked_distress',
      usedMock: false,
      disagreement: false,
      supportMessage: true,
    }
  }

  if (text.length === 0) {
    return { status: 'failed', usedMock: false, disagreement: false }
  }

  // 2) Load versioned rubric.
  const rubric = await loadRubric(tt.id)
  if (!rubric) {
    await db.insert(evaluations).values({
      subjectType: 'written_response',
      subjectId: writtenResponseId,
      userId: attempt.userId,
      testTypeId: tt.id,
      model: 'none',
      modelVersion: 'none',
      promptVersion: PROMPT_VERSION,
      inputHash,
      status: 'needs_review',
    })
    return { status: 'needs_review', usedMock: false, disagreement: false }
  }

  // 3) Build hardened prompt.
  const systemPrompt = buildSystemPrompt(tt.nameEn, MAX_SCORE)
  const { userMessage, userText } = buildUserMessage({
    stimulus: wr.prompt,
    answer: text,
    criteria: rubric.criteria,
    maxScore: MAX_SCORE,
  })
  const req: EvalRequest = {
    systemPrompt,
    userMessage,
    userText,
    rubricCriteria: rubric.criteria.map((c) => ({ key: c.key, label: c.label })),
    maxScorePerCriterion: MAX_SCORE,
  }
  const schema = buildOutputSchema(rubric.criteria, MAX_SCORE)

  // 4) Select provider(s) — dual cross-check when two real providers exist.
  const { providers, usedMock } = selectProviders(true)
  const crosscheckGroup = providers.length > 1 ? randomUUID() : null

  const runs: { provider: EvalProvider; result: Awaited<ReturnType<typeof runProvider>> | null }[] =
    []
  for (const provider of providers) {
    try {
      const result = await runProvider(provider, req, schema)
      runs.push({ provider, result })
    } catch (err) {
      log.error({ err, provider: provider.name }, 'provider evaluation failed')
      runs.push({ provider, result: null })
    }
  }

  const good = runs.filter((r) => r.result)
  if (good.length === 0) {
    // All providers failed/malformed after retries → human review, never fake.
    await db.insert(evaluations).values({
      subjectType: 'written_response',
      subjectId: writtenResponseId,
      userId: attempt.userId,
      testTypeId: tt.id,
      model: providers[0]?.name ?? 'unknown',
      modelVersion: providers[0]?.modelId ?? 'unknown',
      promptVersion: PROMPT_VERSION,
      rubricVersion: String(rubric.version),
      inputHash,
      status: 'failed',
    })
    return { status: 'failed', usedMock, disagreement: false }
  }

  // 5) Dual cross-check.
  let disagreement = false
  if (good.length >= 2) {
    const a = averageScore(good[0]!.result!.output)
    const b = averageScore(good[1]!.result!.output)
    disagreement = Math.abs(a - b) > DISAGREEMENT_THRESHOLD
  }
  const overallStatus: 'completed' | 'needs_review' = disagreement ? 'needs_review' : 'completed'

  // 6) Store immutable audit records (one per provider run).
  for (const { provider, result } of good) {
    await db.insert(evaluations).values({
      subjectType: 'written_response',
      subjectId: writtenResponseId,
      userId: attempt.userId,
      testTypeId: tt.id,
      model: provider.name,
      modelVersion: result!.modelVersion,
      promptVersion: PROMPT_VERSION,
      rubricVersion: String(rubric.version),
      inputHash,
      rawOutput: result!.raw,
      parsedOutput: result!.output,
      tokensInput: result!.tokensIn,
      tokensOutput: result!.tokensOut,
      costUsd: String(costUsd(provider.name, result!.tokensIn, result!.tokensOut)),
      latencyMs: result!.latencyMs,
      status: disagreement ? 'needs_review' : 'completed',
      crosscheckGroup,
      disagreement,
    })
  }

  const primary = good[0]!.result!.output
  return {
    status: overallStatus,
    usedMock,
    disagreement,
    output: primary,
    averageScore: averageScore(primary),
  }
}

/**
 * Enqueue evaluation for a submitted written attempt's responses. Quota is
 * checked AND consumed here — before any AI call is scheduled (rule 4.7). Jobs
 * are idempotent via jobId, so double-clicks don't double-charge or duplicate.
 */
export async function requestEvaluation(
  userId: string,
  attemptId: string,
): Promise<{ queued: number; skippedForQuota: number }> {
  const [attempt] = await db
    .select()
    .from(attempts)
    .where(and(eq(attempts.id, attemptId), eq(attempts.userId, userId)))
    .limit(1)
  if (!attempt) throw new ApiError('not_found', 'Attempt not found')
  if (attempt.status !== 'submitted') {
    throw new ApiError('bad_request', 'Attempt must be submitted before evaluation')
  }

  const responses = await db
    .select({ id: writtenResponses.id, text: writtenResponses.responseText })
    .from(writtenResponses)
    .where(eq(writtenResponses.attemptId, attemptId))

  const evaluable = responses.filter((r) => (r.text ?? '').trim().length > 0)
  if (evaluable.length === 0) throw new ApiError('bad_request', 'No responses to evaluate')

  const ent = await getEntitlements(userId)
  if (ent.aiEvaluationsPerDay <= 0 && (await getBalance(userId)) <= 0) {
    throw new ApiError(
      'quota_exceeded',
      'AI evaluation is not included in your plan. Please upgrade or top up credits.',
    )
  }

  let queued = 0
  let skippedForQuota = 0
  for (const r of evaluable) {
    try {
      // Spends the plan's daily allowance first, then the user's credits.
      await reserveEvaluation(userId)
    } catch {
      skippedForQuota++
      continue
    }
    await enqueue(
      QUEUE_NAMES.evaluation,
      'evaluate',
      { writtenResponseId: r.id },
      { jobId: `eval_${r.id}` },
    )
    queued++
  }

  if (queued === 0) {
    throw new ApiError('quota_exceeded', 'You have reached your evaluation limit for today.')
  }
  return { queued, skippedForQuota }
}

/** Latest evaluation records for a written response (for the UI). */
export async function getEvaluationForResponse(writtenResponseId: string) {
  const rows = await db
    .select()
    .from(evaluations)
    .where(
      and(
        eq(evaluations.subjectType, 'written_response'),
        eq(evaluations.subjectId, writtenResponseId),
      ),
    )
    .orderBy(desc(evaluations.createdAt))
    .limit(2)
  return rows
}

export type AttemptEvaluationView = {
  ref: string
  prompt: string
  status: string
  distress: boolean
  output: EvaluationOutput | null
}

/** Per-item evaluation view for an attempt (owner only). */
export async function getAttemptEvaluations(
  userId: string,
  attemptId: string,
): Promise<AttemptEvaluationView[]> {
  const [attempt] = await db
    .select()
    .from(attempts)
    .where(and(eq(attempts.id, attemptId), eq(attempts.userId, userId)))
    .limit(1)
  if (!attempt) throw new ApiError('not_found', 'Attempt not found')

  const responses = await db
    .select()
    .from(writtenResponses)
    .where(eq(writtenResponses.attemptId, attemptId))

  const views: AttemptEvaluationView[] = []
  for (const r of responses) {
    const [latest] = await db
      .select()
      .from(evaluations)
      .where(and(eq(evaluations.subjectType, 'written_response'), eq(evaluations.subjectId, r.id)))
      .orderBy(desc(evaluations.createdAt))
      .limit(1)
    views.push({
      ref: r.itemRef,
      prompt: r.prompt,
      status: latest?.status ?? 'not_evaluated',
      distress: latest?.status === 'blocked_distress',
      output: (latest?.parsedOutput as EvaluationOutput | null) ?? null,
    })
  }
  return views
}
