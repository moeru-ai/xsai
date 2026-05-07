import type { CompletionStep } from './step'

export type StopCondition<Input = unknown> = (context: StopContext<Input>) => boolean

export interface StopContext<Input = unknown> {
  input: readonly Input[]
  step: CompletionStep
  steps: readonly CompletionStep[]
}
