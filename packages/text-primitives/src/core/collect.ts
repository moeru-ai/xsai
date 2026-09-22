import type { LanguageModel, LanguageModelOptions } from './types/language-model'
import type { StepResult } from './types/step-result'

import { readStepEnd } from '../utils/read-step-end'
import { toStepResult } from './step-result'

export const collect = async (
  model: LanguageModel,
  options: LanguageModelOptions,
): Promise<StepResult> => {
  const eventStream = await model(options)
  const terminal = await readStepEnd(eventStream)

  if (terminal.status === 'failed')
    throw terminal.error

  return toStepResult(terminal)
}
