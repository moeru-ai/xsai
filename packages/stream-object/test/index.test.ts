import * as v from 'valibot'
import { describe, expect, it } from 'vitest'

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
      model: 'llama3.2',
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
  }, 60000)
})
