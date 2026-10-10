import { env } from 'node:process'

import { describe, expect, it } from 'vitest'

import { chat } from '../../text-chat/src'
import { decide, systemone, toDecisionModel } from '../src'

const baseURL = env.XSAI_E2E_BASE_URL!

const questions = {
  anger: {
    instructions: 'How angry is the customer?',
    levels: [{ label: 'Calm' }, { description: 'Annoyed but polite', label: 'Annoyed' }, { label: 'Furious' }],
    type: 'score',
  },
  damaged: { instructions: 'Does the customer report a damaged item?', type: 'boolean' },
  route: {
    choices: [{ description: 'Payments, invoices, and charges', value: 'billing' }, { description: 'Delivery and items damaged in transit', value: 'shipping' }],
    instructions: 'Which team should handle this message?',
    type: 'choice',
  },
} as const

describe('decide e2e', () => {
  it('answers every question type through the local Ollama SystemOne API', async () => {
    const model = systemone({ baseURL, model: env.XSAI_E2E_MODEL_DECISION! })
    const result = await decide(model, {
      input: 'The package arrived with a shattered screen. This is the third time! I am absolutely furious.',
      questions,
    })

    expect(result.answers.damaged.probability).toBeGreaterThan(0.5)
    expect(result.answers.route.choice).toBe('shipping')
    expect(result.answers.route.probabilities?.map(entry => entry.value)).toEqual(['billing', 'shipping'])
    expect(result.answers.route.probabilities?.reduce((sum, entry) => sum + entry.probability, 0)).toBeCloseTo(1)
    expect(result.answers.route.confidence).toBeGreaterThanOrEqual(0)
    expect(result.answers.anger.score).toBeGreaterThan(1)
    expect(result.answers.anger.score).toBeLessThanOrEqual(2)
    expect(Object.keys(result.answers.anger.probabilities ?? {})).toEqual(['0', '1', '2'])
    expect(result.usage.inputTokens).toBeGreaterThan(0)
    expect(result.usage.totalTokens).toBeGreaterThanOrEqual(result.usage.inputTokens!)
  })

  it('sends JSON input and instructions through the local Ollama SystemOne API', async () => {
    const model = systemone({ baseURL, model: env.XSAI_E2E_MODEL_DECISION! })
    const result = await decide(model, {
      input: { message: 'Hello, thanks for the quick delivery. Everything works great!' },
      questions: { damaged: { instructions: { task: 'Does the customer report a damaged item?' }, type: 'boolean' } },
    })

    expect(result.answers.damaged.probability).toBeLessThan(0.5)
  })

  it('answers every question type through a local Ollama Chat Completions model', async () => {
    const model = toDecisionModel(chat({ baseURL, model: env.XSAI_E2E_MODEL! }), { reasoningEffort: 'none', temperature: 0 })
    const result = await decide(model, {
      input: 'The package arrived with a shattered screen. This is the third time! I am absolutely furious.',
      questions,
    })

    expect(result.answers.damaged.probability).toBeGreaterThanOrEqual(0)
    expect(result.answers.damaged.probability).toBeLessThanOrEqual(1)
    expect(['billing', 'shipping']).toContain(result.answers.route.choice)
    expect(result.answers.anger.score).toBeGreaterThanOrEqual(0)
    expect(result.answers.anger.score).toBeLessThanOrEqual(2)
  })
})
