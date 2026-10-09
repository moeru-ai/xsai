import { describe, expect, it } from 'vitest'

import { decide, decisions } from '../src'

describe('decisions', () => {
  // Request and full response: https://developers.openai.com/api/reference/resources/decisions/methods/create
  it('maps the official damaged-item predicate example and token usage', async () => {
    const model = decisions({ baseURL: 'https://api.openai.com/v1', fetch: async (request) => {
      expect(request.url).toBe('https://api.openai.com/v1/decisions')
      expect(await request.json()).toEqual({
        input: 'The package arrived with a broken screen.',
        model: 'gpt-6-luna',
        questions: [{ instructions: 'Does the customer report a damaged item?', name: 'damaged', type: 'predicate' }],
      })
      return Response.json({
        answers: [{ name: 'damaged', probability: 0.95, type: 'predicate' }],
        model: 'gpt-6-luna',
        usage: { input_tokens: 42, input_tokens_details: { cache_write_tokens: 0, cached_tokens: 0 }, output_tokens: 0, output_tokens_details: { reasoning_tokens: 0 }, total_tokens: 42 },
      })
    }, model: 'gpt-6-luna' })
    const result = await decide(model, { input: 'The package arrived with a broken screen.', questions: {
      damaged: { instructions: 'Does the customer report a damaged item?', type: 'boolean' },
    } })
    expect(result).toEqual({ answers: { damaged: { probability: 0.95, type: 'boolean' } }, usage: { inputTokens: 42, outputTokens: 0, totalTokens: 42 } })
  })

  // Request and answer excerpts: https://developers.openai.com/api/docs/guides/decisions
  // The guide omits usage; these two tests supply token counts separately.
  it('maps the official department choice example including every probability and confidence', async () => {
    const model = decisions({ baseURL: 'https://api.openai.com/v1', fetch: async (request) => {
      expect(await request.json()).toEqual({
        input: 'I was charged twice for my order.',
        model: 'gpt-6-luna',
        questions: [{ choices: [
          { description: 'Payments, invoices, and refunds.', value: 'billing' },
          { description: 'Problems using the product.', value: 'technical' },
          { description: 'Delivery and tracking.', value: 'shipping' },
          { description: 'Requests outside these categories.', value: 'other' },
        ], instructions: 'Which department should handle this complaint?', name: 'department', type: 'choice' }],
      })
      return Response.json({ answers: [{
        choice: 'billing',
        confidence: 0.93,
        name: 'department',
        probabilities: [{ probability: 0.95, value: 'billing' }, { probability: 0.02, value: 'technical' }, { probability: 0.01, value: 'shipping' }, { probability: 0.02, value: 'other' }],
        type: 'choice',
      }], usage: { input_tokens: 42, output_tokens: 0, total_tokens: 42 } })
    }, model: 'gpt-6-luna' })
    const result = await decide(model, { input: 'I was charged twice for my order.', questions: {
      department: { choices: [
        { description: 'Payments, invoices, and refunds.', value: 'billing' },
        { description: 'Problems using the product.', value: 'technical' },
        { description: 'Delivery and tracking.', value: 'shipping' },
        { description: 'Requests outside these categories.', value: 'other' },
      ], instructions: 'Which department should handle this complaint?', type: 'choice' },
    } })
    expect(result.answers).toEqual({ department: {
      choice: 'billing',
      confidence: 0.93,
      probabilities: [{ probability: 0.95, value: 'billing' }, { probability: 0.02, value: 'technical' }, { probability: 0.01, value: 'shipping' }, { probability: 0.02, value: 'other' }],
      type: 'choice',
    } })
  })

  it('maps the official severity score example using level indexes rather than labels', async () => {
    const model = decisions({ baseURL: 'https://api.openai.com/v1', fetch: async (request) => {
      expect(await request.json()).toEqual({
        input: 'Export fails in Safari but works in Chrome.',
        model: 'gpt-6-luna',
        questions: [{ instructions: 'How severe is this issue?', levels: [
          { description: 'Appearance only; no lost functionality.', label: 'Cosmetic' },
          { description: 'A task fails, but another way works.', label: 'Workaround available' },
          { description: 'A task fails with no workaround.', label: 'Fully blocked' },
        ], name: 'severity', type: 'score' }],
      })
      return Response.json({ answers: [{ confidence: 0.55, name: 'severity', probabilities: [
        { label: 'Cosmetic', probability: 0.1, value: 0 },
        { label: 'Workaround available', probability: 0.7, value: 1 },
        { label: 'Fully blocked', probability: 0.2, value: 2 },
      ], score: 1.1, type: 'score' }], usage: { input_tokens: 42, output_tokens: 0, total_tokens: 42 } })
    }, model: 'gpt-6-luna' })
    const result = await decide(model, { input: 'Export fails in Safari but works in Chrome.', questions: {
      severity: { instructions: 'How severe is this issue?', levels: [
        { description: 'Appearance only; no lost functionality.', label: 'Cosmetic' },
        { description: 'A task fails, but another way works.', label: 'Workaround available' },
        { description: 'A task fails with no workaround.', label: 'Fully blocked' },
      ], type: 'score' },
    } })
    expect(result.answers).toEqual({ severity: { confidence: 0.55, probabilities: { 0: 0.1, 1: 0.7, 2: 0.2 }, score: 1.1, type: 'score' } })
  })

  // Image request and predicate answer excerpt from the same guide; usage supplied separately.
  it('sends the official image example unchanged through overrideInput', async () => {
    const overrideInput = [{ content: [{ text: 'Inspect the product in this photo.', type: 'input_text' }, { image_url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aZfoAAAAASUVORK5CYII=', type: 'input_image' }], role: 'user' }] as const
    const model = decisions({ baseURL: 'https://api.openai.com/v1', fetch: async (request) => {
      expect(await request.json()).toEqual({ input: overrideInput, model: 'gpt-6-luna', questions: [{
        instructions: 'Does the product have visible damage, such as a crack, tear, or dent? Ignore shadows and damage to the packaging.',
        name: 'visible_damage',
        type: 'predicate',
      }] })
      return Response.json({ answers: [{ name: 'visible_damage', probability: 0.92, type: 'predicate' }], usage: { input_tokens: 42, output_tokens: 0, total_tokens: 42 } })
    }, model: 'gpt-6-luna' })
    const result = await decide(model, { input: 'replaced text', providerOptions: { decisions: { overrideInput } }, questions: {
      visible_damage: { instructions: 'Does the product have visible damage, such as a crack, tear, or dent? Ignore shadows and damage to the packaging.', type: 'boolean' },
    } })
    expect(result.answers).toEqual({ visible_damage: { probability: 0.92, type: 'boolean' } })
  })

  // Compatibility regression; the official examples above return numeric token counts and confidence.
  it('omits unknown token counts and null confidence without inventing zero', async () => {
    const result = await decisions({ baseURL: 'https://example.test', fetch: async () => Response.json({
      answers: [{ choice: 'a', confidence: null, name: 'route', probabilities: [{ probability: 0.8, value: 'a' }, { probability: 0.2, value: 'b' }], type: 'choice' }],
      usage: { input_tokens: null, output_tokens: 5, total_tokens: null },
    }), model: 'decision' })({ input: 'hello', questions: { route: { choices: [{ value: 'a' }, { value: 'b' }], instructions: 'Route', type: 'choice' } } })
    expect(result.usage).toEqual({ inputTokens: undefined, outputTokens: 5, totalTokens: undefined })
    expect(result.answers.route).toMatchObject({ confidence: undefined })
  })

  it.each([
    [{ text: 'hello' }, undefined, '{"text":"hello"}'],
    ['fallback', '', ''],
  ])('serializes JSON content and treats an empty override as a complete replacement', async (input, overrideInput, expected) => {
    const model = decisions({ baseURL: 'https://example.test', fetch: async (request) => {
      expect(await request.json()).toEqual({ input: expected, model: 'decision', questions: [{ instructions: '{"task":"rate"}', levels: [{ label: 'low' }, { description: '{"urgent":true}', label: 'high' }], name: 'severity', type: 'score' }] })
      return Response.json({ answers: [{ confidence: 0, name: 'severity', probabilities: [{ label: 'high', probability: 0.5, value: 1 }, { label: 'low', probability: 0.5, value: 0 }], score: 0.5, type: 'score' }], usage: { input_tokens: 10, output_tokens: 5 } })
    }, model: 'decision' })
    const result = await model({ input, providerOptions: { decisions: { overrideInput } }, questions: { severity: { instructions: { task: 'rate' }, levels: [{ description: undefined, label: 'low' }, { description: { urgent: true }, label: 'high' }], type: 'score' } } })
    expect(result.answers).toEqual({ severity: { confidence: 0, probabilities: { 0: 0.5, 1: 0.5 }, score: 0.5, type: 'score' } })
    expect(result.usage.totalTokens).toBe(15)
  })

  // Refusal shape: https://developers.openai.com/api/reference/resources/decisions/methods/create
  it('fails the whole call with the refused question ID even when another question succeeds', async () => {
    const model = decisions({ baseURL: 'https://example.test', fetch: async () => Response.json({ answers: [{ name: 'first', probability: 0.95, type: 'predicate' }, { name: 'second', type: 'refusal' }], usage: { input_tokens: 10, output_tokens: 0 } }), model: 'decision' })
    await expect(decide(model, { input: '', questions: { first: { instructions: 'First?', type: 'boolean' }, second: { instructions: 'Second?', type: 'boolean' } } }))
      .rejects
      .toMatchObject({ code: 'decision-refusal', questionIds: ['second'] })
  })

  // Library regression for an unnamed refusal; not a complete upstream response example.
  it('maps an unnamed refusal to every requested question ID', async () => {
    const model = decisions({ baseURL: 'https://example.test', fetch: async () => Response.json({ answers: [{ name: null, type: 'refusal' }], usage: { input_tokens: 10, output_tokens: 0 } }), model: 'decision' })
    await expect(decide(model, { input: '', questions: { first: { instructions: 'First?', type: 'boolean' }, second: { instructions: 'Second?', type: 'boolean' } } }))
      .rejects
      .toMatchObject({ code: 'decision-refusal', questionIds: ['first', 'second'] })
  })
})
