import type { StopCondition, StopContext } from '../types/stop-when'

export const and = (...conditions: StopCondition[]): StopCondition =>
  context => conditions.every(condition => condition(context))

export const or = (...conditions: StopCondition[]): StopCondition =>
  context => conditions.some(condition => condition(context))

export const not = (condition: StopCondition): StopCondition =>
  context => !condition(context)

export const stepCountAtLeast = (count: number): StopCondition =>
  ({ steps }) => steps.length >= count

export const hasFunctionCall = (name?: string): StopCondition =>
  ({ step }) => step.functionCalls.some(functionCall => name == null || functionCall.name === name)

/** @internal */
export const shouldStop = (stopWhen: StopCondition, context: StopContext): boolean =>
  stopWhen(context)
