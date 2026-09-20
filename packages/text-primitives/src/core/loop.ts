import type { CollectResult } from './collect'
import type { ToolCallPart, ToolResultPart } from './types/content'
import type { LanguageModel, LanguageModelOptions } from './types/language-model'
import type { Message } from './types/message'
import type { TextEvent } from './types/text-event'

import { readStreamEnd } from '../utils/read-stream-end'
import { executeTools } from './execute-tools'

export interface LoopOptions extends LanguageModelOptions {
  prepareStep?: PrepareStep
  /** @default `stepCountAtLeast(10)` */
  stopWhen?: StopCondition
}

export interface LoopStep extends CollectResult {
  toolCalls: ToolCallPart[]
  toolResults: ToolResultPart[]
}

export type PrepareStep = (options: PrepareStepOptions) => PrepareStepResult | Promise<PrepareStepResult | undefined> | undefined

export interface PrepareStepOptions {
  input: Message[]
  stepNumber: number
  steps: LoopStep[]
}

/** Per-step model overrides; `signal` remains owned by the loop. */
export type PrepareStepResult = Partial<Omit<LanguageModelOptions, 'signal'>>

export type StopCondition = (context: StopContext) => boolean

export interface StopContext {
  input: readonly Message[]
  step: LoopStep
  steps: readonly LoopStep[]
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

export const loop = (model: LanguageModel, { prepareStep, stopWhen: stopWhenOption, ...options }: LoopOptions): ReadableStream<TextEvent> => {
  const stopWhen = stopWhenOption ?? stepCountAtLeast(10)
  const input: Message[] = Array.isArray(options.input) ? options.input : [{ content: options.input, role: 'user' }]
  const steps: LoopStep[] = []

  return new ReadableStream<TextEvent>({
    start: async (controller) => {
      while (true) {
        const prepared = await prepareStep?.({
          input,
          stepNumber: steps.length,
          steps,
        })
        const modelOptions: LanguageModelOptions = {
          ...options,
          ...prepared,
          input: prepared?.input ?? input,
        }
        const eventStream = await model(modelOptions)
        const completed = await readStreamEnd(eventStream, event => controller.enqueue(event))
        if (completed.status === 'failed') {
          controller.close()
          return
        }

        const { type, ...result } = completed

        const toolCalls = typeof result.message.content === 'string'
          ? []
          : result.message.content.filter((part): part is ToolCallPart => part.type === 'tool-call')
        const step: LoopStep = { ...result, toolCalls, toolResults: [] }

        steps.push(step)
        input.push(result.message)

        const stop = stopWhen({
          input,
          step,
          steps,
        })

        if (stop || toolCalls.length === 0) {
          controller.close()
          return
        }

        options.signal?.throwIfAborted()

        const results = await executeTools({
          ...modelOptions,
          reason: result.reason,
          toolCalls,
        })

        step.toolResults.push(...results)
        input.push({ content: results, role: 'user' })
      }
    },
  })
}
