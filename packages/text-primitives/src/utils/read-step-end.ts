import type { StepEndEvent, TextEvent } from '../core/types/text-event'

import { XSAIError } from '@xsai/shared'

export const readStepEnd = async (
  eventStream: ReadableStream<TextEvent>,
  emit?: (event: TextEvent) => void,
): Promise<StepEndEvent> => {
  for await (const event of eventStream) {
    emit?.(event)

    if (event.type === 'step.end')
      return event
  }

  throw new XSAIError('truncated-stream', 'model stream ended without a step.end event')
}
