import generateText from '@xsai/generate-text'
import { description, object, pipe, string } from 'valibot'
import { describe, expect, it } from 'vitest'

import { tool } from '../src'

describe('@xsai/tool', () => {
  it('basic', async () => {
    const t = await tool({
      description: 'Get the weather in a location',
      execute: ({ location }) => JSON.stringify({
        location,
        temperature: 72 + Math.floor(Math.random() * 21) - 10,
      }),
      name: 'weather',
      parameters: object({
        location: pipe(
          string(),
          description('The location to get the weather for'),
        ),
      }),
    })

    expect(t.function.parameters).toStrictEqual({
      properties: {
        location: {
          description: 'The location to get the weather for',
          type: 'string',
        },
      },
      required: ['location'],
      type: 'object',
    })
  })

  it('generateText', async () => {
    const t = await tool({
      description: 'Get the weather in a location',
      execute: ({ location }) => JSON.stringify({
        location,
        temperature: 72 + Math.floor(Math.random() * 21) - 10,
      }),
      name: 'weather',
      parameters: object({
        location: pipe(
          string(),
          description('The location to get the weather for'),
        ),
      }),
    })

    const { text } = await generateText({
      messages: [{
        content: 'You are a helpful assistant.',
        role: 'system',
      }, {
        content: 'What is the weather in San Francisco?',
        role: 'user',
      }],
      model: 'llama3.2',
      tools: [t],
    })

    expect(text).toMatchSnapshot()
  })
})
