import type { Message } from './message'
import type { CompletionStep } from './step'

export type StopCondition = (context: StopContext) => boolean

export interface StopContext {
  messages: readonly Message[]
  step: CompletionStep
  steps: readonly CompletionStep[]
}
