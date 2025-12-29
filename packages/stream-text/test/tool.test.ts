import type { StreamTextEvent } from '../src/types/event'

import { clean } from '@xsai/shared'
import { tool } from '@xsai/tool'
import { description, object, pipe, string } from 'valibot'
import { describe, expect, it } from 'vitest'

import { streamText } from '../src'

describe('@xsai/stream-text tool', async () => {
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

    const { fullStream, steps } = streamText({
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

    const events: StreamTextEvent[] = []
    for await (const event of fullStream) {
      // eslint-disable-next-line @masknet/type-no-force-cast-via-top-type
      events.push(clean({
        ...event,
        toolCallId: undefined,
      }) as unknown as StreamTextEvent)
    }

    expect(events.find(e => e.type === 'tool-call-streaming-start')).toStrictEqual({
      toolName: 'add',
      type: 'tool-call-streaming-start',
    })

    expect(events.find(e => e.type === 'tool-call')).toStrictEqual({
      args: '{"a":"114514","b":"1919810"}',
      toolCallType: 'function',
      toolName: 'add',
      type: 'tool-call',
    })

    expect(events.find(e => e.type === 'tool-result')).toStrictEqual({
      args: {
        a: '114514',
        b: '1919810',
      },
      result: '2034324',
      toolName: 'add',
      type: 'tool-result',
    })

    const allSteps = await steps

    const cleanToolCallId = (obj: object) => clean({
      ...obj,
      toolCallId: undefined,
    })

    expect(allSteps.length).toBe(2)
    expect(allSteps[0].toolCalls.map(cleanToolCallId)).toStrictEqual([
      {
        args: '{"a":"114514","b":"1919810"}',
        toolCallType: 'function',
        toolName: 'add',
      },
    ])
    expect(allSteps[0].toolResults.map(cleanToolCallId)).toStrictEqual([
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
