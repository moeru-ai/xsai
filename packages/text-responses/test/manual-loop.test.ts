import type { Event, Message } from '@xsai/text-primitives'

import { describe, expect, it } from 'vitest'

import { responses } from '../src'

const sseResponse = (events: unknown[]): Response => new Response([
  ...events.map(event => `data: ${JSON.stringify(event)}\n\n`),
  'data: [DONE]\n\n',
].join(''))

describe('manual tool loop', () => {
  it('replays the finish message and tool result in the next request', async () => {
    const requests: Record<string, unknown>[] = []
    const responsesByTurn = [
      sseResponse([
        {
          item: {
            arguments: '',
            call_id: 'call_1',
            id: 'fc_1',
            name: 'weather',
            status: 'in_progress',
            type: 'function_call',
          },
          output_index: 0,
          type: 'response.output_item.added',
        },
        {
          delta: '{"location":"Taipei"}',
          item_id: 'fc_1',
          output_index: 0,
          type: 'response.function_call_arguments.delta',
        },
        {
          item: {
            arguments: '{"location":"Taipei"}',
            call_id: 'call_1',
            id: 'fc_1',
            name: 'weather',
            status: 'completed',
            type: 'function_call',
          },
          output_index: 0,
          type: 'response.output_item.done',
        },
        {
          response: {
            error: null,
            incomplete_details: null,
            output: [{
              arguments: '{"location":"Taipei"}',
              call_id: 'call_1',
              id: 'fc_1',
              name: 'weather',
              status: 'completed',
              type: 'function_call',
            }],
            usage: null,
          },
          type: 'response.completed',
        },
      ]),
      sseResponse([
        {
          response: {
            error: null,
            incomplete_details: null,
            output: [{
              content: [{ annotations: [], text: '24°C', type: 'output_text' }],
              id: 'message_2',
              role: 'assistant',
              status: 'completed',
              type: 'message',
            }],
            usage: null,
          },
          type: 'response.completed',
        },
      ]),
    ]
    const model = responses({
      apiKey: 'test-key',
      baseURL: 'https://example.com/v1/',
      fetch: async (_input, init) => {
        requests.push(JSON.parse(init!.body as string) as Record<string, unknown>)
        return responsesByTurn[requests.length - 1]
      },
      model: 'test-model',
    })
    const input: Message[] = [{ content: 'What is the weather?', role: 'user' }]

    const firstStream = await model({ input })
    let finish: Extract<Event, { type: 'finish' }> | undefined
    for await (const event of firstStream) {
      if (event.type === 'finish')
        finish = event
    }

    input.push(finish!.message)
    input.push({
      content: [{ callId: 'call_1', output: '24°C', type: 'tool-result' }],
      role: 'user',
    })

    for await (const event of await model({ input })) {
      if (event.type === 'finish')
        expect(event.message.content).toEqual([{ text: '24°C', type: 'text' }])
    }

    expect(requests[1].input).toEqual([
      { content: 'What is the weather?', role: 'user', type: 'message' },
      {
        arguments: '{"location":"Taipei"}',
        call_id: 'call_1',
        id: 'fc_1',
        name: 'weather',
        type: 'function_call',
      },
      {
        call_id: 'call_1',
        output: '24°C',
        type: 'function_call_output',
      },
    ])
  })
})
