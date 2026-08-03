import type { StreamTextChunkResult } from '@xsai/stream-text'

import { describe, expect, it, vi } from 'vitest'

import * as v from 'valibot'

import { streamObject } from '../src'

type ExtractReadableStream<T> = T extends ReadableStream<infer U> ? U : never

describe('@xsai/stream-object', () => {
  it('basic', async () => {
    const { eventStream, fullStream, partialObjectStream } = await streamObject({
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

    const objects: ExtractReadableStream<typeof partialObjectStream>[] = []

    for await (const partialObject of partialObjectStream) {
      objects.push(partialObject)
      expect(partialObject).toMatchSnapshot()
    }

    expect(objects.at(-1)!.answer).toBe('YES')

    const events: ExtractReadableStream<typeof eventStream>[] = []
    for await (const event of eventStream) {
      events.push(event)
    }
    expect(events.length).toBeGreaterThan(0)

    const chunks: StreamTextChunkResult[] = []
    for await (const chunk of fullStream) {
      chunks.push(chunk)
    }
    expect(chunks.length).toBeGreaterThan(0)
    expect(chunks.every(chunk => chunk.object === 'chat.completion.chunk')).toBe(true)
  })

  it('should throw if the response has no text', async () => {
    const body = 'data: {"choices":[{"delta":{"role":"assistant","tool_calls":[{"index":0,"id":"call_1","type":"function","function":{"name":"lookup","arguments":"{}"}}]},"index":0}],"created":1,"id":"chunk_1","model":"test-model","object":"chat.completion.chunk"}\n\n'
      + 'data: {"choices":[{"delta":{"role":"assistant"},"finish_reason":"tool_calls","index":0}],"created":1,"id":"chunk_2","model":"test-model","object":"chat.completion.chunk","system_fingerprint":"fingerprint","usage":{"completion_tokens":1,"prompt_tokens":1,"total_tokens":2}}\n\n'
    const fetch: typeof globalThis.fetch = async () => new Response(body, {
      headers: {
        'content-type': 'text/event-stream',
      },
    })
    const { textStream } = await streamObject({
      baseURL: 'https://example.com/v1/',
      fetch,
      messages: [{ content: 'lookup', role: 'user' }],
      model: 'test-model',
      schema: v.object({ answer: v.string() }),
    })

    await expect((async () => {
      for await (const chunk of textStream) {
        expect(chunk).toBeTypeOf('string')
      }
    })()).rejects.toMatchObject({
      code: 'invalid_response',
      reason: 'empty_body',
    })
  })

  it('string array', async () => {
    const { elementStream } = await streamObject({
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
      schema: v.string(),
      seed: 39,
    })

    const objects: string[] = []
    for await (const element of elementStream) {
      objects.push(element)
    }

    expect(objects).toHaveLength(5)
    for (const object of objects) {
      expect(object).toBeTypeOf('string')
    }
  })

  it('boolean array', async () => {
    const { elementStream } = await streamObject({
      baseURL: 'http://localhost:11434/v1/',
      messages: [
        {
          content: 'You are a helpful assistant.',
          role: 'system',
        },
        {
          content: 'give me 5 booleans',
          role: 'user',
        },
      ],
      model: 'granite4:1b-h',
      output: 'array',
      schema: v.boolean(),
      seed: 39,
    })

    const objects: boolean[] = []
    for await (const element of elementStream) {
      objects.push(element)
    }

    expect(objects).toHaveLength(5)
    for (const object of objects) {
      expect(object).toBeTypeOf('boolean')
    }
  })

  it('number array', async () => {
    const { elementStream } = await streamObject({
      baseURL: 'http://localhost:11434/v1/',
      messages: [
        {
          content: 'You are a helpful assistant.',
          role: 'system',
        },
        {
          content: 'give me 5 numbers',
          role: 'user',
        },
      ],
      model: 'granite4:1b-h',
      output: 'array',
      schema: v.number(),
      seed: 39,
    })

    const objects: number[] = []
    for await (const element of elementStream) {
      objects.push(element)
    }

    expect(objects).toHaveLength(5)
    for (const object of objects) {
      expect(object).toBeTypeOf('number')
    }
  })

  it('object array', async () => {
    const schema = v.object({
      fruit: v.string(),
    })
    const { elementStream } = await streamObject({
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
      schema,
      seed: 39,
    })

    const objects: { fruit: string }[] = []
    for await (const element of elementStream) {
      objects.push(element)
      expect(() => v.parse(schema, element)).not.throw()
    }

    expect(objects).toHaveLength(5)
  })

  it('object array with onFinish', async () => {
    const schema = v.object({
      fruit: v.string(),
    })
    const onFinish = vi.fn()
    const { elementStream } = await streamObject({
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
      onFinish,
      output: 'array',
      schema,
      seed: 39,
    })

    const objects: { fruit: string }[] = []
    for await (const element of elementStream) {
      expect(() => v.parse(schema, element)).not.throw()
      objects.push(element)
    }

    expect(objects).toHaveLength(5)

    expect(onFinish).toHaveBeenCalled()
  })
})
