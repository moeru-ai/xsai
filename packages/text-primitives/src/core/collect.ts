import type { LanguageModel, LanguageModelOptions } from './types/language-model'
import type { StepEndDoneEvent } from './types/text-event'

import { readStepEnd } from '../utils/read-step-end'

export type CollectResult = Omit<StepEndDoneEvent, 'error' | 'type'>

export const collect = async (
  model: LanguageModel,
  options: LanguageModelOptions,
): Promise<CollectResult> => {
  const eventStream = await model(options)
  const terminal = await readStepEnd(eventStream)

  if (terminal.status === 'failed')
    throw terminal.error

  const { type, ...result } = terminal
  return result
}
