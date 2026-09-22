import type { Message, StepResult } from '../core'

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

export const maxSteps = (count: number): StopCondition =>
  ({ steps }) => steps.length >= count

export const hasToolCall = (name?: string): StopCondition =>
  ({ step }) => step.toolCalls.some(toolCall => name == null || toolCall.name === name)

/** @deprecated use `maxSteps` instead. */
export const stepCountAtLeast = maxSteps
