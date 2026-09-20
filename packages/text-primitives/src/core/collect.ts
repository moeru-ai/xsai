import type { LanguageModel, LanguageModelOptions } from './types/language-model'
import type { StreamEndDoneEvent } from './types/text-event'

import { readStreamEnd } from '../utils/read-stream-end'

export type CollectResult = Omit<StreamEndDoneEvent, 'error' | 'type'>

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
