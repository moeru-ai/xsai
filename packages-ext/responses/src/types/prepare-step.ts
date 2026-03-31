import type { ItemParam } from '../generated'
import type { Step } from './step'

export type PrepareStep = (options: PrepareStepOptions) => PrepareStepResult | Promise<PrepareStepResult>

export interface PrepareStepOptions {
  input: ItemParam[]
  model?: string
  stepNumber: number
  steps: Step[]
  tool_choice?: OpenResponsesPrepareToolChoice
}

export interface PrepareStepResult {
  input?: ItemParam[]
  model?: string
  tool_choice?: OpenResponsesPrepareToolChoice
}

type OpenResponsesPrepareToolChoice = NonNullable<{
  tool_choice?: import('../generated').CreateResponseBody['tool_choice']
}['tool_choice']>
