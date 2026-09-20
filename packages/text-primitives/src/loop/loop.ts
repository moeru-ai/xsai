import type { ToolCallPart } from '../core/types/content'
import type { LanguageModel, LanguageModelOptions } from '../core/types/language-model'
import type { Message } from '../core/types/message'
import type { TextEvent } from '../core/types/text-event'
import type { StopCondition } from './stop-condition'
import type { PrepareStep } from './types/prepare-step'
import type { StepResult } from './types/step'

import { readStreamEnd } from '../utils/read-stream-end'
import { executeTools } from './execute-tools'
import { maxSteps } from './stop-condition'

export interface LoopOptions extends LanguageModelOptions {
  prepareStep?: PrepareStep
  /** @default `maxSteps(10)` */
  stopWhen?: StopCondition
}

export const loop = (model: LanguageModel, { prepareStep, stopWhen: stopWhenOption, ...options }: LoopOptions): ReadableStream<TextEvent> => {
  const stopWhen = stopWhenOption ?? maxSteps(10)
  const input: Message[] = [...(Array.isArray(options.input) ? options.input : [{ content: options.input, role: 'user' } satisfies Message])]
  const steps: StepResult[] = []

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
        const step: StepResult = { ...result, toolCalls, toolResults: [] }

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
