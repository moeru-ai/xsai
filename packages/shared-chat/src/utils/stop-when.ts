import type { StopCondition, StopContext } from '../types'

export const and = (...conditions: StopCondition[]): StopCondition =>
  context => conditions.every(condition => condition(context))

export const or = (...conditions: StopCondition[]): StopCondition =>
  context => conditions.some(condition => condition(context))

export const not = (condition: StopCondition): StopCondition =>
  context => !condition(context)

export const stepCountAtLeast = (count: number): StopCondition =>
  ({ steps }) => steps.length >= count

export const hasToolCall = (name?: string): StopCondition =>
  ({ step }) => step.toolCalls.some(toolCall => name == null || toolCall.toolName === name)

/** @deprecated use `stepCountAtLeast` instead. */
export const stepCountIs = stepCountAtLeast

/** @internal */
export const shouldStop = (stopWhen: StopCondition, context: StopContext): boolean =>
  stopWhen(context)
