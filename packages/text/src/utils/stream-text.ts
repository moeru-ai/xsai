import type {
  LanguageModel,
  LoopOptions,
  Message,
  StepResult,
  TextEvent,
  Usage,
} from '@xsai/text-primitives'

import type { StreamTextEventMap } from './stream-events'

import { loop, maxSteps } from '@xsai/text-primitives'
import { toStepResult } from '@xsai/text-primitives/internal'

import { toStreamTextEvent } from './stream-events'
import { TypedEventTarget } from './typed-event-target'

export interface StreamTextHandle {
  cancel: (reason?: unknown) => void
  events: TypedEventTarget<StreamTextEventMap>
  result: Promise<StreamTextResult>
  stream: ReadableStream<TextEvent>
}

export type StreamTextOptions = LoopOptions

export interface StreamTextResult extends StepResult {
  input: readonly Message[]
  steps: readonly StepResult[]
  totalUsage?: Usage
}

const recordStep = (event: TextEvent, steps: StepResult[]): unknown => {
  if (event.type !== 'step.end')
    return
  if (event.status === 'failed')
    return event.error

  steps.push(toStepResult(event))
}

const totalUsage = (steps: readonly StepResult[]): undefined | Usage => {
  const usages = steps.flatMap(step => step.usage == null ? [] : [step.usage])
  if (usages.length === 0)
    return undefined

  const sum = (key: keyof Usage): number | undefined => {
    const values = usages.map(usage => usage[key]).filter((value): value is number => value != null)
    return values.length === 0 ? undefined : values.reduce((total, value) => total + value, 0)
  }
  const cacheCreationInputTokens = sum('cacheCreationInputTokens')
  const cacheReadInputTokens = sum('cacheReadInputTokens')
  const reasoningTokens = sum('reasoningTokens')

  return {
    inputTokens: sum('inputTokens') ?? 0,
    outputTokens: sum('outputTokens') ?? 0,
    totalTokens: sum('totalTokens') ?? 0,
    ...(cacheCreationInputTokens == null ? {} : { cacheCreationInputTokens }),
    ...(cacheReadInputTokens == null ? {} : { cacheReadInputTokens }),
    ...(reasoningTokens == null ? {} : { reasoningTokens }),
  }
}

export const streamText = (model: LanguageModel, options: StreamTextOptions): StreamTextHandle => {
  const events = new TypedEventTarget<StreamTextEventMap>()
  const internalController = new AbortController()
  const signal = options.signal == null
    ? internalController.signal
    : AbortSignal.any([options.signal, internalController.signal])
  const result = Promise.withResolvers<StreamTextResult>()
  const steps: StepResult[] = []

  let failedError: unknown
  let finished = false
  let latestInput: Message[] | string | undefined
  let outputController: ReadableStreamDefaultController<TextEvent> | undefined
  let cancelled = false

  const prepareStep: NonNullable<LoopOptions['prepareStep']> = async (prepareOptions) => {
    const previousStep = prepareOptions.steps.at(-1)
    const step = steps.at(-1)
    if (step != null && previousStep != null)
      step.toolResults = previousStep.toolResults

    return options.prepareStep?.(prepareOptions)
  }

  const cancel = (reason?: unknown, outputWasCancelled = false): void => {
    if (finished || cancelled)
      return

    cancelled = true
    if (!internalController.signal.aborted)
      internalController.abort(reason)

    const actualReason = signal.reason as unknown
    result.reject(actualReason)
    if (!outputWasCancelled)
      outputController?.error(actualReason)
  }

  const onAbort = (): void => cancel(signal.reason as unknown)
  signal.addEventListener('abort', onAbort, { once: true })
  if (signal.aborted)
    cancel(signal.reason as unknown)

  const observedModel: LanguageModel = async (modelOptions) => {
    const input = typeof modelOptions.input === 'string' ? modelOptions.input : [...modelOptions.input]
    latestInput = input

    return model(modelOptions)
  }

  const loopOptions: LoopOptions = {
    ...options,
    prepareStep,
    signal,
    stopWhen: options.stopWhen ?? maxSteps(1),
  }

  const stream = new ReadableStream<TextEvent>({
    cancel: reason => cancel(reason, true),
    start: (controller) => {
      outputController = controller
      if (cancelled) {
        controller.close()
        finished = true
        signal.removeEventListener('abort', onAbort)
        return
      }
      const source = loop(observedModel, loopOptions)

      void (async () => {
        try {
          for await (const event of source) {
            if (cancelled)
              break

            failedError ??= recordStep(event, steps)

            const streamEvent = toStreamTextEvent(event)
            if (streamEvent != null)
              events.dispatchEvent(streamEvent)
            controller.enqueue(event)
          }

          if (cancelled)
            return

          if (signal.aborted) {
            cancel(signal.reason as unknown)
            return
          }

          if (failedError != null) {
            result.reject(failedError)
            controller.close()
            return
          }

          const finalStep = steps.at(-1)
          if (finalStep == null)
            throw new Error('streamText completed without a step result')

          const input = latestInput ?? options.input
          result.resolve({
            ...finalStep,
            input: typeof input === 'string'
              ? [{ content: input, role: 'user' } satisfies Message, finalStep.message]
              : [...input, finalStep.message],
            steps,
            totalUsage: totalUsage(steps),
          })
          controller.close()
        }
        catch (error) {
          if (cancelled)
            return

          const reason = signal.aborted ? signal.reason as unknown : error
          result.reject(reason)
          controller.error(reason)
        }
        finally {
          finished = true
          signal.removeEventListener('abort', onAbort)
        }
      })()
    },
  })

  return {
    cancel: reason => cancel(reason),
    events,
    result: result.promise,
    stream,
  }
}
