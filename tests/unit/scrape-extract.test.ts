import { describe, it, expect } from 'vitest'
import { extractFromHtml } from '../../src/lib/scrape/extract'
import {
  REWRITE_MAX_SIMILARITY,
  isSufficientlyRewritten,
  rewriteSimilarity,
  textSimilarity,
} from '../../src/lib/content/similarity'

const page = (body: string) => `<html><head><script>var x=1</script></head><body>
<nav><ul><li>Home</li><li>About</li></ul></nav>${body}
<footer>© Site</footer></body></html>`

describe('extractFromHtml', () => {
  it('reads list-based questions with an answer callout and explanation', () => {
    const { items, interstitial } = extractFromHtml(
      page(`
      <p>Q1. Which gas do plants absorb from the air?</p>
      <ol><li>(a) Oxygen</li><li>(b) Carbon dioxide</li><li>(c) Nitrogen</li><li>(d) Helium</li></ol>
      <p>Answer: B</p>
      <p>Explanation: Plants take in carbon dioxide for photosynthesis.</p>`),
    )
    expect(interstitial).toBeNull()
    expect(items).toHaveLength(1)
    const q = items[0]!
    expect(q.stemEn).toBe('Which gas do plants absorb from the air?')
    expect(q.options.map((o) => `${o.key}:${o.textEn}`)).toEqual([
      'A:Oxygen',
      'B:Carbon dioxide',
      'C:Nitrogen',
      'D:Helium',
    ])
    expect(q.correctOption).toBe('B')
    expect(q.explanation).toMatch(/photosynthesis/)
    expect(q.confidence).toBe(1)
  })

  it('ignores navigation lists and honours a marked-correct option', () => {
    const { items } = extractFromHtml(
      page(`<h3>The capital of Pakistan is</h3>
      <ul><li>Lahore</li><li class="correct">Islamabad</li><li>Karachi</li></ul>`),
    )
    expect(items).toHaveLength(1)
    expect(items[0]!.correctOption).toBe('B')
  })

  it('reads option tables', () => {
    const { items } = extractFromHtml(
      page(`<p>Which is a prime number?</p>
      <table><tr><td>A</td><td>9</td></tr><tr><td>B</td><td>7</td></tr><tr><td>C</td><td>15</td></tr></table>
      <div>Correct answer: (b)</div>`),
    )
    expect(items[0]!.options.map((o) => o.textEn)).toEqual(['9', '7', '15'])
    expect(items[0]!.correctOption).toBe('B')
  })

  it('falls back to text heuristics when there is no structure', () => {
    const { items } = extractFromHtml(
      page(`<div>1. What is 2 + 2? A) 3 B) 4 C) 5 D) 6 Answer: B</div>`),
    )
    expect(items).toHaveLength(1)
    expect(items[0]!.correctOption).toBe('B')
  })

  it('caps confidence for figure-dependent questions and penalises furniture', () => {
    const { items } = extractFromHtml(
      page(`<p><img src="fig.png"> Which figure completes the series?</p>
      <ol><li>1</li><li>2</li><li>3</li><li>4</li></ol><p>Answer: C</p>
      <p>Click here to share this question on social media</p>
      <ol><li>Yes</li><li>No</li></ol>`),
    )
    expect(items[0]!.hasFigure).toBe(true)
    expect(items[0]!.confidence).toBeLessThanOrEqual(0.4)
    const furniture = items.find((i) => /Click here/.test(i.stemEn))!
    expect(furniture.confidence).toBeLessThan(0.5)
  })

  it('skips login and paywall interstitials instead of staging the teaser', () => {
    const r = extractFromHtml(
      page(`<p>Which is the largest planet?</p><ol><li>Mars</li><li>Jupiter</li></ol>
      <div class="gate">Subscribe to view all 500 questions and answers.</div>`),
    )
    expect(r.interstitial).toBe('subscribe to view')
    expect(r.items).toEqual([])
  })
})

describe('rewrite similarity', () => {
  const source = {
    stemEn: 'Which gas do plants absorb from the air during photosynthesis?',
    explanation: 'Plants take in carbon dioxide and release oxygen as a by-product.',
  }

  it('is 1 for a verbatim copy and high for a one-word tweak', () => {
    expect(rewriteSimilarity(source, source)).toBe(1)
    const tweaked = { ...source, stemEn: source.stemEn.replace('Which gas', 'Which one gas') }
    expect(isSufficientlyRewritten(rewriteSimilarity(source, tweaked))).toBe(false)
  })

  it('passes a genuine rewording', () => {
    const rewrite = {
      stemEn: 'During photosynthesis, a leaf takes in one gas from its surroundings. Name it.',
      explanation: 'Leaves use carbon dioxide to build sugars, giving off oxygen.',
    }
    const sim = rewriteSimilarity(source, rewrite)
    expect(sim).toBeLessThanOrEqual(REWRITE_MAX_SIMILARITY)
  })

  it('handles empty and very short texts', () => {
    expect(textSimilarity('', 'anything')).toBe(0)
    expect(textSimilarity('Capital of Pakistan?', 'Capital of Pakistan')).toBe(1)
  })
})
