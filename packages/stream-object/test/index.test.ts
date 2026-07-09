import type { StreamTextChunkResult } from '@xsai/stream-text'

import { describe, expect, it } from 'vitest'

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
      model: 'qwen3.5:2b',
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

  it('string array', async () => {
    const { elementStream } = await streamObject({
      baseURL: 'http://localhost:11434/v1/',
      messages: [
        {
          content: 'You are a helpful assistant.',
          role: 'system',
        },
        {
          content: 'give me 5 fruits name',
          role: 'user',
        },
      ],
      model: 'qwen3.5:2b',
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
})
