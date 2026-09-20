import type { Message } from '../core'
import type { StepResult } from './types/step'

export type StopCondition = (context: StopContext) => boolean

export interface StopContext {
  input: readonly Message[]
  step: StepResult
  steps: readonly StepResult[]
}

export const and = (...conditions: StopCondition[]): StopCondition =>
  context => conditions.every(condition => condition(context))

export const or = (...conditions: StopCondition[]): StopCondition =>
  context => conditions.some(condition => condition(context))

export const not = (condition: StopCondition): StopCondition =>
  context => !condition(context)

export const stepCountAtLeast = (count: number): StopCondition =>
  ({ steps }) => steps.length >= count

export const hasToolCall = (name?: string): StopCondition =>
  ({ step }) => step.toolCalls.some(toolCall => name == null || toolCall.name === name)
