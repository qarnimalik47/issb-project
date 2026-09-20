/**
 * How close a reviewer's rewrite still is to the scraped source — the number
 * behind the rewrite gate. Computed live in the review UI and re-verified on
 * the server at save and approve time, so the gate cannot be satisfied by
 * editing the page.
 *
 * Measures prose only (stem + explanation). Options are usually facts — a
 * city, a year, a number — which cannot and need not be reworded; free prose
 * is where copying of expression lives.
 *
 * Word-trigram overlap coefficient: shared trigrams ÷ the smaller set. Unlike
 * Jaccard it isn't diluted by padding a copied sentence with extra words, and
 * inserting a single word into a copied stem still scores high. It is a floor
 * that forces a genuine rewording pass, not proof of originality. Pure and
 * dependency-free so the client can import it.
 */
export const REWRITE_MAX_SIMILARITY = 0.4

function tokens(text: string): string[] {
  return (
    text
      .normalize('NFKC')
      .toLowerCase()
      .match(/[\p{L}\p{N}]+/gu) ?? []
  )
}

function grams(words: string[]): Set<string> {
  // Too short for trigrams: fall back to single words.
  if (words.length < 3) return new Set(words)
  const out = new Set<string>()
  for (let i = 0; i + 2 < words.length; i++) out.add(`${words[i]} ${words[i + 1]} ${words[i + 2]}`)
  return out
}

/** Overlap of two texts, 0 (nothing shared) to 1 (one contains the other). */
export function textSimilarity(a: string, b: string): number {
  const ga = grams(tokens(a))
  const gb = grams(tokens(b))
  if (ga.size === 0 || gb.size === 0) return 0
  let shared = 0
  for (const g of ga) if (gb.has(g)) shared++
  return Math.round((shared / Math.min(ga.size, gb.size)) * 100) / 100
}

type Prose = { stemEn?: string | null; explanation?: string | null }

export function rewriteSimilarity(source: Prose, rewrite: Prose): number {
  const join = (p: Prose) => [p.stemEn ?? '', p.explanation ?? ''].join('\n')
  return textSimilarity(join(source), join(rewrite))
}

export function isSufficientlyRewritten(similarity: number): boolean {
  return similarity <= REWRITE_MAX_SIMILARITY
}
