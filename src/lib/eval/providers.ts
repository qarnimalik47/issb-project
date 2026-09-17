/**
 * AI provider adapters for the evaluation engine.
 *
 * A provider takes a fully-built, injection-hardened request and returns parsed
 * JSON plus audit metadata (model, versions, tokens). Providers are swappable
 * by configuration (rule: provider-agnostic, dual-model cross-check).
 *
 *  - `mock`     : deterministic, rubric-conformant output for local dev/tests.
 *                 It is NOT real AI and is always recorded as model="mock" so
 *                 results are never passed off as genuine evaluation (rule 1.1).
 *  - `anthropic`/`openai`/`google` : real adapters (fetch-based). Used only when
 *                 the matching API key is configured; otherwise the service
 *                 falls back to `mock` and records that fact.
 */
import { env } from '../env/index'

export type EvalRequest = {
  systemPrompt: string
  userMessage: string
  /** The raw user answer, already delimited inside userMessage; passed
   *  separately so the mock can synthesise evidence deterministically. */
  userText: string
  rubricCriteria: { key: string; label: string }[]
  maxScorePerCriterion: number
}

export type EvalRawResponse = {
  rawText: string
  json: unknown
  model: string
  modelVersion: string
  tokensInput: number
  tokensOutput: number
}

export interface EvalProvider {
  readonly name: string
  readonly modelId: string
  evaluate(req: EvalRequest): Promise<EvalRawResponse>
}

const DEFAULT_TIMEOUT_MS = 30_000

async function fetchWithTimeout(url: string, init: RequestInit, timeoutMs = DEFAULT_TIMEOUT_MS) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    return await fetch(url, { ...init, signal: controller.signal })
  } finally {
    clearTimeout(timer)
  }
}

/** Extract the first top-level JSON object from a text blob. */
export function extractJson(text: string): unknown {
  const start = text.indexOf('{')
  const end = text.lastIndexOf('}')
  if (start === -1 || end === -1 || end < start) throw new Error('No JSON object in model output')
  return JSON.parse(text.slice(start, end + 1))
}

// --- Mock provider ----------------------------------------------------------

class MockProvider implements EvalProvider {
  readonly name = 'mock'
  readonly modelId = 'mock-1'

  async evaluate(req: EvalRequest): Promise<EvalRawResponse> {
    const text = req.userText.trim()
    const words = text.split(/\s+/).filter(Boolean)
    const len = words.length
    // Deterministic pseudo-score from text length + simple positive-signal count.
    const positive = (
      text.match(/\b(lead|help|team|responsib|plan|calm|decisi|honest|solve)\w*/gi) ?? []
    ).length
    const base = Math.max(
      1,
      Math.min(req.maxScorePerCriterion, Math.round(1 + len / 12 + positive)),
    )

    const criteria: Record<string, { score: number; evidence: string }> = {}
    req.rubricCriteria.forEach((c, i) => {
      const score = Math.max(1, Math.min(req.maxScorePerCriterion, base + ((i % 3) - 1)))
      criteria[c.key] = {
        score,
        evidence: words.slice(0, 12).join(' ') || '(no answer provided)',
      }
    })

    const json = {
      criteria,
      strengths: positive > 0 ? ['Shows action-oriented, positive framing in own words.'] : [],
      weaknesses: len < 8 ? ['Response is very brief; expand with concrete detail.'] : [],
      improvement: ['Give a specific example that demonstrates the quality, in your own words.'],
      distress: false,
    }
    return {
      rawText: JSON.stringify(json),
      json,
      model: 'mock',
      modelVersion: this.modelId,
      tokensInput: Math.round((req.systemPrompt.length + req.userMessage.length) / 4),
      tokensOutput: Math.round(JSON.stringify(json).length / 4),
    }
  }
}

// --- Anthropic --------------------------------------------------------------

class AnthropicProvider implements EvalProvider {
  readonly name = 'anthropic'
  readonly modelId: string
  constructor(private apiKey: string) {
    this.modelId = process.env.EVAL_ANTHROPIC_MODEL ?? 'claude-sonnet-5'
  }
  async evaluate(req: EvalRequest): Promise<EvalRawResponse> {
    const res = await fetchWithTimeout('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: this.modelId,
        max_tokens: 1500,
        system: req.systemPrompt,
        messages: [{ role: 'user', content: req.userMessage }],
      }),
    })
    if (!res.ok) throw new Error(`Anthropic API error ${res.status}`)
    const data = (await res.json()) as {
      content: { text: string }[]
      usage: { input_tokens: number; output_tokens: number }
    }
    const rawText = data.content.map((c) => c.text).join('')
    return {
      rawText,
      json: extractJson(rawText),
      model: 'anthropic',
      modelVersion: this.modelId,
      tokensInput: data.usage.input_tokens,
      tokensOutput: data.usage.output_tokens,
    }
  }
}

// --- OpenAI -----------------------------------------------------------------

class OpenAiProvider implements EvalProvider {
  readonly name = 'openai'
  readonly modelId: string
  constructor(private apiKey: string) {
    this.modelId = process.env.EVAL_OPENAI_MODEL ?? 'gpt-4.1'
  }
  async evaluate(req: EvalRequest): Promise<EvalRawResponse> {
    const res = await fetchWithTimeout('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { authorization: `Bearer ${this.apiKey}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        model: this.modelId,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: req.systemPrompt },
          { role: 'user', content: req.userMessage },
        ],
      }),
    })
    if (!res.ok) throw new Error(`OpenAI API error ${res.status}`)
    const data = (await res.json()) as {
      choices: { message: { content: string } }[]
      usage: { prompt_tokens: number; completion_tokens: number }
    }
    const rawText = data.choices[0]?.message.content ?? ''
    return {
      rawText,
      json: extractJson(rawText),
      model: 'openai',
      modelVersion: this.modelId,
      tokensInput: data.usage.prompt_tokens,
      tokensOutput: data.usage.completion_tokens,
    }
  }
}

// --- Google Gemini ----------------------------------------------------------

class GoogleProvider implements EvalProvider {
  readonly name = 'google'
  readonly modelId: string
  constructor(private apiKey: string) {
    this.modelId = process.env.EVAL_GOOGLE_MODEL ?? 'gemini-2.5-pro'
  }
  async evaluate(req: EvalRequest): Promise<EvalRawResponse> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.modelId}:generateContent?key=${this.apiKey}`
    const res = await fetchWithTimeout(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: req.systemPrompt }] },
        contents: [{ role: 'user', parts: [{ text: req.userMessage }] }],
        generationConfig: { responseMimeType: 'application/json' },
      }),
    })
    if (!res.ok) throw new Error(`Google API error ${res.status}`)
    const data = (await res.json()) as {
      candidates: { content: { parts: { text: string }[] } }[]
      usageMetadata?: { promptTokenCount: number; candidatesTokenCount: number }
    }
    const rawText = data.candidates[0]?.content.parts.map((p) => p.text).join('') ?? ''
    return {
      rawText,
      json: extractJson(rawText),
      model: 'google',
      modelVersion: this.modelId,
      tokensInput: data.usageMetadata?.promptTokenCount ?? 0,
      tokensOutput: data.usageMetadata?.candidatesTokenCount ?? 0,
    }
  }
}

export const mockProvider = new MockProvider()

/** All providers that are actually usable (have a key), most-preferred first. */
export function availableProviders(): EvalProvider[] {
  const list: EvalProvider[] = []
  if (env.ANTHROPIC_API_KEY) list.push(new AnthropicProvider(env.ANTHROPIC_API_KEY))
  if (env.OPENAI_API_KEY) list.push(new OpenAiProvider(env.OPENAI_API_KEY))
  if (env.GOOGLE_API_KEY) list.push(new GoogleProvider(env.GOOGLE_API_KEY))
  return list
}

/**
 * Choose providers for a (possibly dual) evaluation. Returns real providers when
 * keys exist, otherwise the mock. `usedMock` signals the result is a demo.
 */
export function selectProviders(dual: boolean): { providers: EvalProvider[]; usedMock: boolean } {
  const real = availableProviders()
  if (real.length === 0) return { providers: [mockProvider], usedMock: true }
  if (dual && real.length >= 2) return { providers: real.slice(0, 2), usedMock: false }
  return { providers: [real[0]!], usedMock: false }
}
