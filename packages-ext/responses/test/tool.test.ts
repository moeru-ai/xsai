import type { StreamingEvent } from '../src/types/streaming-event'

import { describe, expect, it, vi } from 'vitest'
import { z } from 'zod'

import { responses } from '../src'
import { tool } from '../src/utils/tool'
import { createEventStreamResponse } from './utils'

describe('@xsai-ext/responses tool', async () => {
  it('basic tool calls', async () => {
    const add = tool({
      description: 'Adds two numbers',
      execute: ({ a, b }) => (Number.parseInt(a) + Number.parseInt(b)).toString(),
      inputSchema: z.object({
        a: z.string().describe('First number'),
        b: z.string().describe('Second number'),
      }),
      name: 'add',
    })

    const { eventStream, totalUsage, usage } = responses({
      baseURL: 'http://localhost:11434/v1/',
      input: [
        {
          content: 'You are a helpful assistant.',
          role: 'system',
          type: 'message',
        },
        {
          content: 'How many times does 114514 plus 1919810 equal? Please try to call the `add` tool to solve the problem.',
          role: 'user',
          type: 'message',
        },
      ],
      model: 'granite4:350m-h',
      tool_choice: 'required',
      tools: [add],
    })

    const events: StreamingEvent[] = []
    for await (const event of eventStream) {
      events.push(event)
    }

    expect(events).toMatchSnapshot()
    expect(await usage).toMatchSnapshot()
    expect(await totalUsage).toMatchSnapshot()
  })

  it('emits response.completed before starting the next tool step', async () => {
    const add = tool({
      description: 'Adds two numbers',
      execute: () => '3',
      inputSchema: z.object({
        a: z.string(),
        b: z.string(),
      }),
      name: 'add',
    })

    const fetch = vi.fn()
      .mockResolvedValueOnce(createEventStreamResponse([
        {
          response: {
            id: 'resp_step_1',
            object: 'response',
            output: [],
            status: 'in_progress',
          },
          sequence_number: 0,
          type: 'response.created',
        },
        {
          item: {
            arguments: '{"a":"1","b":"2"}',
            call_id: 'call_1',
            id: 'fc_1',
            name: 'add',
            status: 'completed',
            type: 'function_call',
          },
          output_index: 0,
          sequence_number: 1,
          type: 'response.output_item.done',
        },
        {
          response: {
            id: 'resp_step_1',
            object: 'response',
            output: [],
            status: 'completed',
            usage: {
              input_tokens: 7,
              output_tokens: 3,
              total_tokens: 10,
            },
          },
          sequence_number: 2,
          type: 'response.completed',
        },
      ]))
      .mockResolvedValueOnce(createEventStreamResponse([
        {
          response: {
            id: 'resp_step_2',
            object: 'response',
            output: [],
            status: 'in_progress',
          },
          sequence_number: 0,
          type: 'response.created',
        },
        {
          content_index: 0,
          delta: '3',
          item_id: 'msg_1',
          output_index: 0,
          sequence_number: 1,
          type: 'response.output_text.delta',
        },
        {
          response: {
            id: 'resp_step_2',
            object: 'response',
            output: [],
            status: 'completed',
            usage: {
              input_tokens: 11,
              output_tokens: 1,
              total_tokens: 12,
            },
          },
          sequence_number: 2,
          type: 'response.completed',
        },
      ])) as typeof globalThis.fetch

    const { eventStream, steps, totalUsage, usage } = responses({
      baseURL: 'http://localhost:11434/v1/',
      fetch,
      input: 'Please use the tool.',
      model: 'granite4:350m-h',
      tool_choice: 'required',
      tools: [add],
    })

    const events: StreamingEvent[] = []
    for await (const event of eventStream) {
      events.push(event)
    }

    expect(events.map(event => event.type)).toEqual([
      'response.created',
      'response.output_item.done',
      'response.completed',
      'response.created',
      'response.output_text.delta',
      'response.completed',
    ])
    expect(steps.map(step => step.response.id)).toEqual(['resp_step_1', 'resp_step_2'])
    await expect(usage).resolves.toMatchObject({ total_tokens: 12 })
    await expect(totalUsage).resolves.toMatchObject({ total_tokens: 22 })
    expect(fetch).toHaveBeenCalledTimes(2)
  })
})
