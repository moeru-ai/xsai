import type { Message } from './message'
import type { CompletionStep } from './step'

export type StopCondition = (context: StopContext) => boolean

export interface StopContext {
  messages: readonly Message[]
  step: StopStep
  steps: readonly StopStep[]
}

export type StopStep<T extends boolean = false> = Omit<CompletionStep<T>, 'stepType'>
