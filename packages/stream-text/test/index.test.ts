import { ollama } from '@xsai/providers'
import { clean } from '@xsai/shared'
import { describe, expect, it } from 'vitest'

import { streamText, type StreamTextResponse } from '../src'

describe('@xsai/stream-text', () => {
  it('basic', async () => {
    const { textStream } = await streamText({
      ...ollama.chat('llama3.2'),
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
      // streamOptions: { usage: true },
    })

    const result: string[] = []

    for await (const textPart of textStream) {
      result.push(textPart)
    }

    expect(result.join('')).toStrictEqual('YES')
  })

  it('the-quick-brown-fox', async () => {
    const { chunkStream, textStream } = await streamText({
      ...ollama.chat('llama3.2'),
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
    })

    const chunk: StreamTextResponse[] = []
    const text: string[] = []

    for await (const chunkPart of chunkStream) {
      chunk.push(clean({
        ...chunkPart,
        created: undefined,
        id: undefined,
      }))
    }

    for await (const textPart of textStream) {
      text.push(textPart)
    }

    expect(text.join('')).toBe('The quick brown fox jumps over the lazy dog.')
    expect(text).toMatchSnapshot()

    expect(chunk).toMatchSnapshot()
  })
})
