import { describe, expect, it } from 'vitest'

import { TextEventTarget, toCustomEvent, withEventTarget } from '../src'

describe('text events', () => {
  it('dispatches typed custom events with normalized details', () => {
    const events = new TextEventTarget()
    const observed: string[] = []
    events.addEventListener('text.delta', event => observed.push(event.detail.delta))
    const event = toCustomEvent({ delta: 'Hello', index: 0, type: 'text.delta' })

    events.dispatchEvent(event)

    expect(events).toBeInstanceOf(EventTarget)
    expect(event).toBeInstanceOf(CustomEvent)
    expect(event.detail).toEqual({ delta: 'Hello', index: 0 })
    expect(event.detail.delta).toBe('Hello')
    expect(observed).toEqual(['Hello'])
  })

  it('preserves raw detail by reference', () => {
    const detail = { item_id: 'ws_1', type: 'response.web_search_call.searching' }
    const event = toCustomEvent({ detail, type: 'raw' })

    expect(event.type).toBe('raw')
    expect(event.detail).toBe(detail)
  })

  it('observes each event passing through a stream', async () => {
    const target = new TextEventTarget()
    const detail = { id: 'wire_1' }
    const sequence = [
      { type: 'step.start' as const },
      { delta: 'Hello', index: 0, type: 'text.delta' as const },
      { detail, type: 'raw' as const },
    ]
    const observed: [string, unknown][] = []
    for (const type of ['step.start', 'text.delta', 'raw'] as const)
      target.addEventListener(type, (event: CustomEvent) => observed.push([event.type, event.detail]))

    const stream = new ReadableStream({
      start: (controller) => {
        for (const event of sequence)
          controller.enqueue(event)
        controller.close()
      },
    }).pipeThrough(withEventTarget(target))
    const forwarded = []
    for await (const event of stream)
      forwarded.push(event)

    expect(forwarded).toEqual(sequence)
    expect(observed).toEqual([
      ['step.start', {}],
      ['text.delta', { delta: 'Hello', index: 0 }],
      ['raw', detail],
    ])
    expect(observed[2][1]).toBe(detail)
  })
})
