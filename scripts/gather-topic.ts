/**
 * Build or refresh a current-affairs dossier from the command line.
 *
 *   npm run gk:gather -- "Iran-Israel conflict" conflict
 *   npm run gk:gather -- "Kashmir conflict"
 *
 * Same code path as the admin button, so it is the way to populate the library
 * in bulk without clicking through the UI. Sections: conflict, pakistan,
 * diplomacy, economy, organisations, defence.
 */
import 'dotenv/config'
import { gatherTopic, CURRENT_AFFAIRS_SECTIONS } from '../src/lib/gk/topics'
import { narrativeProvider } from '../src/lib/gk/narrative'
import { sql as rawSql } from '../src/lib/db/index'

const [query, sectionArg] = process.argv.slice(2)
const section = sectionArg ?? 'conflict'

try {
  if (!query) {
    console.error('Usage: npm run gk:gather -- "<topic>" [section]')
    process.exitCode = 1
  } else if (!(CURRENT_AFFAIRS_SECTIONS as readonly string[]).includes(section)) {
    console.error(`Unknown section "${section}". One of: ${CURRENT_AFFAIRS_SECTIONS.join(', ')}`)
    process.exitCode = 1
  } else {
    const provider = narrativeProvider()
    console.warn(
      provider
        ? `Narrative writer: ${provider.name} (${provider.modelId})`
        : 'No AI key configured — gathering facts and sources only.',
    )
    const { topic, usedNarrative, cardsCreated } = await gatherTopic({ query, section })
    console.warn(
      `✓ ${topic.titleEn} — ${topic.facts.length} facts, ${topic.points.length} sections, ` +
        `${topic.timeline.length} dated events, ${cardsCreated} flashcards` +
        (usedNarrative ? `, written by ${topic.narrativeModel}` : ', facts only'),
    )
    console.warn(`  /gk/current-affairs/${topic.slug}`)
  }
} catch (err) {
  console.error('✗ Gather failed:', err instanceof Error ? err.message : err)
  process.exitCode = 1
} finally {
  await rawSql.end()
}
