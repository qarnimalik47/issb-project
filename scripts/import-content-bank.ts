/**
 * Load the prepared content bank (storage/content-import) through the normal
 * bulk importer.
 *
 * The bank is built from third-party sources, so this deliberately refuses to
 * publish: rows land as drafts and go through the same review the schema's
 * rewrite gate exists for (licence_basis `third_party_unlicensed` →
 * staging_review_state `needs_rewrite`). Publishing is a human decision made
 * after rewriting, never a flag on an import script.
 *
 *   npx tsx scripts/import-content-bank.ts                 # dry run, prints a report
 *   npx tsx scripts/import-content-bank.ts --apply         # insert as drafts
 *   npx tsx scripts/import-content-bank.ts --type wat      # one test type only
 */
import 'dotenv/config'
import { readdir, readFile, stat } from 'node:fs/promises'
import path from 'node:path'
import { runBulkImport, type BulkImportReport } from '../src/lib/import/bulk'
import { db, sql as rawSql } from '../src/lib/db/index'
import { users } from '../src/lib/db/schema/identity'
import { eq } from 'drizzle-orm'

const ROOT = path.join(process.cwd(), 'storage', 'content-import')
const apply = process.argv.includes('--apply')
const typeFilter = (() => {
  const i = process.argv.indexOf('--type')
  return i >= 0 ? process.argv[i + 1] : null
})()

/** Imports are attributed to an admin; without one there is nothing to blame a row on. */
async function resolveImporterId(): Promise<string> {
  const [admin] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.role, 'admin'))
    .limit(1)
  if (!admin) {
    throw new Error(
      'No admin user found. Create one (npm run set-role) before importing, so imported rows have an owner.',
    )
  }
  return admin.id
}

function merge(into: BulkImportReport, from: BulkImportReport, label: string) {
  into.total += from.total
  into.valid += from.valid
  into.created += from.created
  into.published += from.published
  into.errors.push(
    ...from.errors.map((e) => ({ ...e, messages: e.messages.map((m) => `${label}: ${m}`) })),
  )
  into.duplicates.push(...from.duplicates.map((d) => ({ ...d, reason: `${label}: ${d.reason}` })))
  into.notPublished.push(...from.notPublished)
}

async function main() {
  const userId = await resolveImporterId()

  let typeDirs: string[]
  try {
    typeDirs = (await readdir(ROOT, { withFileTypes: true }))
      .filter((e) => e.isDirectory() && !e.name.startsWith('_'))
      .map((e) => e.name)
      .sort()
  } catch {
    throw new Error(
      `No content bank at ${ROOT}. Build it first (resource-bank/_tools/extract/build.mjs).`,
    )
  }
  if (typeFilter) typeDirs = typeDirs.filter((t) => t === typeFilter)
  if (typeDirs.length === 0) throw new Error('Nothing to import (check --type).')

  const overall: BulkImportReport = {
    format: 'json',
    dryRun: !apply,
    total: 0,
    valid: 0,
    created: 0,
    published: 0,
    errors: [],
    duplicates: [],
    notPublished: [],
  }

  for (const type of typeDirs) {
    const dir = path.join(ROOT, type)
    const parts = (await readdir(dir)).filter((f) => f.endsWith('.json')).sort()
    for (const part of parts) {
      const file = path.join(dir, part)
      if (!(await stat(file)).size) continue
      const report = await runBulkImport({
        content: await readFile(file, 'utf8'),
        format: 'json',
        dryRun: !apply,
        // Never true: see the header. Rows arrive as drafts for review.
        publish: false,
        userId,
      })
      merge(overall, report, `${type}/${part}`)
      console.log(
        `${type.padEnd(18)} ${part.padEnd(24)} total ${String(report.total).padStart(4)}` +
          `  new ${String(report.valid).padStart(4)}` +
          `  ${apply ? 'created' : 'would create'} ${String(report.created || report.valid).padStart(4)}` +
          `  dupes ${String(report.duplicates.length).padStart(4)}` +
          `  errors ${report.errors.length}`,
      )
    }
  }

  console.log('')
  console.log(apply ? '── imported ──' : '── dry run (nothing written) ──')
  console.log(`rows read:      ${overall.total}`)
  console.log(`new & valid:    ${overall.valid}`)
  console.log(`created:        ${overall.created}`)
  console.log(`duplicates:     ${overall.duplicates.length}`)
  console.log(`errors:         ${overall.errors.length}`)
  if (overall.errors.length) {
    console.log('')
    console.log('first errors:')
    for (const e of overall.errors.slice(0, 15))
      console.log(`  line ${e.line}: ${e.messages.join(' | ')}`)
  }
  console.log('')
  console.log('All rows are drafts. They are third-party derived: rewrite before publishing.')
}

main()
  .then(() => rawSql.end())
  .catch(async (err) => {
    console.error(err instanceof Error ? err.message : err)
    await rawSql.end().catch(() => {})
    process.exit(1)
  })
