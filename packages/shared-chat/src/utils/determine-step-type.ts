import type { CompletionStepType, FinishReason } from '../types'

export interface DetermineStepTypeOptions {
  finishReason: FinishReason
  stepsLength: number
  toolCallsLength: number
  willContinue: boolean
}

/** @internal */
export const determineStepType = ({ finishReason, stepsLength, toolCallsLength, willContinue }: DetermineStepTypeOptions): CompletionStepType => {
  if (stepsLength === 0) {
    return 'initial'
  }
  else if (willContinue) {
    if (toolCallsLength > 0 && ['tool-calls', 'tool_calls'].includes(finishReason))
      return 'tool-result'
    else if (!['error', 'length'].includes(finishReason))
      return 'continue'
  }

  return 'done'
}
