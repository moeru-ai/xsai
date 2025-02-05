import { ollama } from '@xsai/providers'
import * as v from 'valibot'
import { describe, expect, it } from 'vitest'

import { generateObject } from '../src'

describe('@xsai/generate-object', () => {
  it('basic', async () => {
    const { object } = await generateObject({
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
      schema: v.object({
        answer: v.string(),
      }),
      seed: 39,
    })

    expect(object.answer).toBe('YES')
  }, 60000)
})
