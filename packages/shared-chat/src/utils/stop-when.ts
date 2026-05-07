import type { StopCondition, StopContext } from '../types'

export const and = <Input = unknown>(...conditions: StopCondition<Input>[]): StopCondition<Input> =>
  context => conditions.every(condition => condition(context))

export const or = <Input = unknown>(...conditions: StopCondition<Input>[]): StopCondition<Input> =>
  context => conditions.some(condition => condition(context))

export const not = <Input = unknown>(condition: StopCondition<Input>): StopCondition<Input> =>
  context => !condition(context)

export const stepCountAtLeast = (count: number): StopCondition =>
  ({ steps }) => steps.length >= count

export const hasToolCall = (name?: string): StopCondition =>
  ({ step }) => step.toolCalls.some(toolCall => name == null || toolCall.toolName === name)

/** @deprecated use `stepCountAtLeast` instead. */
export const stepCountIs = stepCountAtLeast

/** @internal */
export const shouldStop = <Input = unknown>(stopWhen: StopCondition<Input>, context: StopContext<Input>): boolean =>
  stopWhen(context)
