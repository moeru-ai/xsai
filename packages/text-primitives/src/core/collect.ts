import type { Event, FinishEvent } from './types/event'
import type { FinishReason } from './types/finish-reason'
import type { LanguageModel, LanguageModelOptions } from './types/language-model'
import type { AssistantMessage } from './types/message'
import type { Usage } from './types/usage'

import { XSAIError } from '@xsai/shared'

import { contentAccumulator } from './content-accumulator'

/** The resolved value of {@link collect}: the `finish` event's payload — the terminal error is thrown instead of carried. */
export type CollectResult = Omit<FinishEvent, 'error' | 'type'>

/**
 * The accumulated result emitted for every incoming {@link Event}: the
 * assistant message as assembled so far — open parts carry their
 * partial content — plus terminal fields once the stream finishes.
 */
export interface StreamResult {
  message: AssistantMessage
  reason?: FinishReason
  /** The response-scoped id carried by the `finish` event, if any. */
  responseId?: string
  /** The wire-native response status carried by the `finish` event, if any. */
  responseStatus?: string
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
  private readonly accumulator = contentAccumulator()
  private messageId?: string
  private reason?: FinishReason
  private responseId?: string
  private responseStatus?: string
  private terminalError?: XSAIError
  private usage?: Usage

  constructor() {
    super({
      transform: (event, controller) => {
        switch (event.type) {
          case 'content.end':
          case 'content.start':
          case 'reasoning.delta':
          case 'refusal.delta':
          case 'text.delta':
          case 'tool-call.delta':
            this.accumulator.apply(event)
            break
          case 'finish':
            this.accumulator.replace(event.message.content)
            this.messageId = event.message.id
            this.reason = event.reason
            this.responseId = event.responseId
            this.responseStatus = event.responseStatus
            this.terminalError = event.error
            this.usage = event.usage
            break
        }

        controller.enqueue(this.snapshot())
      },
    })
  }

  private snapshot(): StreamResult {
    return {
      message: {
        content: this.accumulator.content(),
        ...(this.messageId == null ? {} : { id: this.messageId }),
        role: 'assistant',
      },
      ...(this.reason == null ? {} : { reason: this.reason }),
      ...(this.responseId == null ? {} : { responseId: this.responseId }),
      ...(this.responseStatus == null ? {} : { responseStatus: this.responseStatus }),
      ...(this.terminalError == null ? {} : { terminalError: this.terminalError }),
      ...(this.usage == null ? {} : { usage: this.usage }),
    }
  }
}

/**
 * Calls `model` and resolves with the `finish` event's payload. Rejects
 * when the stream reports an error or ends without a `finish` event. The
 * finish event settles the call — the stream is cancelled without waiting
 * for it to close.
 */
export const collect = async (
  model: LanguageModel,
  options: LanguageModelOptions,
): Promise<CollectResult> => {
  const eventStream = await model(options)

  for await (const event of eventStream) {
    if (event.type !== 'finish')
      continue

    if (event.reason === 'error')
      throw event.error ?? new XSAIError('model-error', 'model stream failed')

    return {
      message: event.message,
      reason: event.reason,
      ...(event.responseId == null ? {} : { responseId: event.responseId }),
      ...(event.responseStatus == null ? {} : { responseStatus: event.responseStatus }),
      ...(event.usage == null ? {} : { usage: event.usage }),
    }
  }

  throw new XSAIError('truncated-stream', 'model stream ended without a finish event')
}
