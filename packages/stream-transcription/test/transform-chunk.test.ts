import { RemoteAPIError, StreamChunkParseError } from '@xsai/shared'
import { describe, expect, it } from 'vitest'

import { transformChunk } from '../src/internal/_transform-chunk'

const encoder = new TextEncoder()

const readTransformed = async (input: string) => {
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(encoder.encode(input))
      controller.close()
    },
  })

  await stream
    .pipeThrough(transformChunk())
    .pipeTo(new WritableStream({
      write() {},
    }))
}

describe('@xsai/stream-transcription transformChunk errors', () => {
  it('throws RemoteAPIError for server error chunks', async () => {
    await expect(readTransformed('data: {"error":{"message":"denied"}}\n')).rejects.toBeInstanceOf(RemoteAPIError)
  })

  it('throws StreamChunkParseError for invalid JSON chunks', async () => {
    await expect(readTransformed('data: {"text":\n')).rejects.toBeInstanceOf(StreamChunkParseError)
  })
})
