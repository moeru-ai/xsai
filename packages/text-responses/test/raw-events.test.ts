import type { TextEvent } from '@xsai/text-primitives'

import { describe, expect, it } from 'vitest'

import { responses } from '../src'

describe('responses raw events', () => {
  it('exposes every provider event before normalization when requested', async () => {
    const wireEvents = [
      { type: 'response.created' },
      {
        item: { id: 'ws_1', status: 'in_progress', type: 'web_search_call' },
        output_index: 0,
        type: 'response.output_item.added',
      },
      { item_id: 'ws_1', output_index: 0, type: 'response.web_search_call.searching' },
      { content_index: 0, delta: 'Hello', output_index: 1, type: 'response.output_text.delta' },
      {
        response: {
          id: 'resp_1',
          output: [{
            content: [{ annotations: [], text: 'Hello', type: 'output_text' }],
            id: 'message_1',
            role: 'assistant',
            status: 'completed',
            type: 'message',
          }],
          status: 'completed',
        },
        type: 'response.completed',
      },
    ]
    const model = responses({
      baseURL: 'https://example.com/v1/',
      fetch: async () => new Response([
        ...wireEvents.map(event => `data: ${JSON.stringify(event)}\n\n`),
        'data: [DONE]\n\n',
      ].join('')),
      model: 'test-model',
    })
    const read = async (includeRawEvents?: boolean): Promise<TextEvent[]> => {
      const events: TextEvent[] = []
      for await (const event of await model({ includeRawEvents, input: 'hi' }))
        events.push(event)
      return events
    }

    const normal = await read()
    const observed = await read(true)

    expect(normal.some(event => event.type === 'raw')).toBe(false)
    expect(observed.filter(event => event.type === 'raw')).toEqual(
      wireEvents.map(detail => ({ detail, type: 'raw' })),
    )
    expect(observed.filter(event => event.type !== 'raw')).toEqual(normal)
    expect(observed.map(event => event.type)).toEqual([
      'step.start',
      'raw',
      'raw',
      'raw',
      'raw',
      'content.start',
      'text.delta',
      'raw',
      'content.end',
      'step.end',
    ])
  })
})
