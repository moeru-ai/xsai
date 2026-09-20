import type { LanguageModel, LanguageModelOptions } from './types/language-model'
import type { StreamEndEvent } from './types/text-event'

import { readStreamEnd } from '../utils/read-stream-end'

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
  const terminal = await readStreamEnd(eventStream)

  if (terminal.status === 'failed')
    throw terminal.error

  const { type, ...result } = terminal
  return result
}
