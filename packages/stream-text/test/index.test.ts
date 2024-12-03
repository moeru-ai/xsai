import { ollama } from '@xsai/providers'
import { describe, expect, it } from 'vitest'

import { streamText } from '../src'

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

  it('pi', async () => {
    const { textStream } = await streamText({
      ...ollama.chat('mistral-nemo'),
      messages: [
        {
          content: 'You are a helpful assistant.',
          role: 'system',
        },
        {
          content: 'Please tell me the number of decimal places from zero to seventeen for PI and do not answer anything else.',
          role: 'user',
        },
      ],
    })

    const result: string[] = []

    for await (const textPart of textStream) {
      result.push(textPart)
    }

    expect(result.join('')).toMatchSnapshot()
    expect(result).toMatchSnapshot()
  })
})
