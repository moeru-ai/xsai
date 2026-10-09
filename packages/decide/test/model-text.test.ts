import type { LanguageModel, LanguageModelOptions, TextEvent } from '@xsai/text'

import { describe, expect, it, vi } from 'vitest'

import { decide, toDecisionModel } from '../src'

const stream = (events: TextEvent[]): ReadableStream<TextEvent> => new ReadableStream({
  start: (controller) => {
    for (const event of events)
      controller.enqueue(event)
    controller.close()
  },
})

describe('toDecisionModel', () => {
  it('answers all questions with one structured-output call and preserves fractional scores and usage', async () => {
    const model = vi.fn<LanguageModel>((options: LanguageModelOptions) => {
      expect(typeof options.input === 'string' ? options.input : options.input[0]?.content).toBe('{"text":"hello"}')
      expect(options.instructions).toContain('P(true)')
      expect(options.instructions).toContain('Which team?')
      expect(options.outputFormat).toMatchObject({
        additionalProperties: false,
        properties: {
          route: { enum: ['billing', 'other'], type: 'string' },
          score: { maximum: 1, minimum: 0, type: 'number' },
          yes: { maximum: 1, minimum: 0, type: 'number' },
        },
        required: ['route', 'score', 'yes'],
        type: 'object',
      })
      expect(options.maxOutputTokens).toBe(100)
      expect(options.temperature).toBe(0)
      expect(options.tools).toBeUndefined()
      return stream([{ message: { content: '{"route":"billing","score":0.8,"yes":0.9}', role: 'assistant' }, status: 'completed', type: 'step.end', usage: { inputTokens: 10, outputTokens: 5, totalTokens: 15 } }])
    })
    const result = await decide(toDecisionModel(model, { maxOutputTokens: 100, temperature: 0 }), { input: { text: 'hello' }, questions: {
      route: { choices: [{ value: 'billing' }, { value: 'other' }], instructions: 'Which team?', type: 'choice' },
      score: { instructions: 'Rate', levels: [{ label: 'low' }, { label: 'high' }], type: 'score' },
      yes: { instructions: 'Yes?', type: 'boolean' },
    } })
    expect(model).toHaveBeenCalledTimes(1)
    expect(result).toEqual({ answers: {
      route: { choice: 'billing', type: 'choice' },
      score: { score: 0.8, type: 'score' },
      yes: { probability: 0.9, type: 'boolean' },
    }, usage: { inputTokens: 10, outputTokens: 5, totalTokens: 15 } })
  })

  it('returns empty usage when the LanguageModel has no token counts', async () => {
    const result = await toDecisionModel(() => stream([{ message: { content: '{"yes":0.75}', role: 'assistant' }, status: 'completed', type: 'step.end' }]))({
      input: '',
      questions: { yes: { instructions: 'Yes?', type: 'boolean' } },
    })
    expect(result.usage).toEqual({})
  })

  it('fails the whole call when the LanguageModel refuses', async () => {
    const model: LanguageModel = () => stream([{ message: { content: [{ refusal: 'Cannot answer', type: 'refusal' }], role: 'assistant' }, reason: 'refusal', status: 'completed', type: 'step.end' }])
    await expect(toDecisionModel(model)({ input: '', questions: { yes: { instructions: 'Yes?', type: 'boolean' } } }))
      .rejects
      .toMatchObject({ code: 'decision-refusal', questionIds: ['yes'] })
  })

  it.each(['incomplete', 'cancelled'] as const)('does not return a decision for a %s generation', async (status) => {
    const model: LanguageModel = () => stream([{ message: { content: '{"yes":0.75}', role: 'assistant' }, status, type: 'step.end' }])
    await expect(toDecisionModel(model)({ input: '', questions: { yes: { instructions: 'Yes?', type: 'boolean' } } }))
      .rejects
      .toMatchObject({ code: 'invalid-response' })
  })

  it('preserves a truncated-stream error from the text collector', async () => {
    await expect(toDecisionModel(() => stream([]))({ input: '', questions: { yes: { instructions: 'Yes?', type: 'boolean' } } }))
      .rejects
      .toMatchObject({ code: 'truncated-stream' })
  })
})
