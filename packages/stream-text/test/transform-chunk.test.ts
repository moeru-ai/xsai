import type { EventSourceMessage } from 'eventsource-parser/stream'

import { JSONParseError, RemoteAPIError } from '@xsai/shared'
import { describe, expect, it } from 'vitest'

import { transformChunk } from '../src/internal/_transform-chunk'

const readTransformed = async (message: EventSourceMessage) => {
  const stream = new ReadableStream<EventSourceMessage>({
    start: (controller) => {
      controller.enqueue(message)
      controller.close()
    },
  })

  await stream
    .pipeThrough(transformChunk())
    .pipeTo(new WritableStream({
      write: () => {},
    }))
}

describe('@xsai/stream-text transformChunk errors', () => {
  it('throws RemoteAPIError for server error chunks', async () => {
    await expect(readTransformed({
      data: '{"error":{"message":"denied"}}',
      event: 'message',
      id: '',
    })).rejects.toBeInstanceOf(RemoteAPIError)
  })

  it('throws JSONParseError for invalid JSON chunks', async () => {
    await expect(readTransformed({
      data: '{"choices":',
      event: 'message',
      id: '',
    })).rejects.toBeInstanceOf(JSONParseError)
  })
})
