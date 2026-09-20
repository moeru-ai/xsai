import type { Promisable } from '@xsai/shared'

import type { LanguageModelOptions, Message } from '../../core'
import type { StepResult } from './step'

export type PrepareStep = (options: PrepareStepOptions) => Promisable<PrepareStepResult | undefined>

export interface PrepareStepOptions {
  input: Message[]
  stepNumber: number
  steps: StepResult[]
}

export type PrepareStepResult = Partial<Omit<LanguageModelOptions, 'signal'>>
