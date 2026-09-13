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
  /** The typed error carried by an `error` finish, if any. */
  terminalError?: XSAIError
  usage?: Usage
}

/**
 * Folds an event stream into its accumulated {@link StreamResult}. Each
 * input event emits one snapshot, so downstream consumers can render the
 * in-progress message without implementing the event protocol.
 */
export class EventCollectStream extends TransformStream<Event, StreamResult> {
  constructor() {
    const accumulator = contentAccumulator()
    let error: ErrorEvent | undefined
    let messageId: string | undefined
    let reason: FinishReason | undefined
    let terminalError: undefined | XSAIError
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
        ...(terminalError === undefined ? {} : { terminalError }),
        ...(usage === undefined ? {} : { usage }),
      }
    }

    super({
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
            terminalError = event.error
            usage = event.usage
            break
        }

        controller.enqueue(snapshot())
      },
    })
  }
}

/**
 * Calls `model` and resolves with the finished result. Rejects when the
 * stream reports an error or ends without a `finish` event. The terminal
 * snapshot settles the call — the stream is cancelled without waiting for
 * it to close.
 */
export const collect = async (
  model: LanguageModel,
  context: LanguageModelContext,
  options?: LanguageModelOptions,
): Promise<CollectResult> => {
  const eventStream = await model(context, options)

  for await (const result of eventStream.pipeThrough(new EventCollectStream())) {
    if (result.reason === 'error')
      throw result.terminalError ?? new XSAIError('model-error', result.error?.message ?? 'model stream failed', { cause: result.error?.cause })
    if (result.reason !== undefined) {
      return {
        message: result.message,
        reason: result.reason,
        ...(result.usage === undefined ? {} : { usage: result.usage }),
      }
    }
  }

  throw new XSAIError('truncated-stream', 'model stream ended without a finish event')
}
