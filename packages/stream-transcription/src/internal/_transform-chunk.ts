import type { EventSourceMessage } from 'eventsource-parser/stream'

import type { StreamTranscriptionDelta } from '..'

import { JSONParseError, RemoteAPIError } from '@xsai/shared'

const parseJSONChunk = (data: string): StreamTranscriptionDelta => {
  if (data.startsWith('{') && data.includes('"error":')) {
    throw new RemoteAPIError(`Error from server: ${data}`, {
      responseBody: data,
    })
  }

  try {
    return JSON.parse(data) as StreamTranscriptionDelta
  }
  catch (cause) {
    throw new JSONParseError(`Failed to parse stream chunk JSON: ${data}`, {
      cause,
      text: data,
    })
  }
}

/** @internal */
export const transformChunk = () => {
  return new TransformStream<EventSourceMessage, StreamTranscriptionDelta>({
    transform: (chunk, controller) => {
      if (!chunk.data || chunk.data === '[DONE]')
        return

      try {
        controller.enqueue(parseJSONChunk(chunk.data))
      }
      catch (error) {
        controller.error(error)
      }
    },
  })
}
