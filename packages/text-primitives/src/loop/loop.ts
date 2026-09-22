import type { LanguageModel, LanguageModelOptions, Message, StepResult, TextEvent } from '../core'
import type { PostToolCall, PreToolCall } from './execute-tools'
import type { StopCondition } from './stop-condition'
import type { PrepareStep } from './types/prepare-step'

import { toStepResult } from '../core/step-result'
import { readStepEnd } from '../utils/read-step-end'
import { executeTools } from './execute-tools'
import { maxSteps } from './stop-condition'

export interface LoopOptions extends LanguageModelOptions {
  postToolCall?: PostToolCall
  prepareStep?: PrepareStep
  preToolCall?: PreToolCall
  /** @default `maxSteps(10)` */
  stopWhen?: StopCondition
}

export const loop = (model: LanguageModel, { postToolCall, prepareStep, preToolCall, stopWhen: stopWhenOption, ...options }: LoopOptions): ReadableStream<TextEvent> => {
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
        const completed = await readStepEnd(eventStream, event => controller.enqueue(event))
        if (completed.status === 'failed') {
          controller.close()
          return
        }

        const step = toStepResult(completed)

        steps.push(step)
        input.push(step.message)

        const stop = stopWhen({
          input,
          step,
          steps,
        })

        if (stop || step.toolCalls.length === 0) {
          controller.close()
          return
        }

        options.signal?.throwIfAborted()

        const results = await executeTools({
          ...modelOptions,
          postToolCall,
          preToolCall,
          reason: step.reason,
          toolCalls: step.toolCalls,
        })

        step.toolResults.push(...results)
        input.push({ content: results, role: 'user' })
      }
    },
  })
}
