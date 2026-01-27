import type { FunctionCall, FunctionCallOutput, ResponseResource } from '../generated'
import type { Usage } from './usage'

export interface Step {
  functionCallOutputs?: FunctionCallOutput[]
  functionCalls?: FunctionCall[]
  response: ResponseResource
  usage?: Usage
  // TODO: text
  // TODO: reasoning
  // TODO: finishReason
}
