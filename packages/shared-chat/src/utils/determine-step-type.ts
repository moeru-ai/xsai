import type { FinishReason, StepType } from '../types'

export interface DetermineStepTypeOptions {
  finishReason: FinishReason
  maxSteps: number
  stepsLength: number
  toolCallsLength: number
}

/** @internal */
export const determineStepType = ({ finishReason, maxSteps, stepsLength, toolCallsLength }: DetermineStepTypeOptions): StepType => {
  if (maxSteps >= stepsLength) {
    if (toolCallsLength > 0 && finishReason === 'tool_calls') {
      return 'tool-result'
    }
    else if (finishReason === 'length') {
      return 'continue'
    }
    else if (finishReason === 'stop') {
      return 'done'
    }
  }
  return 'initial'
}
