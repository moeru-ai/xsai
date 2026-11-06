import type { StopCondition } from './stop-condition'
import type { LanguageModel, LanguageModelOptions, Message, StepResult, TextEvent } from './types'
import type { PrepareStep } from './types/prepare-step'
import type { PostToolCall, PreToolCall } from './utils/execute-tools'

import { maxSteps } from './stop-condition'
import { executeTools } from './utils/execute-tools'
import { readStep } from './utils/read-step'
import { toStepResult } from './utils/step-result'

export interface StreamTextOptions extends LanguageModelOptions {
  postToolCall?: PostToolCall
  prepareStep?: PrepareStep
  preToolCall?: PreToolCall
  /** @default `maxSteps(10)` */
  stopWhen?: StopCondition
}

export const streamText = (model: LanguageModel, { postToolCall, prepareStep, preToolCall, stopWhen: stopWhenOption, ...options }: StreamTextOptions): ReadableStream<TextEvent> => {
  const stopWhen = stopWhenOption ?? maxSteps(10)
  const input: Message[] = [...(Array.isArray(options.input) ? options.input : [{ content: options.input, role: 'user' } satisfies Message])]
  const steps: StepResult[] = []
  const controller = new AbortController()
  const signal = options.signal == null
    ? controller.signal
    : AbortSignal.any([options.signal, controller.signal])

  const generate = async function* (): AsyncGenerator<TextEvent, void> {
    while (true) {
      signal.throwIfAborted()
      const { model: preparedModel = model, ...preparedOptions } = await prepareStep?.({ input, signal, stepNumber: steps.length, steps }) ?? {}
      signal.throwIfAborted()
      const modelOptions: LanguageModelOptions = {
        ...options,
        ...preparedOptions,
        input: preparedOptions?.input ?? input,
        signal,
      }

      const stepEnd = yield* readStep(await preparedModel(modelOptions), signal)
      if (stepEnd.status === 'failed' || stepEnd.status === 'cancelled')
        return

      const step = toStepResult(stepEnd)
      steps.push(step)
      input.push(step.message)

      const stop = stopWhen({ input, step, steps })
      if (stop || (step.toolCalls.length === 0 && step.reason !== 'pause_turn'))
        return

      signal.throwIfAborted()
      if (step.toolCalls.length === 0)
        continue

      const results = await executeTools({
        ...modelOptions,
        postToolCall,
        preToolCall,
        reason: step.reason,
        toolCalls: step.toolCalls,
      })
      signal.throwIfAborted()

      step.toolResults.push(...results)
      input.push({ content: results, role: 'user' })
      for (const [index, content] of results.entries()) {
        yield { contentType: 'tool-result', index, type: 'content.start' }
        yield { content, index, type: 'content.end' }
      }
    }
  }

  const source = generate()
  return new ReadableStream<TextEvent>({
    cancel: async (reason) => {
      controller.abort(reason)
      await source.return(undefined)
    },
    pull: async (output) => {
      const next = await source.next()
      if (next.done)
        output.close()
      else
        output.enqueue(next.value)
    },
  }, { highWaterMark: 0 })
}
