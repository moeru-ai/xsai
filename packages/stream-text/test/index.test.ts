import { describe, expect, it } from 'vitest'

import { streamText } from '../src'

describe('@xsai/stream-text', () => {
  it('basic', async () => {
    const { textStream } = await streamText({
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
    })

    const result: string[] = []

    for await (const textPart of textStream) {
      result.push(textPart)
    }

    expect(result.join('')).toStrictEqual('YES')
  })
})
