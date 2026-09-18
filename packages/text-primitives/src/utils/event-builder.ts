import type {
  AssistantMessage,
  AssistantMessageContent,
  Event,
  FinishReason,
  PartMetadata,
  Usage,
} from '../core'

import { XSAIError } from '@xsai/shared'

/** Internal adapter/event protocol boundary. */
export interface EventBuilder {
  /** Appends text or tool-call identity to a part. */
  delta: (key: PartKey, text: string, extra?: PartDeltaExtra) => void
  /** Closes a part and emits `content.end`. */
  end: (key: PartKey, extra?: PartEndExtra) => void
  /** Records the terminal reason and closes open parts. */
  finish: (reason: FinishReason, extra?: PartFinishExtra) => void
  /** Emits `stream.end` or fails for an incomplete wire stream. */
  flush: () => void
  /** Records message and response metadata. */
  meta: (meta: FinishMeta) => void
  /** Opens a part and emits `content.start`. */
  start: (key: PartKey, type: AssistantMessageContent['type'], init?: PartStartInit) => void
}

export interface FinishMeta {
  messageId?: string
  responseId?: string
  responseStatus?: string
  usage?: Usage
}

export interface PartDeltaExtra {
  callId?: string
  name?: string
}

export interface PartEndExtra {
  /** Authoritative part content, e.g. a Responses `output_item.done` item. */
  content?: AssistantMessageContent
  /** Attached only to `reasoning` parts — the only part type with a metadata field. */
  metadata?: PartMetadata
}

export interface PartFinishExtra {
  /** The terminating error carried on the `stream.end` event, for `reason: 'error'`. */
  error?: XSAIError
  message?: AssistantMessage
}

/** Adapter-assigned identity for a part. */
export type PartKey = number | string

export interface PartStartInit {
  callId?: string
  /** Used when the wire never sends a call id, e.g. `call_${index}`. */
  fallbackId?: string
  id?: string
  name?: string
}

interface PartState {
  callId?: string
  closed: boolean
  fallbackId?: string
  id?: string
  index: number
  name?: string
}

const emptyContent = (type: AssistantMessageContent['type']): AssistantMessageContent => {
  switch (type) {
    case 'reasoning': return { content: [], type }
    case 'refusal': return { refusal: '', type }
    case 'text': return { text: '', type }
    case 'tool-call': return { arguments: '', callId: '', id: '', name: '', type }
  }
}

// Ignore empty identity values from continuation deltas.
const acceptIdentity = (current: string | undefined, incoming: string | undefined): string | undefined =>
  incoming != null && incoming !== '' ? incoming : current

const resolveCallId = (state: PartState): string =>
  state.callId ?? state.id ?? state.fallbackId ?? `call_${state.index}`

/** @internal */
export const eventBuilder = (emit: (event: Event) => void, fail: (error: XSAIError) => void): EventBuilder => {
  const parts: AssistantMessageContent[] = []
  const states = new Map<PartKey, PartState>()
  let finishEmitted = false
  let messageId: string | undefined
  let messageOverride: AssistantMessage | undefined
  let reason: FinishReason | undefined
  let responseId: string | undefined
  let responseStatus: string | undefined
  let terminalError: undefined | XSAIError
  let usage: undefined | Usage

  const updateReasoning = (state: PartState, text: string): void => {
    if (text === '')
      return

    const part = parts[state.index]
    if (part.type !== 'reasoning')
      return
    const content = part.content
    const last = content[content.length - 1]
    parts[state.index] = {
      ...part,
      content: last?.type === 'text'
        ? [...content.slice(0, -1), { text: last.text + text, type: 'text' }]
        : [...content, { text, type: 'text' }],
    }
    emit({ delta: text, index: state.index, type: 'reasoning.delta' })
  }

  const updateRefusal = (state: PartState, text: string): void => {
    if (text === '')
      return

    const part = parts[state.index]
    if (part.type !== 'refusal')
      return
    parts[state.index] = { ...part, refusal: part.refusal + text }
    emit({ delta: text, index: state.index, type: 'refusal.delta' })
  }

  const updateText = (state: PartState, text: string): void => {
    if (text === '')
      return

    const part = parts[state.index]
    if (part.type !== 'text')
      return
    parts[state.index] = { ...part, text: part.text + text }
    emit({ delta: text, index: state.index, type: 'text.delta' })
  }

  const updateToolCall = (state: PartState, text: string, extra?: PartDeltaExtra): void => {
    state.callId = acceptIdentity(state.callId, extra?.callId)
    state.name = acceptIdentity(state.name, extra?.name)
    const id = resolveCallId(state)
    const part = parts[state.index]
    if (part.type !== 'tool-call')
      return
    parts[state.index] = {
      ...part,
      arguments: part.arguments + text,
      callId: id,
      id,
      name: state.name ?? part.name,
    }
    const event = {
      delta: text,
      id,
      index: state.index,
      ...(state.name == null ? {} : { name: state.name }),
      type: 'tool-call.delta' as const,
    }
    if (text !== '')
      emit(event)
  }

  const delta = (key: PartKey, text: string, extra?: PartDeltaExtra): void => {
    const state = states.get(key)
    if (state === undefined || state.closed || reason !== undefined)
      return

    switch (parts[state.index].type) {
      case 'reasoning':
        updateReasoning(state, text)
        break
      case 'refusal':
        updateRefusal(state, text)
        break
      case 'text':
        updateText(state, text)
        break
      case 'tool-call':
        updateToolCall(state, text, extra)
        break
    }
  }

  const end = (key: PartKey, extra?: PartEndExtra): void => {
    const state = states.get(key)
    if (state === undefined || state.closed)
      return

    state.closed = true
    const accumulated = parts[state.index]
    const callId = resolveCallId(state)
    const built: AssistantMessageContent = accumulated.type === 'tool-call'
      ? {
          ...accumulated,
          callId,
          id: state.id ?? callId,
          name: state.name ?? '',
        }
      : accumulated.type === 'reasoning'
        ? {
            ...accumulated,
            ...(accumulated.content.length === 0
              ? { content: [{ text: '', type: 'text' as const }] }
              : {}),
            ...(state.id == null ? {} : { id: state.id }),
          }
        : accumulated
    const authoritative = extra?.content ?? built
    const content = extra?.metadata != null && authoritative.type === 'reasoning'
      ? { ...authoritative, metadata: extra.metadata }
      : authoritative
    parts[state.index] = content
    emit({ content, index: state.index, type: 'content.end' })
  }

  return {
    delta,
    end,
    finish: (next, extra) => {
      if (reason !== undefined)
        return

      reason = next
      messageOverride = extra?.message
      terminalError = extra?.error
      for (const key of states.keys())
        end(key)
    },
    flush: () => {
      if (finishEmitted)
        return

      finishEmitted = true
      // Fail if the wire ended without a terminal signal.
      if (reason === undefined) {
        fail(new XSAIError('truncated-stream', 'wire stream ended without a terminal signal'))
        return
      }

      const message = messageOverride ?? {
        content: parts,
        role: 'assistant' as const,
      }
      emit({
        ...(terminalError == null ? {} : { error: terminalError }),
        // Keep the streamed id when the override omits it.
        message: message.id == null && messageId != null
          ? { ...message, id: messageId }
          : message,
        reason,
        ...(responseId == null ? {} : { responseId }),
        ...(responseStatus == null ? {} : { responseStatus }),
        type: 'stream.end',
        ...(usage == null ? {} : { usage }),
      })
    },
    meta: (meta) => {
      if (meta.messageId != null)
        messageId = meta.messageId
      if (meta.responseId != null)
        responseId = meta.responseId
      if (meta.responseStatus != null)
        responseStatus = meta.responseStatus
      if (meta.usage != null)
        usage = meta.usage
    },
    start: (key, type, init) => {
      if (states.has(key) || reason !== undefined)
        return

      const index = states.size
      const state: PartState = {
        closed: false,
        index,
        ...(init?.callId == null ? {} : { callId: init.callId }),
        ...(init?.fallbackId == null ? {} : { fallbackId: init.fallbackId }),
        ...(init?.id == null ? {} : { id: init.id }),
        ...(init?.name == null ? {} : { name: init.name }),
      }
      states.set(key, state)
      parts.push(emptyContent(type))
      emit({ contentType: type, index, type: 'content.start' })
    },
  }
}

/** Parses wire events and enforces stream termination. @internal */
export class WireEventStream<W> extends TransformStream<string, Event> {
  constructor(map: (wire: W, builder: EventBuilder) => void) {
    let builder!: EventBuilder
    super({
      flush: () => {
        builder.flush()
      },
      start: (controller) => {
        builder = eventBuilder(
          event => controller.enqueue(event),
          error => controller.error(error),
        )
        controller.enqueue({ type: 'stream.start' })
      },
      transform: (data, controller) => {
        let wire: W
        try {
          wire = JSON.parse(data) as W
        }
        catch (cause) {
          controller.error(new XSAIError('invalid-response', 'malformed event data', { cause }))
          return
        }

        map(wire, builder)
      },
    })
  }
}
