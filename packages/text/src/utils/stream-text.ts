import type { CollectResult, LanguageModel, LoopOptions, StepResult, TextEvent } from '@xsai/text-primitives'

import type { StreamTextEventMap } from './stream-events'

import { loop } from '@xsai/text-primitives'
import { collectEvent, collectResult } from '@xsai/text-primitives/internal'

import { TypedEventTarget } from './typed-event-target'

export interface StreamTextHandle {
  events: TypedEventTarget<StreamTextEventMap>
  result: Promise<StreamTextResult>
  stream: ReadableStream<TextEvent>
}

export type StreamTextOptions = LoopOptions
export type StreamTextResult = CollectResult

export const streamText = (model: LanguageModel, options: StreamTextOptions): StreamTextHandle => {
  const events = new TypedEventTarget<StreamTextEventMap>()
  const result = Promise.withResolvers<StreamTextResult>()
  void result.promise.catch(() => {})
  const steps: StepResult[] = []
  let sourceReader: ReadableStreamDefaultReader<TextEvent> | undefined
  let cancelled = false

  const stream = new ReadableStream<TextEvent>({
    cancel: async (reason) => {
      cancelled = true
      result.reject(reason === undefined ? new DOMException('The operation was aborted.', 'AbortError') : reason)
      await sourceReader?.cancel(reason)
    },
    start: (controller) => {
      const reader = loop(model, options).getReader()
      sourceReader = reader

      void (async () => {
        let failedError: unknown
        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done)
              break
            if (cancelled)
              return

            failedError ??= collectEvent(steps, value)
            const { type, ...detail } = value
            events.dispatchEvent(new CustomEvent(type, {
              detail: value.type === 'raw' ? value.detail : detail,
            }))
            controller.enqueue(value)
          }

          if (cancelled)
            return

          if (failedError != null) {
            result.reject(failedError)
            controller.close()
            return
          }

          result.resolve(collectResult(steps))
          controller.close()
        }
        catch (error) {
          if (cancelled)
            return

          result.reject(error)
          controller.error(error)
        }
        finally {
          sourceReader = undefined
          reader.releaseLock()
        }
      })()
    },
  })

  return { events, result: result.promise, stream }
}
