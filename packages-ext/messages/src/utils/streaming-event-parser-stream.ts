import type { EventSourceMessage } from 'eventsource-parser/stream'

import type { StreamingEvent } from '../types/streaming-event'

export class StreamingEventParserStream extends TransformStream<EventSourceMessage, StreamingEvent> {
  constructor() {
    super({
      transform: async (chunk, controller) => {
        if (chunk.data === '[DONE]' || chunk.data.length === 0)
          return

        const event = JSON.parse(chunk.data) as StreamingEvent
        controller.enqueue(event)
      },
    })
  }
}
