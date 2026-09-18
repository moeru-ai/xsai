import type { StreamEndEvent } from './types/event'
import type { LanguageModel, LanguageModelOptions } from './types/language-model'

import { XSAIError } from '@xsai/shared'

/** The resolved value of {@link collect}: the `stream.end` event's payload — the terminal error is thrown instead of carried. */
export type CollectResult = Omit<StreamEndEvent, 'error' | 'type'>

/**
 * Calls `model` and resolves with the `stream.end` event's payload. Rejects
 * when the stream reports an error or ends without a `stream.end` event. The
 * stream.end event settles the call — the stream is cancelled without waiting
 * for it to close.
 */
export const collect = async (
  model: LanguageModel,
  options: LanguageModelOptions,
): Promise<CollectResult> => {
  const eventStream = await model(options)

  for await (const event of eventStream) {
    if (event.type !== 'stream.end')
      continue

    if (event.reason === 'error')
      throw event.error ?? new XSAIError('model-error', 'model stream failed')

    return {
      message: event.message,
      reason: event.reason,
      ...(event.responseId == null ? {} : { responseId: event.responseId }),
      ...(event.responseStatus == null ? {} : { responseStatus: event.responseStatus }),
      ...(event.usage == null ? {} : { usage: event.usage }),
    }
  }

  throw new XSAIError('truncated-stream', 'model stream ended without a stream.end event')
}
