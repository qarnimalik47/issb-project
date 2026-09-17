/**
 * OCR adapter abstraction (build prompt: "pluggable adapter; must handle English
 * and Urdu handwriting; accuracy measured before use").
 *
 * Phase 4 ships a `manual` adapter that performs no automatic recognition and
 * returns empty text with zero confidence. This is deliberate and honest (rule
 * 1.1: never return fake data): until a real OCR engine is integrated and its
 * accuracy measured, the user always types/corrects their answer on the
 * mandatory confirmation screen. Real adapters (cloud/self-hosted) plug in here
 * behind the same interface and are selected by configuration.
 */
export type OcrResult = {
  text: string
  confidence: number // 0..1
  engine: string
  note?: string
}

export interface OcrAdapter {
  readonly name: string
  recognize(image: Buffer, opts: { lang: 'en' | 'ur' | 'mixed' }): Promise<OcrResult>
}

class ManualOcrAdapter implements OcrAdapter {
  readonly name = 'manual'
  async recognize(): Promise<OcrResult> {
    return {
      text: '',
      confidence: 0,
      engine: 'manual',
      note: 'Automatic OCR is not configured. Please type your answer from the image.',
    }
  }
}

const ADAPTERS: Record<string, OcrAdapter> = {
  manual: new ManualOcrAdapter(),
}

/** Resolve the configured OCR adapter (defaults to manual). */
export function getOcrAdapter(): OcrAdapter {
  const name = process.env.OCR_ADAPTER ?? 'manual'
  return ADAPTERS[name] ?? ADAPTERS.manual!
}
