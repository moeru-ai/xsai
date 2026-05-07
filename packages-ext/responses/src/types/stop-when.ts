import type { CompletionStep } from '@xsai/shared-chat'

import type { ItemParam } from '../generated'

export type StopCondition = (context: StopContext) => boolean

export interface StopContext {
  input: readonly ItemParam[]
  step: CompletionStep
  steps: readonly CompletionStep[]
}
