import type { CollectResult } from './collect'
import type { ToolCallPart, ToolResultPart } from './types/content'
import type { LanguageModel, LanguageModelOptions } from './types/language-model'
import type { Message } from './types/message'

import { collect } from './collect'
import { executeTools } from './execute-tools'

export interface LoopOptions extends LanguageModelOptions {
  prepareStep?: PrepareStep
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

export type StopCondition = (context: StopContext) => boolean | Promise<boolean>

export interface StopContext {
  input: Message[]
  step: LoopStep
  steps: LoopStep[]
}

export const loop = async (model: LanguageModel, { prepareStep, stopWhen, ...options }: LoopOptions): Promise<CollectResult> => {
  const input: Message[] = Array.isArray(options.input) ? options.input : [{ content: options.input, role: 'user' }]
  const steps: LoopStep[] = []

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
    const result = await collect(model, modelOptions)
    const toolCalls = typeof result.message.content === 'string'
      ? []
      : result.message.content.filter((part): part is ToolCallPart => part.type === 'tool-call')
    const step: LoopStep = { ...result, toolCalls, toolResults: [] }

    steps.push(step)
    input.push(result.message)

    if (options.signal?.aborted === true)
      throw options.signal.reason ?? new DOMException('The operation was aborted', 'AbortError')

    const stop = await stopWhen?.({
      input,
      step,
      steps,
    }) ?? true

    if (stop || toolCalls.length === 0 || options.signal?.aborted)
      return result

    const results = await executeTools({
      ...modelOptions,
      reason: result.reason,
      toolCalls,
    })

    step.toolResults.push(...results)
    input.push({ content: results, role: 'user' })
  }
}
