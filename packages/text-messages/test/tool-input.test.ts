import type { TextEvent } from '@xsai/text'

import { describe, expect, it } from 'vitest'

import { messages } from '../src'

describe('messages tool input', () => {
  it.each([
    { arguments: '{"city":"Taipei"}', deltas: [], expectedDeltas: ['{"city":"Taipei"}'], input: { city: 'Taipei' }, name: 'preserves tool arguments supplied in the start event' },
    { arguments: '{"city":"Taipei"}', deltas: ['{"city":', '"Taipei"}'], expectedDeltas: ['{"city":', '"Taipei"}'], input: {}, name: 'streams tool arguments after an empty start input' },
    { arguments: '', deltas: [], expectedDeltas: [], input: {}, name: 'keeps an empty tool input without adding a delta' },
  ])('$name', async ({ arguments: argumentsText, deltas, expectedDeltas, input }) => {
    const model = messages({
      baseURL: 'https://example.com/v1/',
      fetch: async () => new Response([
        { message: { id: 'msg_1', usage: {} }, type: 'message_start' },
        { content_block: { id: 'toolu_1', input, name: 'weather', type: 'tool_use' }, index: 0, type: 'content_block_start' },
        ...deltas.map(partial_json => ({ delta: { partial_json, type: 'input_json_delta' }, index: 0, type: 'content_block_delta' })),
        { index: 0, type: 'content_block_stop' },
        { delta: { stop_reason: 'tool_use' }, type: 'message_delta' },
        { type: 'message_stop' },
      ].map(event => `data: ${JSON.stringify(event)}\n\n`).join('')),
      model: 'm',
    })
    const events: TextEvent[] = []
    for await (const event of await model({ input: 'Weather in Taipei?', maxOutputTokens: 100 }))
      events.push(event)

    const toolCall = { arguments: argumentsText, callId: 'toolu_1', id: 'toolu_1', name: 'weather', type: 'tool-call' }
    expect(events.filter(event => event.type === 'tool-call.delta')).toEqual(expectedDeltas.map(delta => ({ callId: 'toolu_1', delta, index: 0, name: 'weather', type: 'tool-call.delta' })))
    expect(events.find(event => event.type === 'content.end')?.content).toEqual(toolCall)
    expect(events.find(event => event.type === 'step.end')?.message.content).toEqual([toolCall])
  })
})
