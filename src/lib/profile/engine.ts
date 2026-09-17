/**
 * Cross-test personality profile engine (Phase 6 — the core differentiator).
 *
 * Aggregates completed rubric evaluations into per-quality scores with evidence
 * (the user's own words), detects contradictions across test types, estimates a
 * confidence level from coverage, and derives a study plan. Pure aggregation of
 * stored evaluations — no new AI calls here.
 */
import { and, eq, inArray } from 'drizzle-orm'
import { db } from '../db/index'
import { evaluations } from '../db/schema/attempts'
import { testTypes } from '../db/schema/content'
import type { EvaluationOutput } from '../eval/schema'

export type QualityAggregate = {
  key: string
  score: number // mean 1..5
  count: number
  evidence: string[]
}

export type Contradiction = {
  quality: string
  high: { test: string; score: number; evidence: string }
  low: { test: string; score: number; evidence: string }
  note: string
}

export type ProfileConfidence = {
  level: 'low' | 'medium' | 'high'
  testsCompleted: number
  rubricTestsTotal: number
  coverage: number // 0..1
}

export type Profile = {
  qualities: QualityAggregate[]
  contradictions: Contradiction[]
  confidence: ProfileConfidence
  authenticity: { rehearsedSignal: boolean; note: string }
}

const CONTRADICTION_GAP = 2 // score gap across tests that flags a contradiction

export async function computeProfile(userId: string): Promise<Profile> {
  const rows = await db
    .select()
    .from(evaluations)
    .where(and(eq(evaluations.userId, userId), eq(evaluations.status, 'completed')))

  // Resolve test-type names for grouping/labels.
  const ttIds = [...new Set(rows.map((r) => r.testTypeId).filter(Boolean))] as string[]
  const tts = ttIds.length
    ? await db.select().from(testTypes).where(inArray(testTypes.id, ttIds))
    : []
  const nameById = new Map(tts.map((t) => [t.id, t.code]))

  // Aggregate per quality (overall) and per (test, quality) for contradictions.
  const overall = new Map<string, { total: number; count: number; evidence: string[] }>()
  const perTest = new Map<string, Map<string, { total: number; count: number; evidence: string }>>()
  const allEvidence: string[] = []

  for (const row of rows) {
    const out = row.parsedOutput as EvaluationOutput | null
    if (!out?.criteria) continue
    const testCode = (row.testTypeId && nameById.get(row.testTypeId)) || 'unknown'
    for (const [quality, c] of Object.entries(out.criteria)) {
      const o = overall.get(quality) ?? { total: 0, count: 0, evidence: [] }
      o.total += c.score
      o.count += 1
      if (c.evidence && o.evidence.length < 5) o.evidence.push(c.evidence)
      overall.set(quality, o)
      allEvidence.push(c.evidence)

      const tmap = perTest.get(testCode) ?? new Map()
      const t = tmap.get(quality) ?? { total: 0, count: 0, evidence: c.evidence }
      t.total += c.score
      t.count += 1
      tmap.set(quality, t)
      perTest.set(testCode, tmap)
    }
  }

  const qualities: QualityAggregate[] = [...overall.entries()]
    .map(([key, v]) => ({
      key,
      score: Number((v.total / v.count).toFixed(2)),
      count: v.count,
      evidence: v.evidence,
    }))
    .sort((a, b) => b.score - a.score)

  // Contradiction detection: for each quality, compare per-test averages.
  const contradictions: Contradiction[] = []
  const qualityKeys = new Set(qualities.map((q) => q.key))
  for (const quality of qualityKeys) {
    const points: { test: string; score: number; evidence: string }[] = []
    for (const [test, tmap] of perTest.entries()) {
      const t = tmap.get(quality)
      if (t) points.push({ test, score: t.total / t.count, evidence: t.evidence })
    }
    if (points.length < 2) continue
    points.sort((a, b) => b.score - a.score)
    const high = points[0]!
    const low = points[points.length - 1]!
    if (high.score - low.score >= CONTRADICTION_GAP) {
      contradictions.push({
        quality,
        high: { test: high.test, score: Number(high.score.toFixed(2)), evidence: high.evidence },
        low: { test: low.test, score: Number(low.score.toFixed(2)), evidence: low.evidence },
        note: `"${quality}" appears strong in ${high.test} but weak in ${low.test}. The board looks for consistency across tests.`,
      })
    }
  }

  // Confidence from coverage of rubric test types completed.
  const rubricTotal = (await db.select().from(testTypes).where(eq(testTypes.scoringType, 'rubric')))
    .length
  const testsCompleted = perTest.size
  const coverage = rubricTotal > 0 ? Math.min(1, testsCompleted / rubricTotal) : 0
  const level: ProfileConfidence['level'] =
    coverage >= 0.66 ? 'high' : coverage >= 0.33 ? 'medium' : 'low'

  // Authenticity: crude rehearsed-signal heuristic — very low lexical diversity
  // across evidence suggests memorised/template answers.
  const joined = allEvidence.join(' ').toLowerCase()
  const tokens = joined.split(/\s+/).filter(Boolean)
  const uniqueRatio = tokens.length > 0 ? new Set(tokens).size / tokens.length : 1
  const rehearsedSignal = tokens.length > 40 && uniqueRatio < 0.4

  return {
    qualities,
    contradictions,
    confidence: {
      level,
      testsCompleted,
      rubricTestsTotal: rubricTotal,
      coverage: Number(coverage.toFixed(2)),
    },
    authenticity: {
      rehearsedSignal,
      note: rehearsedSignal
        ? 'Responses look repetitive/templated. The board penalises rehearsed answers — use your own varied words.'
        : 'No strong signal of rehearsed/templated answers.',
    },
  }
}

export type StudyPlanItem = { quality: string; score: number; recommendation: string }
export type StudyPlan = {
  daysToTarget: number | null
  weakAreas: StudyPlanItem[]
  focus: string[]
}

export function buildStudyPlan(profile: Profile, targetIssbDate: string | null): StudyPlan {
  const weak = profile.qualities
    .filter((q) => q.score < 3.5)
    .sort((a, b) => a.score - b.score)
    .slice(0, 5)
    .map((q) => ({
      quality: q.key,
      score: q.score,
      recommendation: `Practise scenarios that demonstrate ${q.key.replace(/_/g, ' ')} with concrete, personal examples.`,
    }))

  let daysToTarget: number | null = null
  if (targetIssbDate) {
    const diff = new Date(targetIssbDate).getTime() - Date.now()
    daysToTarget = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
  }

  const focus: string[] = []
  if (profile.confidence.level === 'low') {
    focus.push('Complete more tests — your profile confidence is low, so results are provisional.')
  }
  if (profile.contradictions.length > 0) {
    focus.push('Resolve contradictions across tests by being consistent and authentic.')
  }
  return { daysToTarget, weakAreas: weak, focus }
}
