import { describe, expect, it } from 'vitest'

import { chat } from '../src'

describe('chat raw events', () => {
  it('exposes provider chunks when requested', async () => {
    const chunks = [
      { choices: [{ delta: { content: 'Hello' }, finish_reason: null, index: 0 }], id: 'chat_1' },
      { choices: [{ delta: {}, finish_reason: 'stop', index: 0 }], id: 'chat_1' },
    ]
    const model = chat({
      baseURL: 'https://example.com/v1/',
      fetch: async () => new Response([
        ...chunks.map(chunk => `data: ${JSON.stringify(chunk)}\n\n`),
        'data: [DONE]\n\n',
      ].join('')),
      model: 'test-model',
    })
    const events = []
    for await (const event of await model({ includeRawEvents: true, input: 'hi' }))
      events.push(event)

    expect(events.filter(event => event.type === 'raw')).toEqual(
      chunks.map(detail => ({ detail, type: 'raw' })),
    )
    expect(events).toContainEqual({ delta: 'Hello', index: 0, type: 'text.delta' })
  })
})
