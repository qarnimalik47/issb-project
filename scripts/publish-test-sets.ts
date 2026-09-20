/**
 * Publish a test type's questions and their numbered sets, making them playable.
 *
 * Deliberately a separate, per-type command rather than a flag on the importer.
 * The imported material (WAT, SCT, group discussion, lecturette) is third-party
 * derived and carries a rewrite obligation — see storage/content-import/README.md.
 * Running this is the moment someone takes responsibility for that content, so
 * it asks for the type by name and reports exactly what it changed.
 *
 *   npx tsx scripts/publish-test-sets.ts --type wat           # dry run
 *   npx tsx scripts/publish-test-sets.ts --type wat --apply
 */
import 'dotenv/config'
import { and, eq, inArray } from 'drizzle-orm'
import { db, sql as rawSql } from '../src/lib/db/index'
import { testTypes, questionBanks, questions } from '../src/lib/db/schema/content'

const apply = process.argv.includes('--apply')
const code = (() => {
  const i = process.argv.indexOf('--type')
  return i >= 0 ? process.argv[i + 1] : null
})()

async function main() {
  if (!code) throw new Error('Pass --type <code>, e.g. --type wat')

  const [tt] = await db
    .select({ id: testTypes.id, code: testTypes.code, nameEn: testTypes.nameEn })
    .from(testTypes)
    .where(eq(testTypes.code, code))
    .limit(1)
  if (!tt) throw new Error(`Unknown test type "${code}"`)

  const drafts = await db
    .select({ id: questions.id })
    .from(questions)
    .where(and(eq(questions.testTypeId, tt.id), eq(questions.status, 'draft')))

  const banks = await db
    .select({ id: questionBanks.id, title: questionBanks.title, status: questionBanks.status })
    .from(questionBanks)
    .where(eq(questionBanks.testTypeId, tt.id))
  const draftBanks = banks.filter((b) => b.status !== 'published')

  console.log('')
  console.log(`${tt.nameEn} (${tt.code})`)
  console.log(`  draft questions: ${drafts.length}`)
  console.log(`  draft sets:      ${draftBanks.length} of ${banks.length}`)

  if (!apply) {
    console.log('')
    console.log('dry run — nothing written. Re-run with --apply to publish.')
    console.log('Publishing means you have accepted responsibility for this content:')
    console.log('it is extracted from third-party material and should be rewritten first.')
    return
  }

  if (drafts.length) {
    await db
      .update(questions)
      .set({ status: 'published', updatedAt: new Date() })
      .where(
        inArray(
          questions.id,
          drafts.map((d) => d.id),
        ),
      )
  }
  if (draftBanks.length) {
    await db
      .update(questionBanks)
      .set({ status: 'published', updatedAt: new Date() })
      .where(
        inArray(
          questionBanks.id,
          draftBanks.map((b) => b.id),
        ),
      )
  }

  console.log('')
  console.log(`published ${drafts.length} question(s) and ${draftBanks.length} set(s).`)
}

main()
  .then(() => rawSql.end())
  .catch(async (err) => {
    console.error(err instanceof Error ? err.message : err)
    await rawSql.end().catch(() => {})
    process.exit(1)
  })
