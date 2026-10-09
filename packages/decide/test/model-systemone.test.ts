import { describe, expect, it, vi } from 'vitest'

import { decide, systemone } from '../src'

describe('systemone', () => {
  // https://docs.typesafe.ai/introduction/quickstart
  // Response copied unchanged; the example's string score criteria use IR level objects in the request.
  it('maps the official Quickstart response for all three question types', async () => {
    const model = systemone({ apiKey: 'secret', baseURL: 'https://api.typesafe.ai/v1', fetch: async (request) => {
      expect(request.url).toBe('https://api.typesafe.ai/v1/systemone')
      expect(request.headers.get('Authorization')).toBe('Bearer secret')
      expect(await request.json()).toEqual({
        model: 'jev-latest',
        questions: {
          department: { criteria: { billing: 'Payment or subscription issues', sales: 'Pricing or account questions', technical: 'Bugs or integration problems' }, instructions: 'Which team should handle this', type: 'choice' },
          frustration: { criteria: [{ label: 'Calm, just stating facts' }, { label: 'Frustrated but civil' }, { label: 'Very angry, strong language' }], instructions: 'How frustrated the customer appears', type: 'score' },
          is_urgent: { instructions: 'The message conveys urgency or time-sensitivity', type: 'noul' },
        },
        state: 'Hi, I\'ve been trying to connect my Stripe account for 3 days and the integration keeps failing. I\'m losing sales. Please help ASAP.',
      })
      return Response.json({
        answers: {
          department: { choice: 'technical', confidence: 0.78, probabilities: { billing: 0.15, sales: 0, technical: 0.85 }, type: 'choice' },
          frustration: { confidence: 1, legend: { 0: 'Calm, just stating facts', 1: 'Frustrated but civil', 2: 'Very angry, strong language' }, probabilities: { 0: 0, 1: 1, 2: 0 }, score: 1, type: 'score' },
          is_urgent: { noul: 1, type: 'noul' },
        },
        model: 'jev-1.13.0',
        usage: { input_tokens: 392, output_tokens: 65 },
      })
    }, model: 'jev-latest' })
    const result = await decide(model, {
      input: 'Hi, I\'ve been trying to connect my Stripe account for 3 days and the integration keeps failing. I\'m losing sales. Please help ASAP.',
      questions: {
        department: { choices: [{ description: 'Payment or subscription issues', value: 'billing' }, { description: 'Bugs or integration problems', value: 'technical' }, { description: 'Pricing or account questions', value: 'sales' }], instructions: 'Which team should handle this', type: 'choice' },
        frustration: { instructions: 'How frustrated the customer appears', levels: [{ label: 'Calm, just stating facts' }, { label: 'Frustrated but civil' }, { label: 'Very angry, strong language' }], type: 'score' },
        is_urgent: { instructions: 'The message conveys urgency or time-sensitivity', type: 'boolean' },
      },
    })
    expect(result).toEqual({
      answers: {
        department: { choice: 'technical', confidence: 0.78, probabilities: [{ probability: 0.15, value: 'billing' }, { probability: 0.85, value: 'technical' }, { probability: 0, value: 'sales' }], type: 'choice' },
        frustration: { confidence: 1, probabilities: { 0: 0, 1: 1, 2: 0 }, score: 1, type: 'score' },
        is_urgent: { probability: 1, type: 'boolean' },
      },
      usage: { inputTokens: 392, outputTokens: 65, totalTokens: 457 },
    })
  })

  // https://docs.typesafe.ai/primitives/score — unmodified response, score criteria adapted to IR level objects.
  it('preserves the official fractional score example and its probability distribution', async () => {
    const model = systemone({ baseURL: 'https://api.typesafe.ai/v1', fetch: async (request) => {
      expect(await request.json()).toEqual({
        model: 'jev-latest',
        questions: { bug_severity: { criteria: [
          { label: 'Cosmetic; no impact to functionality' },
          { label: 'Broken or degraded feature, but workaround exists' },
          { label: 'Blocking issue; no workaround exists' },
        ], instructions: 'How severe is the reported issue?', type: 'score' } },
        state: 'The export button crashes the settings page in Safari. It works in Chrome, but a few of our customers only use Safari.',
      })
      return Response.json({
        answers: { bug_severity: {
          confidence: 0.35,
          legend: { 0: 'Cosmetic; no impact to functionality', 1: 'Broken or degraded feature, but workaround exists', 2: 'Blocking issue; no workaround exists' },
          probabilities: { 0: 0, 1: 0.57, 2: 0.43 },
          score: 1.43,
          type: 'score',
        } },
        model: 'jev-1.13.0',
        usage: { input_tokens: 332, output_tokens: 18 },
      })
    }, model: 'jev-latest' })
    const result = await decide(model, { input: 'The export button crashes the settings page in Safari. It works in Chrome, but a few of our customers only use Safari.', questions: {
      bug_severity: { instructions: 'How severe is the reported issue?', levels: [
        { label: 'Cosmetic; no impact to functionality' },
        { label: 'Broken or degraded feature, but workaround exists' },
        { label: 'Blocking issue; no workaround exists' },
      ], type: 'score' },
    } })
    expect(result).toEqual({ answers: { bug_severity: { confidence: 0.35, probabilities: { 0: 0, 1: 0.57, 2: 0.43 }, score: 1.43, type: 'score' } }, usage: { inputTokens: 332, outputTokens: 18, totalTokens: 350 } })
  })

  // Receipt question: https://huggingface.co/Cloudflare/clef#images-and-video
  // HTTP image formats: https://raw.githubusercontent.com/cloudflare/cloudflare-docs/production/src/content/workers-ai-models/clef.json
  // A 1px PNG replaces the local receipt.jpg; the response is synthetic because the example has no response.
  const base64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aZfoAAAAASUVORK5CYII='

  it.each([
    { format: 'data URL', images: [`data:image/png;base64,${base64}`] },
    { format: 'mixed data URL and base64 object', images: [`data:image/png;base64,${base64}`, { base64, content_type: 'image/png' }] },
  ] as const)('sends the Clef receipt example with $format unchanged', async ({ images }) => {
    const model = systemone({ baseURL: 'https://example.test/v1', fetch: async (request) => {
      expect(request.url).toBe('https://example.test/v1/systemone')
      expect(await request.json()).toEqual({
        images,
        model: 'clef',
        questions: { legible: { instructions: 'Is the receipt total legible?', type: 'noul' } },
        state: { task: 'Review the attached receipt.' },
      })
      return Response.json({ answers: { legible: { noul: 0.98, type: 'noul' } }, model: 'clef', usage: { input_tokens: 120, output_tokens: 0 } })
    }, model: 'clef' })
    const result = await decide(model, {
      input: { task: 'Review the attached receipt.' },
      providerOptions: { systemone: { images } },
      questions: { legible: { instructions: 'Is the receipt total legible?', type: 'boolean' } },
    })
    expect(result).toEqual({ answers: { legible: { probability: 0.98, type: 'boolean' } }, usage: { inputTokens: 120, outputTokens: 0, totalTokens: 120 } })
  })

  // Synthetic regression case for JSON content and zero confidence.
  it('preserves JSON content and zero confidence', async () => {
    const fetch = vi.fn(async (request: Request) => {
      expect(request.url).toBe('https://example.test/v1/systemone')
      expect(request.headers.get('Authorization')).toBe('Bearer secret')
      expect(await request.json()).toEqual({
        model: 'system',
        questions: {
          route: { criteria: { billing: 'refund', other: null }, instructions: { task: 'route' }, type: 'choice' },
          score: { criteria: [{ label: 'low' }, { description: { urgent: true }, label: 'high' }], instructions: 'rate', type: 'score' },
          yes: { instructions: 'yes?', type: 'noul' },
        },
        state: { text: 'hello' },
      })
      return Response.json({
        answers: {
          route: { choice: 'billing', confidence: 0.7, probabilities: { billing: 0.8, other: 0.2 }, type: 'choice' },
          score: { confidence: 0, legend: { 0: { label: 'low' }, 1: { description: { urgent: true }, label: 'high' } }, probabilities: { 0: 0.5, 1: 0.5 }, score: 0.5, type: 'score' },
          yes: { noul: 0.9, type: 'noul' },
        },
        model: 'system',
        usage: { input_tokens: 10, output_tokens: 5 },
      })
    })
    const result = await decide(systemone({ apiKey: 'secret', baseURL: 'https://example.test/v1', fetch, model: 'system' }), {
      input: { text: 'hello' },
      questions: {
        route: { choices: [{ description: 'refund', value: 'billing' }, { value: 'other' }], instructions: { task: 'route' }, type: 'choice' },
        score: { instructions: 'rate', levels: [{ label: 'low' }, { description: { urgent: true }, label: 'high' }], type: 'score' },
        yes: { instructions: 'yes?', type: 'boolean' },
      },
    })
    expect(result).toEqual({ answers: {
      route: { choice: 'billing', confidence: 0.7, probabilities: [{ probability: 0.8, value: 'billing' }, { probability: 0.2, value: 'other' }], type: 'choice' },
      score: { confidence: 0, probabilities: { 0: 0.5, 1: 0.5 }, score: 0.5, type: 'score' },
      yes: { probability: 0.9, type: 'boolean' },
    }, usage: { inputTokens: 10, outputTokens: 5, totalTokens: 15 } })
    expect(fetch).toHaveBeenCalledTimes(1)
  })
})
