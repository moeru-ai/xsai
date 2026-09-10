import type { EventSourceMessage } from 'eventsource-parser/stream'

export { type EventSourceMessage, EventSourceParserStream } from 'eventsource-parser/stream'

export const DONE = '[DONE]'

export class EventSourceDataStream extends TransformStream<EventSourceMessage, string> {
  constructor(checkDone = false) {
    let done = false

    super({
      flush: () => {
        if (done || !checkDone)
          return

        throw new Error('EventSourceDataStream: SSE stream ended without [DONE]')
      },
      transform: ({ data }, controller) => {
        controller.enqueue(data)

        if (data === DONE) {
          done = true
          controller.terminate()
        }
      },
    })
  }
}
