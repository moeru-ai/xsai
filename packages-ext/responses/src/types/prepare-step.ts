import type { CreateResponseBody, ItemParam } from '../generated'
import type { Step } from './step'

export type PrepareStep = (options: PrepareStepOptions) => PrepareStepResult | Promise<PrepareStepResult>

export interface PrepareStepOptions {
  input: ItemParam[]
  model?: null | string
  stepNumber: number
  steps: Step[]
}

export interface PrepareStepResult {
  input?: ItemParam[]
  model?: string
  toolChoice?: OpenResponsesPrepareToolChoice
}

type OpenResponsesPrepareToolChoice = NonNullable<{
  tool_choice?: CreateResponseBody['tool_choice']
}['tool_choice']>
