import type { ErrorEvent, Event } from './types/event'
import type { FinishReason } from './types/finish-reason'
import type { LanguageModel, LanguageModelContext, LanguageModelOptions } from './types/language-model'
import type { AssistantMessage, AssistantMessageContent } from './types/message'
import type { Usage } from './types/usage'

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
  const parts: (AssistantMessageContent | undefined)[] = []
  const open = new Map<number, AssistantMessageContent>()
  let error: ErrorEvent | undefined
  let messageId: string | undefined
  let reason: FinishReason | undefined
  let usage: undefined | Usage

  const snapshot = (): StreamResult => {
    const content: AssistantMessageContent[] = []
    for (let index = 0; index < parts.length; index++) {
      const part = parts[index] ?? open.get(index)
      if (part !== undefined)
        content.push(part)
    }
    for (const [index, part] of open) {
      if (index >= parts.length)
        content.push(part)
    }

    return {
      ...(error === undefined ? {} : { error }),
      message: {
        content,
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
          open.delete(event.index)
          parts[event.index] = event.content
          break
        case 'content.start':
          switch (event.contentType) {
            case 'reasoning':
              open.set(event.index, { content: [], type: 'reasoning' })
              break
            case 'text':
              open.set(event.index, { text: '', type: 'text' })
              break
            case 'tool-call':
              open.set(event.index, { arguments: '', callId: '', id: '', name: '', type: 'tool-call' })
              break
          }
          break
        case 'error':
          error = event
          break
        case 'finish':
          open.clear()
          parts.length = 0
          parts.push(...typeof event.message.content === 'string'
            ? [{ text: event.message.content, type: 'text' as const }]
            : event.message.content)
          messageId = event.message.id
          reason = event.reason
          usage = event.usage
          break
        case 'reasoning.delta': {
          const part = open.get(event.index)
          if (part?.type === 'reasoning') {
            const content = part.content
            const last = content[content.length - 1]
            open.set(event.index, {
              ...part,
              content: last?.type === 'text'
                ? [...content.slice(0, -1), { text: last.text + event.delta, type: 'text' }]
                : [...content, { text: event.delta, type: 'text' }],
            })
          }
          break
        }
        case 'text.delta': {
          const part = open.get(event.index)
          if (part?.type === 'text')
            open.set(event.index, { ...part, text: part.text + event.delta })
          break
        }
        case 'tool-call.delta': {
          const part = open.get(event.index)
          if (part?.type === 'tool-call') {
            open.set(event.index, {
              ...part,
              arguments: part.arguments + event.delta,
              callId: event.id,
              id: event.id,
              name: event.name ?? part.name,
            })
          }
          break
        }
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
    throw new Error('model stream ended without a finish event')
  if (last.reason === 'error')
    throw new Error(last.error?.message ?? 'model stream failed', { cause: last.error?.cause })

  return {
    message: last.message,
    reason: last.reason,
    ...(last.usage === undefined ? {} : { usage: last.usage }),
  }
}
