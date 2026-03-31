import type { Message } from './message'
import type { CompletionStep } from './step'
import type { ToolChoice } from './tool-choice'

export type PrepareStep = (options: PrepareStepOptions) => PrepareStepResult | Promise<PrepareStepResult>

export interface PrepareStepOptions {
  messages: Message[]
  model: string
  stepNumber: number
  steps: CompletionStep[]
}

export interface PrepareStepResult {
  messages?: Message[]
  model?: string
  toolChoice?: ToolChoice
}
