import { ollama } from '@xsai/providers'
import { describe, expect, it } from 'vitest'

import { generateText } from '../src'

describe('@xsai/generate-text', () => {
  it('basic', async () => {
    const { text } = await generateText({
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
    })

    expect(text).toStrictEqual('YES')
  })

  // TODO: error handling
})
