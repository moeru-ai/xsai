import type { DecisionModel } from '../src'

import { describe, expect, expectTypeOf, it } from 'vitest'

import { decide } from '../src'

describe('decide', () => {
  it('returns typed answers, native probabilities and usage from a custom model', async () => {
    const model: DecisionModel = () => ({
      answers: {
        refund: { probability: 0.9, type: 'boolean' },
        route: { choice: 'billing', confidence: 0.7, probabilities: [{ probability: 0.81, value: 'billing' }, { probability: 0.19, value: 'support' }], type: 'choice' },
        severity: { confidence: 0, probabilities: { 0: 0.5, 1: 0.5 }, score: 0.5, type: 'score' },
      },
      usage: { inputTokens: 20, outputTokens: 3, totalTokens: 23 },
    })

    const result = await decide(model, {
      input: { message: 'Please refund the duplicate charge.' },
      questions: {
        refund: { instructions: 'Does the customer want a refund?', type: 'boolean' },
        route: { choices: [{ value: 'billing' }, { value: 'support' }], instructions: 'Which team?', type: 'choice' },
        severity: { instructions: 'How severe?', levels: [{ label: 'low' }, { label: 'high' }], type: 'score' },
      },
    })

    expect(result.answers).toEqual({
      refund: { probability: 0.9, type: 'boolean' },
      route: { choice: 'billing', confidence: 0.7, probabilities: [{ probability: 0.81, value: 'billing' }, { probability: 0.19, value: 'support' }], type: 'choice' },
      severity: { confidence: 0, probabilities: { 0: 0.5, 1: 0.5 }, score: 0.5, type: 'score' },
    })
    expectTypeOf(result.answers.route.confidence).toEqualTypeOf<number | undefined>()
    expectTypeOf(result.answers.severity.confidence).toEqualTypeOf<number | undefined>()
    expect(result.usage).toEqual({ inputTokens: 20, outputTokens: 3, totalTokens: 23 })
    expectTypeOf(result.answers.route.choice).toEqualTypeOf<'billing' | 'support'>()
    expectTypeOf(result.answers.refund.probability).toEqualTypeOf<number>()
  })

  it('throws with the refused question IDs instead of returning partial success', async () => {
    await expect(decide(() => ({
      answers: { allowed: { probability: 0.8, type: 'boolean' }, refused: { type: 'refusal' } },
      usage: {},
    }), {
      input: 'document',
      questions: {
        allowed: { instructions: 'Is this allowed?', type: 'boolean' },
        refused: { instructions: 'Evaluate this request.', type: 'boolean' },
      },
    })).rejects.toMatchObject({ code: 'decision-refusal', questionIds: ['refused'] })
  })
})
