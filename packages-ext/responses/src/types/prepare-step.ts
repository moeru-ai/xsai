import type { CompletionStep } from '@xsai/shared-chat'

import type { CreateResponseBody, ItemParam } from '../generated'

export type PrepareStep = (options: PrepareStepOptions) => PrepareStepResult | Promise<PrepareStepResult>

export interface PrepareStepOptions {
  input: ItemParam[]
  model?: null | string
  stepNumber: number
  steps: CompletionStep[]
}

export interface PrepareStepResult {
  input?: ItemParam[]
  model?: string
  toolChoice?: OpenResponsesPrepareToolChoice
}

type OpenResponsesPrepareToolChoice = NonNullable<{
  tool_choice?: CreateResponseBody['tool_choice']
}['tool_choice']>
