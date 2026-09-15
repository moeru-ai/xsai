import type {
  AssistantMessage,
  AssistantMessageContent,
  Event,
  FinishReason,
  PartMetadata,
  Usage,
} from '../core'

import { XSAIError } from '@xsai/shared'

/**
 * Internal seam between a wire adapter and the event protocol. The adapter
 * reports part-level facts (`start` / `delta` / `end` / `finish`); the builder
 * owns the one copy of part state, index assignment, tool-call identity
 * fallback, and the termination invariant.
 */
export interface EventBuilder {
  /** Appends text to a part. `text === ''` still absorbs tool-call identity extras without emitting. */
  delta: (key: PartKey, text: string, extra?: PartDeltaExtra) => void
  /** Closes a part and emits `content.end`. Unknown or closed keys are no-ops. */
  end: (key: PartKey, extra?: PartEndExtra) => void
  /**
   * Records the terminal reason and closes all open parts. The `finish`
   * event itself is emitted by `flush`, so late-arriving usage still lands.
   * Idempotent. `extra.message` overrides the assembled message for wires
   * whose terminal event carries an authoritative output record.
   */
  finish: (reason: FinishReason, extra?: PartFinishExtra) => void
  /** Emits the `finish` event if not already emitted; fails the stream when the wire gave no terminal signal. */
  flush: () => void
  /** Records message- and response-level metadata; last call wins. */
  meta: (meta: FinishMeta) => void
  /** Opens a part and emits `content.start`. Idempotent per key. */
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
  /** The terminating error carried on the `finish` event, for `reason: 'error'`. */
  error?: XSAIError
  message?: AssistantMessage
}

/** Stable identity an adapter assigns to a part for the life of the stream. */
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
  type: AssistantMessageContent['type']
  value: AssistantMessageContent
}

const emptyContent = (type: AssistantMessageContent['type']): AssistantMessageContent => {
  switch (type) {
    case 'reasoning': return { content: [], type }
    case 'refusal': return { refusal: '', type }
    case 'text': return { text: '', type }
    case 'tool-call': return { arguments: '', callId: '', id: '', name: '', type }
  }
}

// Gateways repeat id/name as '' or null on continuation deltas; only a
// non-empty string counts as identity.
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

  const save = (state: PartState): void => {
    parts[state.index] = state.value
  }

  const updateReasoning = (state: PartState, text: string): void => {
    if (text === '')
      return

    const part = state.value
    if (part.type !== 'reasoning')
      return
    const content = part.content
    const last = content[content.length - 1]
    state.value = {
      ...part,
      content: last?.type === 'text'
        ? [...content.slice(0, -1), { text: last.text + text, type: 'text' }]
        : [...content, { text, type: 'text' }],
    }
    save(state)
    emit({ delta: text, index: state.index, type: 'reasoning.delta' })
  }

  const updateRefusal = (state: PartState, text: string): void => {
    if (text === '')
      return

    const part = state.value
    if (part.type !== 'refusal')
      return
    state.value = { ...part, refusal: part.refusal + text }
    save(state)
    emit({ delta: text, index: state.index, type: 'refusal.delta' })
  }

  const updateText = (state: PartState, text: string): void => {
    if (text === '')
      return

    const part = state.value
    if (part.type !== 'text')
      return
    state.value = { ...part, text: part.text + text }
    save(state)
    emit({ delta: text, index: state.index, type: 'text.delta' })
  }

  const updateToolCall = (state: PartState, text: string, extra?: PartDeltaExtra): void => {
    state.callId = acceptIdentity(state.callId, extra?.callId)
    state.name = acceptIdentity(state.name, extra?.name)
    const id = resolveCallId(state)
    const part = state.value
    if (part.type !== 'tool-call')
      return
    state.value = {
      ...part,
      arguments: part.arguments + text,
      callId: id,
      id,
      name: state.name ?? part.name,
    }
    save(state)
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

    switch (state.type) {
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
    const accumulated = state.value
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
    state.value = content
    save(state)
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
      // A wire stream that ends without a terminal signal is truncated, not
      // stopped cleanly — the stream fails instead of emitting a finish.
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
        // An authoritative override that drops the message id still keeps
        // the id observed during streaming.
        message: message.id == null && messageId != null
          ? { ...message, id: messageId }
          : message,
        reason,
        ...(responseId == null ? {} : { responseId }),
        ...(responseStatus == null ? {} : { responseStatus }),
        type: 'finish',
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
        type,
        value: emptyContent(type),
        ...(init?.callId == null ? {} : { callId: init.callId }),
        ...(init?.fallbackId == null ? {} : { fallbackId: init.fallbackId }),
        ...(init?.id == null ? {} : { id: init.id }),
        ...(init?.name == null ? {} : { name: init.name }),
      }
      states.set(key, state)
      parts.push(state.value)
      emit({ contentType: type, index, type: 'content.start' })
    },
  }
}

/**
 * Parses SSE data frames into wire events, feeds them to `map`, and
 * guarantees the termination invariant through {@link eventBuilder}.
 * Malformed frames and wires that end without a terminal signal error
 * the stream rather than producing a finish.
 * @internal
 */
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
