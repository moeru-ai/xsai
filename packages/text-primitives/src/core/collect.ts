import type { StreamEndEvent } from './types/event'
import type { LanguageModel, LanguageModelOptions } from './types/language-model'

import { XSAIError } from '@xsai/shared'

/** The resolved value of {@link collect}. */
export type CollectResult = Omit<StreamEndEvent, 'error' | 'type'>

/**
 * Resolves with `stream.end`; rejects on errors or truncated streams. The
 * stream is cancelled once `stream.end` arrives.
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
