import { describe, expect, it } from 'vitest'

import * as v from 'valibot'

import { generateObject } from '../src'

describe('@xsai/generate-object', () => {
  it('basic', async () => {
    const { object } = await generateObject({
      baseURL: 'http://localhost:11434/v1/',
      messages: [
        {
          content: 'You are a helpful assistant.',
          role: 'system',
        },
        {
          content: 'This is a test, so please answer \'YES\' and nothing else.',
          role: 'user',
        },
      ],
      model: 'qwen3.5:0.8b',
      schema: v.object({
        answer: v.string(),
      }),
      seed: 39,
    })

    expect(object.answer).toBe('YES')
  })

  it('should throw if schema is not valid JSON', async () => {
    const g = generateObject({
      baseURL: 'http://localhost:11434/v1/',
      messages: [
        {
          content: 'You are a helpful assistant.',
          role: 'system',
        },
        {
          content: 'This is a test, so please answer \'YES\' and nothing else.',
          role: 'user',
        },
      ],
      model: 'qwen3.5:0.8b',
      schema: v.date(),
      seed: 39,
    })

    await expect(g).rejects.toThrow()
  })

  it('object', async () => {
    const { object } = await generateObject({
      baseURL: 'http://localhost:11434/v1/',
      messages: [
        {
          content: 'You are a helpful assistant.',
          role: 'system',
        },
        {
          content: 'This is a test, so please answer \'YES\' and nothing else.',
          role: 'user',
        },
      ],
      model: 'qwen3.5:0.8b',
      output: 'object',
      schema: v.object({
        answer: v.string(),
      }),
      seed: 39,
    })

    expect(object.answer).toBe('YES')
  })

  it('array', async () => {
    const { object } = await generateObject({
      baseURL: 'http://localhost:11434/v1/',
      messages: [
        {
          content: 'You are a helpful assistant.',
          role: 'system',
        },
        {
          content: 'give me 5 fruits',
          role: 'user',
        },
      ],
      model: 'qwen3.5:0.8b',
      output: 'array',
      schema: v.object({
        fruit: v.string(),
      }),
      seed: 39,
    })

    expect(object).toHaveLength(5)
  })
})
