import type { StreamEndEvent, TextEvent } from '../core/types/text-event'

import { XSAIError } from '@xsai/shared'

export const readStreamEnd = async (
  eventStream: ReadableStream<TextEvent>,
  emit?: (event: TextEvent) => void,
): Promise<StreamEndEvent> => {
  for await (const event of eventStream) {
    emit?.(event)

    if (event.type === 'stream.end')
      return event
  }

  throw new XSAIError('truncated-stream', 'model stream ended without a stream.end event')
}
