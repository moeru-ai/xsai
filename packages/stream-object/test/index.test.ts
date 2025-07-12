import * as v from 'valibot'
import { describe, expect, it, vi } from 'vitest'

import { streamObject } from '../src'

// make TS happy
// https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream#browser_compatibility
declare global {
  interface ReadableStream<R = any> {
    // eslint-disable-next-line ts/method-signature-style
    [Symbol.asyncIterator](): AsyncIterableIterator<R>
  }
}

type ExtractReadableStream<T> = T extends ReadableStream<infer U> ? U : never

describe('@xsai/stream-object', () => {
  it('basic', async () => {
    const { partialObjectStream } = await streamObject({
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
      model: 'granite3.3:2b',
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
      model: 'granite3.3:2b',
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
      model: 'granite3.3:2b',
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
      model: 'granite3.3:2b',
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
      model: 'granite3.3:2b',
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
      model: 'granite3.3:2b',
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

    expect(onFinish).toBeCalled()
    expect(onFinish).toMatchSnapshot()
  })
})
