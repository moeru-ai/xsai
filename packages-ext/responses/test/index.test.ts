import type { StreamingEvent } from '../src/types/streaming-event'

import { describe, expect, it, vi } from 'vitest'

import { responses } from '../src'
import { createEventStreamResponse } from './utils'

describe('@xsai-ext/responses basic', async () => {
  it('basic', async () => {
    const { eventStream, textStream, totalUsage, usage } = responses({
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
    expect(await usage).toMatchSnapshot()
    expect(await totalUsage).toMatchSnapshot()
  })

  it('rejects usage promises when the initial stream setup fails', async () => {
    const error = new Error('boom')
    const fetch = vi.fn().mockRejectedValue(error) as typeof globalThis.fetch

    const { eventStream, steps, totalUsage, usage } = responses({
      baseURL: 'http://localhost:11434/v1/',
      fetch,
      input: 'Hello!',
      instructions: 'You are a helpful assistant.',
      model: 'granite4:1b-h',
    })

    await expect(eventStream.getReader().read()).rejects.toThrow(error)
    await expect(usage).rejects.toThrow(error)
    await expect(totalUsage).rejects.toThrow(error)
    expect(steps).toEqual([])
  })

  it('records incomplete responses as steps', async () => {
    const fetch = vi.fn().mockResolvedValue(createEventStreamResponse([
      {
        response: {
          id: 'resp_incomplete',
          object: 'response',
          output: [],
          status: 'incomplete',
          usage: {
            input_tokens: 4,
            output_tokens: 0,
            total_tokens: 4,
          },
        },
        sequence_number: 0,
        type: 'response.incomplete',
      },
    ])) as typeof globalThis.fetch

    const { eventStream, steps, totalUsage, usage } = responses({
      baseURL: 'http://localhost:11434/v1/',
      fetch,
      input: 'Hello!',
      instructions: 'You are a helpful assistant.',
      model: 'granite4:1b-h',
    })

    const events: StreamingEvent[] = []
    for await (const event of eventStream) {
      events.push(event)
    }

    expect(events.map(event => event.type)).toEqual(['response.incomplete'])
    expect(steps.map(step => step.response.status)).toEqual(['incomplete'])
    await expect(usage).resolves.toMatchObject({ total_tokens: 4 })
    await expect(totalUsage).resolves.toMatchObject({ total_tokens: 4 })
  })
})
