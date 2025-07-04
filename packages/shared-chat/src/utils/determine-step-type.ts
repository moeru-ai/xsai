import type { CompletionStepType, FinishReason } from '../types'

export interface DetermineStepTypeOptions {
  finishReason: FinishReason
  maxSteps: number
  stepsLength: number
  toolCallsLength: number
}

/** @internal */
export const determineStepType = ({ finishReason, maxSteps, stepsLength, toolCallsLength }: DetermineStepTypeOptions): CompletionStepType => {
  if (stepsLength === 0) {
    return 'initial'
  }
  else if (stepsLength < maxSteps) {
    if (toolCallsLength > 0 && finishReason === 'tool_calls')
      return 'tool-result'
    else if (!['error', 'length'].includes(finishReason))
      return 'continue'
  }

  return 'done'
}
