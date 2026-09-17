/**
 * Lecturette speech analysis (build prompt §7): structure, timing, filler words,
 * pace and clarity — computed from the confirmed transcript and recording
 * duration. Pure and unit-testable. Rubric-based content feedback comes from the
 * AI evaluation engine; this adds the objective speech metrics.
 */
const FILLERS = ['um', 'uh', 'err', 'like', 'you know', 'basically', 'actually', 'matlab', 'yaani']

export type LecturetteAnalysis = {
  wordCount: number
  durationSec: number
  wpm: number
  fillerCount: number
  fillerRatePer100: number
  structure: { intro: boolean; analysis: boolean; conclusion: boolean }
  timing: { withinTarget: boolean; targetSec: number }
  notes: string[]
}

export function analyzeLecturette(
  transcript: string,
  durationSec: number,
  targetSec = 120,
): LecturetteAnalysis {
  const words = transcript.trim().split(/\s+/).filter(Boolean)
  const wordCount = words.length
  const lower = ' ' + transcript.toLowerCase() + ' '
  let fillerCount = 0
  for (const f of FILLERS) {
    const re = new RegExp(`\\b${f.replace(/ /g, '\\s+')}\\b`, 'g')
    fillerCount += (lower.match(re) ?? []).length
  }
  const wpm = durationSec > 0 ? Math.round((wordCount / durationSec) * 60) : 0
  const fillerRatePer100 = wordCount > 0 ? Number(((fillerCount / wordCount) * 100).toFixed(1)) : 0

  const structure = {
    intro: /\b(today|topic|i will (talk|speak)|introduc)/i.test(transcript),
    analysis: /\b(because|however|on the other hand|firstly|secondly|reason|for example)/i.test(
      transcript,
    ),
    conclusion: /\b(in conclusion|to conclude|to sum up|finally|therefore|overall)/i.test(
      transcript,
    ),
  }

  const notes: string[] = []
  if (wpm > 0 && wpm < 100) notes.push('Pace is slow — aim for ~120–150 words per minute.')
  if (wpm > 180) notes.push('Pace is fast — slow down for clarity.')
  if (fillerRatePer100 > 3) notes.push('Reduce filler words; they weaken delivery.')
  if (!structure.intro) notes.push('Add a clear introduction.')
  if (!structure.conclusion) notes.push('Add a clear conclusion.')

  return {
    wordCount,
    durationSec,
    wpm,
    fillerCount,
    fillerRatePer100,
    structure,
    timing: { withinTarget: Math.abs(durationSec - targetSec) <= 30, targetSec },
    notes,
  }
}
