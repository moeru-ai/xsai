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
      model: 'granite4:1b-h',
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
      model: 'granite4:1b-h',
      schema: v.date(),
      seed: 39,
    })

    await expect(g).rejects.toThrow()
  })

  it('should throw if the response has no text', async () => {
    const fetch: typeof globalThis.fetch = async () => new Response(JSON.stringify({
      choices: [{
        finish_reason: 'tool_calls',
        index: 0,
        message: {
          content: '',
          role: 'assistant',
          tool_calls: [{
            function: {
              arguments: '{}',
              name: 'lookup',
            },
            id: 'call_1',
            type: 'function',
          }],
        },
      }],
      created: 1,
      id: 'chatcmpl_1',
      model: 'test-model',
      object: 'chat.completion',
      system_fingerprint: 'fingerprint',
      usage: {
        completion_tokens: 1,
        prompt_tokens: 1,
        total_tokens: 2,
      },
    }))

    await expect(generateObject({
      baseURL: 'https://example.com/v1/',
      fetch,
      messages: [{ content: 'lookup', role: 'user' }],
      model: 'test-model',
      schema: v.object({ answer: v.string() }),
    })).rejects.toMatchObject({
      code: 'invalid_response',
      reason: 'empty_body',
    })
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
      model: 'granite4:1b-h',
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
      model: 'granite4:1b-h',
      output: 'array',
      schema: v.object({
        fruit: v.string(),
      }),
      seed: 39,
    })

    expect(object).toHaveLength(5)
  })
})
