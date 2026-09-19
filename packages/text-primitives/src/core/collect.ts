import type { StreamEndEvent } from './types/event'
import type { LanguageModel, LanguageModelOptions } from './types/language-model'

import { XSAIError } from '@xsai/shared'

/** The resolved value of {@link collect}. */
export type CollectResult = Omit<Exclude<StreamEndEvent, { status: 'failed' }>, 'error' | 'type'>

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
    else if (event.status === 'failed')
      throw event.error
    else
      return event
  }

  throw new XSAIError('truncated-stream', 'model stream ended without a stream.end event')
}
