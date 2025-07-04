import { tool } from '@xsai/tool'
import { description, object, pipe, string } from 'valibot'
import { describe, expect, it } from 'vitest'

import type { GenerateTextResult } from '../src'

import { generateText } from '../src'

describe('@xsai/generate-text', () => {
  it('basic', async () => {
    let step: GenerateTextResult['steps'][number] | undefined

    const { finishReason, steps, text, toolCalls, toolResults } = await generateText({
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
      onStepFinish: result => (step = result),
    })

    expect(text).toStrictEqual('YES')
    expect(finishReason).toBe('stop')
    expect(toolCalls.length).toBe(0)
    expect(toolResults.length).toBe(0)
    expect(steps).toMatchSnapshot()

    expect(steps[0]).toStrictEqual(step)
  })

  it('with tool calling', async () => {
    const weather = await tool({
      description: 'Get the weather in a location',
      execute: ({ location }) => ({
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
      baseURL: 'http://localhost:11434/v1/',
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
      model: 'mistral-nemo',
      toolChoice: 'required',
      tools: [weather],
    })

    expect(text).toMatch(/42/) // only match it got 42 degrees

    const { toolCalls, toolResults } = steps[0]

    expect(toolCalls[0].toolName).toBe('weather')
    expect(toolCalls[0].args).toBe('{"location":"San Francisco"}')

    expect(toolCalls[0].toolName).toBe('weather')
    expect(toolResults[0].args).toStrictEqual({ location: 'San Francisco' })
    expect(toolResults[0].result).toBe('{"location":"San Francisco","temperature":42}')
  }, 20000)
})
