import { describe, expect, it } from 'vitest'

import { generateText } from '../src'

describe('generateText', () => {
  it('basic', async () => {
    const { text } = await generateText({
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

    expect(text).toStrictEqual('YES')
  })
})
