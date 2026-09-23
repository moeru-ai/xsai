import { describe, expect, it } from 'vitest'

import { messages } from '../src'

describe('messages raw events', () => {
  it('exposes provider events when requested', async () => {
    const wireEvents = [{ type: 'ping' }, { type: 'message_stop' }]
    const model = messages({
      baseURL: 'https://example.com/v1/',
      fetch: async () => new Response(wireEvents.map(event => `data: ${JSON.stringify(event)}\n\n`).join('')),
      model: 'test-model',
    })
    const events = []
    for await (const event of await model({ includeRawEvents: true, input: 'hi', maxOutputTokens: 10 }))
      events.push(event)

    expect(events.filter(event => event.type === 'raw')).toEqual(
      wireEvents.map(detail => ({ detail, type: 'raw' })),
    )
    expect(events.at(-1)).toMatchObject({ status: 'completed', type: 'step.end' })
  })
})
