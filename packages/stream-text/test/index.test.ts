import { describe, expect, it } from 'vitest'

import type { StreamTextEvent } from '../src/types/event'

import { streamText } from '../src'

describe('@xsai/stream-text basic', async () => {
  it('basic', async () => {
    const { fullStream, steps, textStream } = await streamText({
      baseURL: 'http://localhost:11434/v1/',
      messages: [
        {
          content: 'You are a helpful assistant.',
          role: 'system',
        },
        {
          content: 'This is a test, so please answer \'YES\' and nothing else.',
          role: 'user',
        },
      ],
      model: 'granite3.3:2b',
      seed: 114514,
    })

    expect(steps).toMatchSnapshot()

    let text = ''
    for await (const t of textStream) {
      text += t
    }
    expect(text.toUpperCase()).toBe('YES')

    const events: StreamTextEvent[] = []
    for await (const event of fullStream) {
      // Yes => YES
      if (event.type === 'text-delta')
        event.text = event.text.toUpperCase()

      events.push(event)
    }
    expect(events).toMatchSnapshot()
  })

  it('stream', async () => {
    const { fullStream, steps, textStream } = await streamText({
      baseURL: 'http://localhost:11434/v1/',
      messages: [
        {
          content: 'You are a helpful assistant.',
          role: 'system',
        },
        {
          content: 'tell me a joke',
          role: 'user',
        },
      ],
      model: 'granite3.3:2b',
      seed: 114514,
    })

    expect(steps).toMatchSnapshot()

    const text = []
    for await (const t of textStream) {
      text.push(t)
    }
    expect(text.length).toBeGreaterThan(1)

    const events: StreamTextEvent[] = []
    for await (const event of fullStream) {
      events.push(event)
    }
    expect(events).toMatchSnapshot()
  })
})
