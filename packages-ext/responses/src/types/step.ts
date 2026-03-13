import type { FunctionCall, FunctionCallOutput, ResponseResource } from '../generated'
import type { Usage } from './usage'

export interface Step {
  functionCallOutputs: FunctionCallOutput[]
  functionCalls: FunctionCall[]
  response: ResponseResource
  text?: string
  usage?: Usage
  // TODO: reasoning
  // TODO: finishReason
  // TODO: stepType
}
