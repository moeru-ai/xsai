import type { ItemParam } from '../generated'
import type { Step } from './step'

export type StopCondition = (context: StopContext) => boolean

export interface StopContext {
  input: readonly ItemParam[]
  step: Step
  steps: readonly Step[]
}
