import type { Promisable } from '@xsai/shared'

import type { LanguageModel, LanguageModelOptions } from './language-model'
import type { Message } from './message'
import type { StepResult } from './step-result'

export type PrepareStep = (options: PrepareStepOptions) => Promisable<PrepareStepResult | undefined>

export interface PrepareStepOptions {
  input: readonly Message[]
  signal: AbortSignal
  stepNumber: number
  steps: readonly StepResult[]
}

export interface PrepareStepResult extends Partial<Omit<LanguageModelOptions, 'events' | 'signal'>> {
  model?: LanguageModel
}
