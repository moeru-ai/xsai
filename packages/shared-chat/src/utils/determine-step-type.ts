import type { FinishReason, StepType } from '../types'

export interface DetermineStepTypeOptions {
  finishReason: FinishReason
  maxSteps: number
  stepsLength: number
  toolCallsLength: number
}

/** @internal */
export const determineStepType = ({ finishReason, maxSteps, stepsLength, toolCallsLength }: DetermineStepTypeOptions): StepType => {
  if (stepsLength === 0) {
    return 'initial'
  }
  else if (maxSteps >= stepsLength) {
    if (toolCallsLength > 0 && finishReason === 'tool_calls')
      return 'tool-result'
    else if (!['error', 'length'].includes(finishReason))
      return 'continue'
  }

  return 'done'
}
