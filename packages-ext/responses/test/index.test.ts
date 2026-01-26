import type { StreamingEvent } from '../src/types/streaming-event'

import { describe, expect, it } from 'vitest'

import { responses } from '../src'

describe('@xsai-ext/responses basic', async () => {
  it('basic', async () => {
    const { eventStream, textStream } = responses({
      baseURL: 'http://localhost:11434/v1/',
      input: 'Hello!',
      instructions: 'You are a helpful assistant.',
      model: 'granite4:1b-h',
    })

    let text = ''
    for await (const t of textStream) {
      text += t
    }

    const events: StreamingEvent[] = []
    for await (const e of eventStream) {
      events.push(e)
    }

    expect(text.length).toBeGreaterThan(1)
    expect(text).toMatchSnapshot()

    expect(events).toMatchSnapshot()
  })
})
