'use client'

import { useState } from 'react'
import type { BulkImportReport } from '@/lib/import/bulk'
import { csvCell } from '@/lib/import/csv'

const btnCls =
  'rounded-lg border border-line-strong px-3 py-1.5 text-sm font-medium hover:bg-sunk disabled:opacity-40 dark:border-neutral-700 dark:hover:bg-neutral-800'
const primaryCls =
  'rounded-lg bg-brand-700 px-4 py-2 text-sm font-medium text-white hover:bg-brand-800 disabled:opacity-40 dark:bg-brand-500 dark:text-brand-950'

/** A header row plus one worked example, so authors start from a valid file. */
function templateCsv(columns: readonly string[]): string {
  const example: Record<string, string> = {
    test_type: 'verbal',
    stem_en: 'Choose the word closest in meaning to BRAVE.',
    stem_ur: 'وہ لفظ منتخب کریں جس کے معنی BRAVE کے سب سے قریب ہوں۔',
    option_a_en: 'Timid',
    option_b_en: 'Courageous',
    option_c_en: 'Lazy',
    option_d_en: 'Quiet',
    correct_option: 'B',
    explanation_en: 'Brave and courageous both mean showing no fear.',
    difficulty: 'easy',
    topic: 'synonyms',
  }
  return [columns.join(','), columns.map((c) => csvCell(example[c] ?? '')).join(',')].join('\r\n')
}

export function BulkImportPanel({
  columns,
  testTypeCodes,
}: {
  columns: readonly string[]
  testTypeCodes: string[]
}) {
  const [file, setFile] = useState<File | null>(null)
  const [dryRun, setDryRun] = useState(true)
  const [publish, setPublish] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [report, setReport] = useState<BulkImportReport | null>(null)

  async function run(asDryRun: boolean) {
    if (!file) return
    setBusy(true)
    setError('')
    const form = new FormData()
    form.set('file', file)
    form.set('dryRun', String(asDryRun))
    form.set('publish', String(publish))
    const res = await fetch('/api/admin/questions/import', { method: 'POST', body: form })
    const body = await res.json().catch(() => null)
    setBusy(false)
    if (!res.ok) {
      setError(body?.error?.message ?? 'Import failed')
      return
    }
    setReport(body.report)
    if (!asDryRun) setDryRun(true)
  }

  function downloadTemplate() {
    const blob = new Blob([templateCsv(columns)], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'question-import-template.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const unit = report?.format === 'json' ? 'Item' : 'Line'

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-xl border border-line p-5 text-sm">
        <h2 className="font-display font-semibold text-ink">File format</h2>
        <p className="mt-2 text-ink-muted">
          <strong>CSV</strong> (from any spreadsheet — save as “CSV UTF-8” so Urdu survives) with a
          header row. Required columns: <code>test_type</code>, <code>stem_en</code>. Options go in{' '}
          <code>option_a_en</code>…<code>option_h_en</code> with optional <code>_ur</code> partners,
          filled from A with no gaps; <code>correct_option</code> is the letter.
        </p>
        <p className="mt-2 text-ink-muted">
          <strong>JSON</strong>: an array shaped like the seed files —{' '}
          <code>
            {
              '{ testTypeCode, stemEn, stemUr, options: [{ key, textEn, textUr }], correctOption, explanationEn, topic, difficulty, mediaId }'
            }
          </code>
          .
        </p>
        <p className="mt-2 text-ink-muted">
          Test type codes:{' '}
          {testTypeCodes.map((c) => (
            <code key={c} className="me-1">
              {c}
            </code>
          ))}
        </p>
        <button type="button" className={`${btnCls} mt-3`} onClick={downloadTemplate}>
          Download CSV template
        </button>
      </section>

      <section className="flex flex-col gap-3 rounded-xl border border-line p-5">
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          File
          <input
            type="file"
            accept=".csv,.json,text/csv,application/json"
            onChange={(e) => {
              setFile(e.target.files?.[0] ?? null)
              setReport(null)
              setDryRun(true)
            }}
          />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={dryRun} onChange={(e) => setDryRun(e.target.checked)} />
          Dry run — check the file and report, but import nothing
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={publish} onChange={(e) => setPublish(e.target.checked)} />
          Publish rows that are ready (answerable); everything else is imported as a draft
        </label>
        <div>
          <button
            type="button"
            className={primaryCls}
            disabled={!file || busy}
            onClick={() => void run(dryRun)}
          >
            {busy ? 'Working…' : dryRun ? 'Check file' : 'Import'}
          </button>
        </div>
        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}
      </section>

      {report && (
        <section
          aria-live="polite"
          className="flex flex-col gap-4 rounded-xl border border-line p-5 text-sm"
        >
          <h2 className="font-display font-semibold text-ink">
            {report.dryRun ? 'Dry run — nothing was imported' : 'Import finished'}
          </h2>
          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            {(
              [
                ['Rows read', report.total],
                [
                  report.dryRun ? 'Would create' : 'Created',
                  report.dryRun ? report.valid : report.created,
                ],
                [report.dryRun ? 'Would publish' : 'Published', report.published],
                ['Duplicates', report.duplicates.length],
                ['Errors', report.errors.length],
              ] as const
            ).map(([label, value]) => (
              <div key={label} className="rounded-lg bg-sunk p-3">
                <dt className="text-ink-muted">{label}</dt>
                <dd className="m-0 text-xl font-semibold tabular-nums">{value}</dd>
              </div>
            ))}
          </dl>

          {report.errors.length > 0 && (
            <div>
              <h3 className="font-semibold text-red-700 dark:text-red-300">
                Errors — these rows were skipped
              </h3>
              <ul className="mt-1 flex flex-col gap-1">
                {report.errors.map((e) => (
                  <li key={`e${e.line}`}>
                    <span className="font-mono">
                      {unit} {e.line}:
                    </span>{' '}
                    {e.messages.join('; ')}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {report.notPublished.length > 0 && (
            <div>
              <h3 className="font-semibold text-amber-700 dark:text-amber-300">
                Imported as drafts — not ready to publish
              </h3>
              <ul className="mt-1 flex flex-col gap-1">
                {report.notPublished.map((n) => (
                  <li key={`n${n.line}`}>
                    <span className="font-mono">
                      {unit} {n.line}:
                    </span>{' '}
                    {n.reasons.join('; ')}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {report.duplicates.length > 0 && (
            <div>
              <h3 className="font-semibold">Duplicates — skipped</h3>
              <ul className="mt-1 flex flex-col gap-1 text-ink-muted">
                {report.duplicates.map((d) => (
                  <li key={`d${d.line}`}>
                    <span className="font-mono">
                      {unit} {d.line}:
                    </span>{' '}
                    {d.reason}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {report.dryRun && report.valid > 0 && (
            <div className="flex items-center gap-3 border-t border-line pt-4">
              <button
                type="button"
                className={primaryCls}
                disabled={busy}
                onClick={() => void run(false)}
              >
                Import {report.valid} row{report.valid === 1 ? '' : 's'} now
              </button>
              {report.errors.length > 0 && (
                <span className="text-ink-muted">Rows with errors will be skipped.</span>
              )}
            </div>
          )}
          {!report.dryRun && report.created > 0 && (
            <a href="/admin/questions" className="font-medium underline">
              Open the question bank →
            </a>
          )}
        </section>
      )}
    </div>
  )
}
