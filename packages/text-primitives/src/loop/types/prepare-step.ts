import type { Promisable } from '@xsai/shared'

import type { LanguageModelOptions, Message, StepResult } from '../../core'

export type PrepareStep = (options: PrepareStepOptions) => Promisable<PrepareStepResult | undefined>

export interface PrepareStepOptions {
  input: Message[]
  stepNumber: number
  steps: StepResult[]
}

export type PrepareStepResult = Partial<Omit<LanguageModelOptions, 'signal'>>
