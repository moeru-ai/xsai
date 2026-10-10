import type { EventSourceMessage } from '@xsai/shared'

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
