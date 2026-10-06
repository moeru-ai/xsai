import type { CollectResult, LanguageModel, LoopOptions, StepResult, TextEvent } from '@xsai/text-primitives'

import { loop } from '@xsai/text-primitives'
import { collectEvent, collectResult } from '@xsai/text-primitives/internal'

export interface StreamTextHandle {
  result: Promise<CollectResult>
  stream: ReadableStream<TextEvent>
}

export const streamText = (model: LanguageModel, options: LoopOptions): StreamTextHandle => {
  const result = Promise.withResolvers<CollectResult>()
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

  return { result: result.promise, stream }
}
