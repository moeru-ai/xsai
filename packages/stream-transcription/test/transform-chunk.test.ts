import { JSONParseError, RemoteAPIError } from '@xsai/shared'
import { describe, expect, it } from 'vitest'
import { EventSourceParserStream } from 'eventsource-parser/stream'

import { transformChunk } from '../src/internal/_transform-chunk'

const encoder = new TextEncoder()

const readTransformed = async (input: string) => {
  const stream = new ReadableStream<Uint8Array>({
    start: (controller) => {
      controller.enqueue(encoder.encode(input))
      controller.close()
    },
  })

  await stream
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(new EventSourceParserStream())
    .pipeThrough(transformChunk())
    .pipeTo(new WritableStream({
      write: () => {},
    }))
}

describe('@xsai/stream-transcription transformChunk errors', () => {
  it('throws RemoteAPIError for server error chunks', async () => {
    await expect(readTransformed('data: {"error":{"message":"denied"}}\n')).rejects.toBeInstanceOf(RemoteAPIError)
  })

  it('throws JSONParseError for invalid JSON chunks', async () => {
    await expect(readTransformed('data: {"text":\n')).rejects.toBeInstanceOf(JSONParseError)
  })
})
