/**
 * Build the core current-affairs library in one run.
 *
 *   npm run gk:gather:core
 *
 * Sequential on purpose: the free sources are shared infrastructure and a
 * parallel burst is the quickest way to get rate-limited. A topic that fails
 * is reported and the run continues, because one missing dossier should not
 * cost the other thirty.
 */
import 'dotenv/config'
import { gatherTopic } from '../src/lib/gk/topics'
import { narrativeProvider } from '../src/lib/gk/narrative'
import { CORE_CURRENT_AFFAIRS } from '../src/lib/gk/core-topics'
import { sql as rawSql } from '../src/lib/db/index'

const only = process.argv.slice(2)[0]
const list = only
  ? CORE_CURRENT_AFFAIRS.filter((t) => t.query.toLowerCase().includes(only.toLowerCase()))
  : CORE_CURRENT_AFFAIRS

let ok = 0
let failed = 0
let facts = 0
let cards = 0

try {
  const provider = narrativeProvider()
  console.warn(
    provider
      ? `Narrative writer: ${provider.name} (${provider.modelId})`
      : 'No AI key configured — gathering facts and sources only.',
  )
  console.warn(`Gathering ${list.length} topic(s)…\n`)

  for (const topic of list) {
    try {
      const result = await gatherTopic({ query: topic.query, section: topic.section })
      ok++
      facts += result.topic.facts.length
      cards += result.cardsCreated
      console.warn(
        `  ✓ ${result.topic.titleEn} — ${result.topic.facts.length} facts, ` +
          `${result.topic.points.length} sections, ${result.cardsCreated} cards`,
      )
    } catch (err) {
      failed++
      console.warn(`  ✗ ${topic.query} — ${err instanceof Error ? err.message : err}`)
    }
  }

  console.warn(
    `\n${ok} gathered, ${failed} failed. ${facts} facts and ${cards} flashcards in total.`,
  )
} finally {
  await rawSql.end()
}
