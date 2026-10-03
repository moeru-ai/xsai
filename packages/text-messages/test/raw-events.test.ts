import { TextEventTarget } from '@xsai/text-primitives'
import { describe, expect, it } from 'vitest'

import { messages } from '../src'

describe('messages raw events', () => {
  it('exposes provider events when requested', async () => {
    const wireEvents = [{ type: 'ping' }, { type: 'message_stop' }]
    const target = new TextEventTarget()
    const observed: Event[] = []
    for (const type of ['step.start', 'raw', 'step.end'] as const)
      target.addEventListener(type, event => observed.push(event))
    const model = messages({
      baseURL: 'https://example.com/v1/',
      fetch: async () => new Response(wireEvents.map(event => `data: ${JSON.stringify(event)}\n\n`).join('')),
      model: 'test-model',
    })
    const events = []
    for await (const event of await model({ events: target, includeRawEvents: true, input: 'hi', maxOutputTokens: 10 }))
      events.push(event)

    expect(events.filter(event => event.type === 'raw')).toEqual(
      wireEvents.map(detail => ({ detail, type: 'raw' })),
    )
    expect(events.at(-1)).toMatchObject({ status: 'completed', type: 'step.end' })
    expect(observed.map(event => event.type)).toEqual(['step.start', 'raw', 'raw', 'step.end'])
    expect((observed[1] as CustomEvent).detail).toBe(events.find(event => event.type === 'raw')?.detail)
  })
})
