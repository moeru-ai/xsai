import type { StreamingEvent } from '../src/types/streaming-event'

import { describe, expect, it } from 'vitest'
import { z } from 'zod'

import { responses } from '../src'
import { tool } from '../src/utils/tool'

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

    const { eventStream } = responses({
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
  })
})
