import { tool } from '@xsai/tool'
import { description, number, object, pipe } from 'valibot'
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
      model: 'granite3.3:2b',
      onStepFinish: result => (step = result),
    })

    expect(text).toStrictEqual('YES')
    expect(finishReason).toBe('stop')
    expect(toolCalls.length).toBe(0)
    expect(toolResults.length).toBe(0)
    expect(steps).toMatchSnapshot()

    expect(steps[0]).toStrictEqual(step)
  }, 30000)

  it('with tool calling', async () => {
    const add = await tool({
      description: 'Adds two numbers',
      execute: ({ a, b }) => (a + b).toString(),
      name: 'add',
      parameters: object({
        a: pipe(
          number(),
          description('First number'),
        ),
        b: pipe(
          number(),
          description('Second number'),
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
          content: 'How many times does 114514 plus 1919810 equal? Please try to call the `add` tool to solve the problem.',
          role: 'user',
        },
      ],
      model: 'granite3.3:2b',
      seed: 114514,
      toolChoice: 'required',
      tools: [add],
    })

    expect(text).toMatchSnapshot()
    expect(steps).toMatchSnapshot()
  }, 30000)
})
