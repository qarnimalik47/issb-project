/**
 * Accuracy-measurement harness (build prompt §5): runs the evaluator over an
 * expert-rated sample set and reports agreement (mean absolute error and
 * within-1 agreement rate) between the system and the expert scores.
 *
 *   npm run eval:accuracy
 *
 * NOTE: with the mock provider this is illustrative of the harness only. Real
 * accuracy acceptance (≥300 expert-rated responses, measured with a real
 * provider) is required before the AI feature is accepted — see docs/backlog.md.
 */
import 'dotenv/config'
import { mockProvider, selectProviders } from '../src/lib/eval/providers'
import { buildOutputSchema, averageScore, type EvaluationOutput } from '../src/lib/eval/schema'
import { buildSystemPrompt, buildUserMessage } from '../src/lib/eval/prompts'

const CRITERIA = [
  { key: 'responsibility', label: 'Responsibility' },
  { key: 'initiative', label: 'Initiative' },
  { key: 'planning', label: 'Planning' },
  { key: 'expression', label: 'Expression' },
]
const MAX = 5

// Small expert-rated fixture (answer + expert average 1..5). Replace/extend
// with the real expert-rated set for production acceptance.
const SAMPLES: { answer: string; expertAvg: number }[] = [
  {
    answer: 'I calmly organised the team, delegated tasks and we solved it responsibly.',
    expertAvg: 4.5,
  },
  {
    answer: 'I took charge, planned the route and led everyone to safety with determination.',
    expertAvg: 4.5,
  },
  { answer: 'I panicked and did nothing.', expertAvg: 1.5 },
  { answer: 'ok', expertAvg: 1 },
  { answer: 'I helped my friend and reported the issue to the teacher honestly.', expertAvg: 3.5 },
]

async function run() {
  const { usedMock } = selectProviders(false)
  const schema = buildOutputSchema(CRITERIA, MAX)
  let mae = 0
  let within1 = 0

  for (const s of SAMPLES) {
    const { userMessage, userText } = buildUserMessage({
      stimulus: 'Situation reaction',
      answer: s.answer,
      criteria: CRITERIA,
      maxScore: MAX,
    })
    const res = await mockProvider.evaluate({
      systemPrompt: buildSystemPrompt('SRT', MAX),
      userMessage,
      userText,
      rubricCriteria: CRITERIA,
      maxScorePerCriterion: MAX,
    })
    const out = schema.parse(res.json) as EvaluationOutput
    const sysAvg = averageScore(out)
    const err = Math.abs(sysAvg - s.expertAvg)
    mae += err
    if (err <= 1) within1++
    console.log(`  expert=${s.expertAvg}  system=${sysAvg.toFixed(2)}  |Δ|=${err.toFixed(2)}`)
  }

  console.log(`\nProvider: ${usedMock ? 'mock (illustrative only)' : 'real'}`)
  console.log(`Samples: ${SAMPLES.length}`)
  console.log(`Mean absolute error: ${(mae / SAMPLES.length).toFixed(2)}`)
  console.log(`Within-1 agreement: ${((within1 / SAMPLES.length) * 100).toFixed(0)}%`)
  if (usedMock) {
    console.log('\n⚠ Mock provider in use — not a valid accuracy result. Configure a real')
    console.log('  provider key and a ≥300 expert-rated set for production acceptance.')
  }
}

run().then(() => process.exit(0))
