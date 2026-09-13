import type { EventSourceMessage } from '../src'

import { describe, expect, it } from 'vitest'

import { EventSourceDataStream } from '../src'

describe('eventSourceDataStream', () => {
  it('rejects with a truncated-stream error when the stream ends without [DONE]', async () => {
    const stream = new EventSourceDataStream(true)
    const reader = stream.readable.getReader()

    await stream.writable.close().catch(() => {})

    await expect(reader.read()).rejects.toMatchObject({
      code: 'truncated-stream',
      message: 'EventSourceDataStream: SSE stream ended without [DONE]',
    })
  })

  it('passes data frames through and closes on [DONE]', async () => {
    const source = new ReadableStream<EventSourceMessage>({
      start: (controller) => {
        controller.enqueue({ data: '{"a":1}' })
        controller.enqueue({ data: '[DONE]' })
        controller.close()
      },
    })

    const reader = source.pipeThrough(new EventSourceDataStream(true)).getReader()
    await expect(reader.read()).resolves.toEqual({ done: false, value: '{"a":1}' })
    await expect(reader.read()).resolves.toEqual({ done: true })
  })
})
