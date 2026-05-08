import type { Message } from './message'
import type { CompletionStep } from './step'
import type { ToolChoice } from './tool-choice'

export type PrepareStep<TInput = Message[], TToolChoice = ToolChoice> = (options: PrepareStepOptions<TInput>) => PrepareStepResult<TInput, TToolChoice> | Promise<PrepareStepResult<TInput, TToolChoice>>

export interface PrepareStepOptions<TInput = Message[]> {
  input: TInput
  model: string
  stepNumber: number
  steps: CompletionStep[]
}

export interface PrepareStepResult<TInput = Message[], TToolChoice = ToolChoice> {
  input?: TInput
  model?: string
  toolChoice?: TToolChoice
}
