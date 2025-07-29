import { clean } from '@xsai/shared'
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
      model: 'granite3.3:2b',
      onStepFinish: result => (step = result),
      seed: 114514,
    })

    expect(text).toStrictEqual('YES')
    expect(finishReason).toBe('stop')
    expect(toolCalls.length).toBe(0)
    expect(toolResults.length).toBe(0)
    expect(steps).toMatchSnapshot()

    expect(steps[0]).toStrictEqual(step)
  })

  it('basic tool calls', async () => {
    const add = await tool({
      description: 'Adds two numbers',
      execute: ({ a, b }) => (Number.parseInt(a) + Number.parseInt(b)).toString(),
      name: 'add',
      parameters: object({
        a: pipe(
          string(),
          description('First number'),
        ),
        b: pipe(
          string(),
          description('Second number'),
        ),
      }),
    })

    const { steps } = await generateText({
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
      model: 'qwen3:0.6b',
      seed: 1145141919810,
      toolChoice: 'required',
      tools: [add],
    })

    const cleanToolCallId = (obj: object) => clean({
      ...obj,
      toolCallId: undefined,
    })

    // eslint-disable-next-line no-console
    console.log(steps)
    expect(steps.length).toBe(2)
    expect(steps[0].toolCalls.map(cleanToolCallId)).toStrictEqual([
      {
        args: '{"a":"114514","b":"1919810"}',
        toolCallType: 'function',
        toolName: 'add',
      },
    ])
    expect(steps[0].toolResults.map(cleanToolCallId)).toStrictEqual([
      {
        args: {
          a: '114514',
          b: '1919810',
        },
        result: '2034324',
        toolName: 'add',
      },
    ])
  })
})
