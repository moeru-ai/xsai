import { ollama } from '@xsai/providers'
import * as v from 'valibot'
import { describe, expect, it } from 'vitest'

import { streamObject } from '../src'

describe('@xsai/generate-object', () => {
  it('basic', async () => {
    const { partialObjectStream } = await streamObject({
      ...ollama.chat('llama3.2'),
      messages: [
        {
          content: 'You are a helpful assistant.',
          role: 'system',
        },
        {
          content: 'Generate a sous-vide steak recipe.',
          role: 'user',
        },
      ],
      schema: v.object({
        recipe: v.object({
          ingredients: v.array(v.object({ amount: v.string(), name: v.string() })),
          name: v.string(),
          steps: v.array(v.string()),
        }),
      }),
      seed: 39,
    })

    for await (const partialObject of partialObjectStream) {
      expect(partialObject).toMatchSnapshot()
    }
  }, 60000)
})
