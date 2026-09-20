'use client'

import { useEffect, useState } from 'react'

const inputCls =
  'w-full rounded-md border border-line-strong px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900'

export function PiqBuilder() {
  const [form, setForm] = useState({
    age: '',
    education: '',
    hobbies: '',
    gamesAndSports: '',
    positionsOfResponsibility: '',
    strengths: '',
    weaknesses: '',
    whyJoin: '',
  })
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/piq')
      .then((r) => r.json())
      .then((d) => {
        if (d.piq) {
          setForm({
            age: d.piq.age?.toString() ?? '',
            education: d.piq.education ?? '',
            hobbies: (d.piq.hobbies ?? []).join(', '),
            gamesAndSports: (d.piq.gamesAndSports ?? []).join(', '),
            positionsOfResponsibility: d.piq.positionsOfResponsibility ?? '',
            strengths: d.piq.strengths ?? '',
            weaknesses: d.piq.weaknesses ?? '',
            whyJoin: d.piq.whyJoin ?? '',
          })
        }
      })
      .finally(() => setLoading(false))
  }, [])

  async function save(e: React.FormEvent) {
    e.preventDefault()
    setSaved(false)
    const body = {
      age: form.age ? Number(form.age) : undefined,
      education: form.education || undefined,
      hobbies: form.hobbies
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      gamesAndSports: form.gamesAndSports
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      positionsOfResponsibility: form.positionsOfResponsibility || undefined,
      strengths: form.strengths || undefined,
      weaknesses: form.weaknesses || undefined,
      whyJoin: form.whyJoin || undefined,
    }
    const res = await fetch('/api/piq', {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (res.ok) setSaved(true)
  }

  if (loading) return <p className="text-ink-muted">Loading…</p>

  const field = (label: string, key: keyof typeof form, hint?: string) => (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium">{label}</label>
      {hint && <span className="text-xs text-ink-muted">{hint}</span>}
      {key === 'positionsOfResponsibility' ||
      key === 'strengths' ||
      key === 'weaknesses' ||
      key === 'whyJoin' ? (
        <textarea
          rows={2}
          value={form[key]}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          className={inputCls}
        />
      ) : (
        <input
          value={form[key]}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          className={inputCls}
        />
      )}
    </div>
  )

  return (
    <form onSubmit={save} className="flex flex-col gap-4">
      {field('Age', 'age')}
      {field('Education', 'education')}
      {field('Hobbies', 'hobbies', 'comma-separated')}
      {field('Games & sports', 'gamesAndSports', 'comma-separated')}
      {field('Positions of responsibility', 'positionsOfResponsibility')}
      {field('Strengths', 'strengths')}
      {field('Weaknesses', 'weaknesses')}
      {field('Why do you want to join?', 'whyJoin')}
      <div className="flex items-center gap-3">
        <button className="w-fit rounded-md bg-brand-600 px-4 py-2 text-sm text-white hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-400">
          Save PIQ
        </button>
        {saved && <span className="text-sm text-green-600">Saved ✓</span>}
      </div>
    </form>
  )
}
