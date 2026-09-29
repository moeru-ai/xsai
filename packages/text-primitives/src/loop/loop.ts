import type { LanguageModel, LanguageModelOptions, Message, StepEndEvent, StepResult, TextEvent } from '../core'
import type { PostToolCall, PreToolCall } from './execute-tools'
import type { StopCondition } from './stop-condition'
import type { PrepareStep } from './types/prepare-step'

import { XSAIError } from '@xsai/shared'

import { toStepResult } from '../core/step-result'
import { executeTools } from './execute-tools'
import { maxSteps } from './stop-condition'

export interface LoopOptions extends LanguageModelOptions {
  postToolCall?: PostToolCall
  prepareStep?: PrepareStep
  preToolCall?: PreToolCall
  /** @default `maxSteps(10)` */
  stopWhen?: StopCondition
}

const readStep = async function* (stream: ReadableStream<TextEvent>, signal: AbortSignal): AsyncGenerator<TextEvent, StepEndEvent> {
  let stepEnd: StepEndEvent | undefined
  for await (const event of stream.pipeThrough(new TransformStream<TextEvent, TextEvent>(), { signal })) {
    if (event.type === 'step.end') {
      if (stepEnd != null)
        throw new XSAIError('protocol-error', 'model stream produced more than one step.end event')
      stepEnd = event
    }
    yield event
  }
  signal.throwIfAborted()
  if (stepEnd == null)
    throw new XSAIError('truncated-stream', 'model stream ended without a step.end event')
  return stepEnd
}

export const loop = (model: LanguageModel, { postToolCall, prepareStep, preToolCall, stopWhen: stopWhenOption, ...options }: LoopOptions): ReadableStream<TextEvent> => {
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
      const preparedOptions = await prepareStep?.({ input, signal, stepNumber: steps.length, steps })
      signal.throwIfAborted()
      const modelOptions: LanguageModelOptions = {
        ...options,
        ...preparedOptions,
        input: preparedOptions?.input ?? input,
        signal,
      }

      const stepEnd = yield* readStep(await model(modelOptions), signal)
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
