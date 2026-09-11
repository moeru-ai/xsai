import type { Event, TextDeltaEvent } from '@xsai/text-primitives'

import { describe, expect, it } from 'vitest'

import { responses } from '../src'

const baseURL = process.env.XSAI_E2E_BASE_URL!
const modelName = process.env.XSAI_E2E_MODEL!

describe('responses e2e', () => {
  it('streams a response from the local Ollama Responses API', async () => {
    const model = responses({ baseURL, model: modelName })
    const stream = await model({
      input: 'Reply with exactly: e2e-ok',
    })

    const events: Event[] = []
    for await (const event of stream) {
      events.push(event)
    }

    const text = events
      .filter((event): event is TextDeltaEvent => event.type === 'text.delta')
      .map(event => event.delta)
      .join('')

    expect(text.length).toBeGreaterThan(0)
    expect(events.some(event => event.type === 'finish')).toBe(true)
  })
})
