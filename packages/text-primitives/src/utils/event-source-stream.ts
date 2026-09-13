import type { EventSourceMessage } from 'eventsource-parser/stream'

import { XSAIError } from '@xsai/shared'

export { type EventSourceMessage, EventSourceParserStream } from 'eventsource-parser/stream'

export const DONE = '[DONE]'

export class EventSourceDataStream extends TransformStream<EventSourceMessage, string> {
  constructor(checkDone = false) {
    let done = false

    super({
      flush: () => {
        if (done || !checkDone)
          return

        throw new XSAIError('truncated-stream', 'EventSourceDataStream: SSE stream ended without [DONE]')
      },
      transform: ({ data }, controller) => {
        if (data === DONE) {
          done = true
          controller.terminate()
          return
        }

        controller.enqueue(data)
      },
    })
  }
}
