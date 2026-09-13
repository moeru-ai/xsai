import type { EventSourceMessage } from 'eventsource-parser/stream'

export { type EventSourceMessage, EventSourceParserStream } from 'eventsource-parser/stream'

export const DONE = '[DONE]'

export class EventSourceDataStream extends TransformStream<EventSourceMessage, string> {
  constructor() {
    super({
      transform: ({ data }, controller) => {
        if (data === DONE) {
          controller.terminate()
          return
        }

        controller.enqueue(data)
      },
    })
  }
}
