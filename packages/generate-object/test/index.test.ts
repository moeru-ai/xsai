import * as v from 'valibot'
import { describe, expect, it } from 'vitest'

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
      model: 'llama3.2',
      schema: v.object({
        answer: v.string(),
      }),
      seed: 39,
    })

    expect(object.answer).toBe('YES')
  }, 60000)

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
      model: 'llama3.2',
      schema: v.date(),
      seed: 39,
    })

    await expect(g).rejects.toThrowError()
  }, 60000)

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
      model: 'llama3.2',
      output: 'object',
      schema: v.object({
        answer: v.string(),
      }),
      seed: 39,
    })

    expect(object.answer).toBe('YES')
  }, 60000)

  it('array', async () => {
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
      model: 'llama3.2',
      output: 'array',
      schema: v.object({
        answer: v.string(),
      }),
      seed: 39,
    })

    expect(object).toHaveProperty('length')
    expect(object[0].answer).toBe('YES')
  }, 60000)
})
