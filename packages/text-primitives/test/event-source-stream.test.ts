import type { EventSourceMessage } from '../src'

import { describe, expect, it } from 'vitest'

import { EventSourceDataStream } from '../src'

describe('eventSourceDataStream', () => {
  it('closes when the source ends without [DONE]', async () => {
    const source = new ReadableStream<EventSourceMessage>({
      start: (controller) => {
        controller.enqueue({ data: '{"a":1}' })
        controller.close()
      },
    })

    const reader = source.pipeThrough(new EventSourceDataStream()).getReader()
    await expect(reader.read()).resolves.toEqual({ done: false, value: '{"a":1}' })
    await expect(reader.read()).resolves.toEqual({ done: true })
  })

  it('passes data frames through and closes on [DONE]', async () => {
    const source = new ReadableStream<EventSourceMessage>({
      start: (controller) => {
        controller.enqueue({ data: '{"a":1}' })
        controller.enqueue({ data: '[DONE]' })
        controller.close()
      },
    })

    const reader = source.pipeThrough(new EventSourceDataStream()).getReader()
    await expect(reader.read()).resolves.toEqual({ done: false, value: '{"a":1}' })
    await expect(reader.read()).resolves.toEqual({ done: true })
  })
})
