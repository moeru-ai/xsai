import { describe, expect, it } from 'vitest'

import { TextEventTarget, toCustomEvent } from '../src'

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
})
