import { clean } from '@xsai/shared'
import { describe, expect, it } from 'vitest'

import type { StreamTextChunkResult } from '../src'

import { streamText } from '../src'

// make TS happy
// https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream#browser_compatibility
declare global {
  interface ReadableStream<R = any> {
    // eslint-disable-next-line ts/method-signature-style
    [Symbol.asyncIterator](): AsyncIterableIterator<R>
  }
}

describe('@xsai/stream-text', () => {
  it('basic', async () => {
    const { textStream } = await streamText({
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
      // streamOptions: { usage: true },
    })

    const result: string[] = []

    for await (const textPart of textStream) {
      result.push(textPart)
    }

    expect(result.join('')).toStrictEqual('YES')
  })

  it('the-quick-brown-fox', async () => {
    let onChunkCount = 0
    let chunkCount = 0

    const { chunkStream, textStream } = await streamText({
      baseURL: 'http://localhost:11434/v1/',
      messages: [
        {
          content: 'You are a helpful assistant.',
          role: 'system',
        },
        {
          content: 'This is a test, so please answer \'The quick brown fox jumps over the lazy dog.\' and nothing else.',
          role: 'user',
        },
      ],
      model: 'llama3.2',
      onChunk: () => { onChunkCount++ },
    })

    const chunk: StreamTextChunkResult[] = []
    const text: string[] = []

    for await (const chunkPart of chunkStream) {
      chunk.push(clean({
        ...chunkPart,
        created: undefined,
        id: undefined,
      }))
      chunkCount++
    }

    for await (const textPart of textStream) {
      text.push(textPart)
    }

    expect(text.join('')).toBe('The quick brown fox jumps over the lazy dog.')
    expect(text).toMatchSnapshot()
    expect(chunk).toMatchSnapshot()

    expect(onChunkCount).toMatchSnapshot(chunkCount)
  })

  it('long text', async () => {
    const { textStream } = await streamText({
      baseURL: 'http://localhost:11434/v1/',
      messages: [
        {
          content: 'You are a helpful assistant.',
          role: 'system',
        },
        {
          content: 'This is a test, please reply some dummy long text.',
          role: 'user',
        },
      ],
      model: 'llama3.2',
    })

    const result: string[] = []

    for await (const textPart of textStream) {
      result.push(textPart)
    }

    expect(result.length).greaterThan(1)
  }, 20000)

  it('stream without deconstruct', async () => {
    const stream = await streamText({
      baseURL: 'http://localhost:11434/v1/',
      maxSteps: 2,
      messages: [
        {
          content: 'You are a helpful assistant.',
          role: 'system',
        },
        {
          content: 'This is a test, so please repeat \'YES\' 10 times and nothing else.',
          role: 'user',
        },
      ],
      model: 'mistral-nemo',
      seed: 42,
    })

    const chunkResult = []
    for await (const chunk of stream.chunkStream) {
      chunkResult.push(chunk)
    }

    const textResult = []
    for await (const text of stream.textStream) {
      textResult.push(text)
    }

    expect(chunkResult.length).toBeGreaterThan (0)
    expect(textResult.join('').length).toBeGreaterThan(0)
  }, 20000)
})
