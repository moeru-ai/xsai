import type { ErrorEvent, Event } from './types/event'
import type { FinishReason } from './types/finish-reason'
import type { LanguageModel, LanguageModelContext, LanguageModelOptions } from './types/language-model'
import type { AssistantMessage } from './types/message'
import type { Usage } from './types/usage'

import { XSAIError } from '@xsai/shared'

import { contentAccumulator } from './content-accumulator'

/** The resolved value of {@link collect}: a finished {@link StreamResult}. */
export interface CollectResult {
  message: AssistantMessage
  reason: FinishReason
  usage?: Usage
}

/**
 * The accumulated result emitted for every incoming {@link Event}: the
 * assistant message as assembled so far — open parts carry their
 * partial content — plus terminal fields once the stream finishes.
 */
export interface StreamResult {
  /** The most recent `error` event, if any. */
  error?: ErrorEvent
  message: AssistantMessage
  reason?: FinishReason
  usage?: Usage
}

/**
 * Folds an event stream into its accumulated {@link StreamResult}. Each
 * input event emits one snapshot, so downstream consumers can render the
 * in-progress message without implementing the event protocol.
 */
export const eventCollectStream = (): TransformStream<Event, StreamResult> => {
  const accumulator = contentAccumulator()
  let error: ErrorEvent | undefined
  let messageId: string | undefined
  let reason: FinishReason | undefined
  let usage: undefined | Usage

  const snapshot = (): StreamResult => {
    return {
      ...(error === undefined ? {} : { error }),
      message: {
        content: accumulator.content(),
        ...(messageId === undefined ? {} : { id: messageId }),
        role: 'assistant',
      },
      ...(reason === undefined ? {} : { reason }),
      ...(usage === undefined ? {} : { usage }),
    }
  }

  return new TransformStream<Event, StreamResult>({
    transform: (event, controller) => {
      switch (event.type) {
        case 'content.end':
        case 'content.start':
        case 'reasoning.delta':
        case 'text.delta':
        case 'tool-call.delta':
          accumulator.apply(event)
          break
        case 'error':
          error = event
          break
        case 'finish':
          accumulator.replace(event.message.content)
          messageId = event.message.id
          reason = event.reason
          usage = event.usage
          break
      }

      controller.enqueue(snapshot())
    },
  })
}

/**
 * Calls `model` and resolves with the finished result. Rejects when the
 * stream reports an error or ends without a `finish` event.
 */
export const collect = async (
  model: LanguageModel,
  context: LanguageModelContext,
  options?: LanguageModelOptions,
): Promise<CollectResult> => {
  let last: StreamResult | undefined
  for await (const result of (await model(context, options)).pipeThrough(eventCollectStream()))
    last = result

  if (last?.reason === undefined)
    throw new XSAIError('truncated-stream', 'model stream ended without a finish event')
  if (last.reason === 'error')
    throw new XSAIError('model-error', last.error?.message ?? 'model stream failed', { cause: last.error?.cause })

  return {
    message: last.message,
    reason: last.reason,
    ...(last.usage === undefined ? {} : { usage: last.usage }),
  }
}
