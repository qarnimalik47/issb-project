/**
 * Speech-to-text adapter abstraction (build prompt §7: must support Urdu,
 * English and code-switching). Phase 7 ships a `manual` adapter that performs no
 * automatic transcription and returns empty text — the user types/confirms their
 * transcript on the mandatory confirmation screen. This is honest (rule 1.1):
 * until a real STT engine is integrated and measured, we never fabricate a
 * transcript. Real adapters plug in here behind the same interface.
 */
export type SttResult = { text: string; confidence: number; engine: string; note?: string }

export interface SttAdapter {
  readonly name: string
  transcribe(audio: Buffer, opts: { lang: 'en' | 'ur' | 'mixed' }): Promise<SttResult>
}

class ManualSttAdapter implements SttAdapter {
  readonly name = 'manual'
  async transcribe(): Promise<SttResult> {
    return {
      text: '',
      confidence: 0,
      engine: 'manual',
      note: 'Automatic transcription is not configured. Please type what you said.',
    }
  }
}

const ADAPTERS: Record<string, SttAdapter> = { manual: new ManualSttAdapter() }

export function getSttAdapter(): SttAdapter {
  const name = process.env.STT_ADAPTER ?? 'manual'
  return ADAPTERS[name] ?? ADAPTERS.manual!
}
