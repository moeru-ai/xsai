import type { StepEndEvent, TextEvent } from '../types'

import { XSAIError } from '@xsai/shared'

/**
 * Reads a model stream until it ends or `signal` aborts. Unlike `for await` on the stream itself,
 * an abort ends a pending read even if the model ignores its signal, and the model sees the reason.
 * Not covered by semver.
 *
 * @internal
 */
export const readEvents = async function* (stream: ReadableStream<TextEvent>, signal: AbortSignal): AsyncGenerator<TextEvent, void> {
  const reader = stream.getReader()
  let cancellation: Promise<void> | undefined
  const abort = (): void => {
    cancellation = reader.cancel(signal.reason)
    void cancellation.catch(() => {})
  }
  signal.addEventListener('abort', abort, { once: true })
  try {
    signal.throwIfAborted()
    while (true) {
      const { done, value } = await reader.read()
      signal.throwIfAborted()
      if (done)
        return
      yield value
    }
  }
  finally {
    signal.removeEventListener('abort', abort)
    await (cancellation ?? reader.cancel(signal.reason)).finally(() => reader.releaseLock())
  }
}

/**
 * Reads one model step and checks that it has exactly one `step.end`.
 * Not covered by semver.
 *
 * @internal
 */
export const readStep = async function* (stream: ReadableStream<TextEvent>, signal: AbortSignal): AsyncGenerator<TextEvent, StepEndEvent> {
  let stepEnd: StepEndEvent | undefined
  for await (const event of readEvents(stream, signal)) {
    if (event.type === 'step.end') {
      if (stepEnd != null)
        throw new XSAIError('protocol-error', 'model stream produced more than one step.end event')
      stepEnd = event
    }
    yield event
  }
  if (stepEnd == null)
    throw new XSAIError('truncated-stream', 'model stream ended without a step.end event')
  return stepEnd
}
