'use client'

import { useEffect, useState } from 'react'

type Quality = { key: string; score: number; count: number; evidence: string[] }
type Contradiction = {
  quality: string
  note: string
  high: { test: string; score: number }
  low: { test: string; score: number }
}
type Profile = {
  qualities: Quality[]
  contradictions: Contradiction[]
  confidence: { level: string; testsCompleted: number; rubricTestsTotal: number; coverage: number }
  authenticity: { rehearsedSignal: boolean; note: string }
}
type StudyPlan = {
  daysToTarget: number | null
  weakAreas: { quality: string; score: number; recommendation: string }[]
  focus: string[]
}

export function ProfileInsights() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [plan, setPlan] = useState<StudyPlan | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/me/profile')
      .then((r) => r.json())
      .then((d) => {
        setProfile(d.profile)
        setPlan(d.studyPlan)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="text-neutral-500">Building your profile…</p>
  if (!profile) return <p className="text-red-600">Could not load profile.</p>

  if (profile.qualities.length === 0) {
    return (
      <div className="rounded-md border border-neutral-200 p-6 text-sm dark:border-neutral-800">
        Complete and evaluate some written tests to build your personality profile.
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div
        className={`rounded-md border p-4 text-sm ${
          profile.confidence.level === 'low'
            ? 'border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-950'
            : 'border-neutral-200 dark:border-neutral-800'
        }`}
      >
        <strong>Profile confidence: {profile.confidence.level.toUpperCase()}</strong> — based on{' '}
        {profile.confidence.testsCompleted}/{profile.confidence.rubricTestsTotal} test types.
        {profile.confidence.level === 'low' && ' Results are provisional; complete more tests.'}
      </div>

      <section>
        <h2 className="mb-2 text-lg font-semibold">Qualities</h2>
        <div className="flex flex-col gap-3">
          {profile.qualities.map((q) => (
            <div
              key={q.key}
              className="rounded-lg border border-neutral-200 p-3 dark:border-neutral-800"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium capitalize">{q.key.replace(/_/g, ' ')}</span>
                <span className="text-sm">{q.score} / 5</span>
              </div>
              <div className="mt-1 h-2 rounded bg-neutral-100 dark:bg-neutral-800">
                <div
                  className="h-2 rounded bg-neutral-900 dark:bg-white"
                  style={{ width: `${(q.score / 5) * 100}%` }}
                />
              </div>
              {q.evidence[0] && <p className="mt-1 text-xs text-neutral-500">“{q.evidence[0]}”</p>}
            </div>
          ))}
        </div>
      </section>

      {profile.contradictions.length > 0 && (
        <section>
          <h2 className="mb-2 text-lg font-semibold text-red-600">Contradictions</h2>
          <div className="flex flex-col gap-2">
            {profile.contradictions.map((c, i) => (
              <div
                key={i}
                className="rounded-md border border-red-200 p-3 text-sm dark:border-red-900"
              >
                {c.note}
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="rounded-md border border-neutral-200 p-3 text-sm dark:border-neutral-800">
        <strong>Authenticity:</strong> {profile.authenticity.note}
      </section>

      {plan && (
        <section>
          <h2 className="mb-2 text-lg font-semibold">Study plan</h2>
          {plan.daysToTarget != null && (
            <p className="mb-2 text-sm text-neutral-600 dark:text-neutral-400">
              {plan.daysToTarget} days to your target ISSB date.
            </p>
          )}
          <ul className="list-inside list-disc text-sm">
            {plan.focus.map((f, i) => (
              <li key={`f${i}`}>{f}</li>
            ))}
            {plan.weakAreas.map((w, i) => (
              <li key={`w${i}`}>{w.recommendation}</li>
            ))}
          </ul>
        </section>
      )}

      <a
        href="/api/me/report"
        className="w-fit rounded-md bg-neutral-900 px-4 py-2 text-sm text-white dark:bg-white dark:text-neutral-900"
      >
        Download PDF report
      </a>
    </div>
  )
}
