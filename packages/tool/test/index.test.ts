import { generateText } from '@xsai/generate-text'
import { ollama } from '@xsai/providers'
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

  it('generateText with tool', async () => {
    const weather = await tool({
      description: 'Get the weather in a location',
      execute: ({ location }) => JSON.stringify({
        location,
        temperature: 42,
      }),
      name: 'weather',
      parameters: object({
        location: pipe(
          string(),
          description('The location to get the weather for'),
        ),
      }),
    })

    const { steps, text } = await generateText({
      ...ollama.chat('mistral-nemo'),
      maxSteps: 2,
      messages: [
        {
          content: 'You are a helpful assistant.',
          role: 'system',
        },
        {
          content: 'What is the weather in San Francisco? do not answer anything else.',
          role: 'user',
        },
      ],
      seed: 42,
      toolChoice: 'required',
      tools: [weather],
    })

    expect(text).toMatchSnapshot()

    const { toolCalls, toolResults } = steps[0]

    expect(toolCalls[0].toolName).toBe('weather')
    expect(toolCalls[0].args).toBe('{"location":"San Francisco"}')

    expect(toolCalls[0].toolName).toBe('weather')
    expect(toolResults[0].args).toStrictEqual({ location: 'San Francisco' })
    expect(toolResults[0].result).toBe('{"location":"San Francisco","temperature":42}')
  }, 20000)
})
