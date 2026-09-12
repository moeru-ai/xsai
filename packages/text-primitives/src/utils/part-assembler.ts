import type {
  AssistantMessage,
  AssistantMessageContent,
  Event,
  FinishReason,
  PartMetadata,
  Usage,
} from '../core'

import { contentAccumulator } from '../core/content-accumulator'

export interface FinishMeta {
  messageId?: string
  usage?: Usage
}

/**
 * Internal seam between a wire adapter and the event protocol. The adapter
 * reports part-level facts (`start` / `delta` / `end` / `finish`); the
 * assembler owns index assignment, delta accumulation, tool-call identity
 * fallback, and the termination invariant: every stream ends with exactly
 * one `finish` event, emitted on `flush`.
 */
export interface PartAssembler {
  /** Appends text to a part. `text === ''` still absorbs tool-call identity extras without emitting. */
  delta: (key: PartKey, text: string, extra?: PartDeltaExtra) => void
  /** Closes a part and emits `content.end`. Unknown or closed keys are no-ops. */
  end: (key: PartKey, extra?: PartEndExtra) => void
  /** Emits an `error` event. Non-terminal; the stream still ends with `finish`. */
  error: (error: { cause?: unknown, message: string }) => void
  /**
   * Records the terminal reason and closes all open parts. The `finish`
   * event itself is emitted by `flush`, so late-arriving usage still lands.
   * Idempotent. `extra.message` overrides the assembled message for wires
   * whose terminal event carries an authoritative output record.
   */
  finish: (reason: FinishReason, extra?: { message?: AssistantMessage }) => void
  /** Emits the `finish` event if not already emitted, defaulting to `reason: 'error'` for truncated or empty streams. */
  flush: () => void
  /** Records message-level metadata (`messageId`, `usage`); last call wins. */
  meta: (meta: FinishMeta) => void
  /** Opens a part and emits `content.start`. Idempotent per key. */
  start: (key: PartKey, type: AssistantMessageContent['type'], init?: PartStartInit) => void
}

export interface PartDeltaExtra {
  callId?: string
  name?: string
}

export interface PartEndExtra {
  /**
   * Authoritative part content, e.g. a Responses `output_item.done` item.
   * Overrides the content accumulated from deltas.
   */
  content?: AssistantMessageContent
  /** Attached only to `reasoning` parts — the only part type with a metadata field. */
  metadata?: PartMetadata
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
}

// Gateways repeat id/name as '' or null on continuation deltas; only a
// non-empty string counts as identity.
const acceptIdentity = (current: string | undefined, incoming: string | undefined): string | undefined =>
  incoming != null && incoming !== '' ? incoming : current

/** @internal */
export const partAssembler = (emit: (event: Event) => void): PartAssembler => {
  const accumulator = contentAccumulator()
  const parts = new Map<PartKey, PartState>()
  let messageId: string | undefined
  let messageOverride: AssistantMessage | undefined
  let reason: FinishReason | undefined
  let usage: undefined | Usage
  let finishEmitted = false

  const end = (key: PartKey, extra?: PartEndExtra): void => {
    const state = parts.get(key)
    if (state === undefined || state.closed)
      return

    state.closed = true
    const accumulated = accumulator.at(state.index)
    if (accumulated === undefined)
      return

    const callId = state.callId ?? state.id ?? state.fallbackId ?? `call_${state.index}`
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
            ...(state.id === undefined ? {} : { id: state.id }),
          }
        : accumulated
    const authoritative = extra?.content ?? built
    const content = extra?.metadata !== undefined && authoritative.type === 'reasoning'
      ? { ...authoritative, metadata: extra.metadata }
      : authoritative
    const event = { content, index: state.index, type: 'content.end' } as const
    accumulator.apply(event)
    emit(event)
  }

  return {
    delta: (key, text, extra) => {
      const state = parts.get(key)
      if (state === undefined || state.closed || reason !== undefined)
        return

      switch (state.type) {
        case 'reasoning':
        case 'text':
          if (text !== '') {
            const event = state.type === 'reasoning'
              ? { delta: text, index: state.index, type: 'reasoning.delta' as const }
              : { delta: text, index: state.index, type: 'text.delta' as const }
            accumulator.apply(event)
            emit(event)
          }
          break
        case 'tool-call': {
          state.callId = acceptIdentity(state.callId, extra?.callId)
          state.name = acceptIdentity(state.name, extra?.name)
          const event = {
            delta: text,
            id: state.callId ?? state.id ?? state.fallbackId ?? `call_${state.index}`,
            index: state.index,
            ...(state.name === undefined ? {} : { name: state.name }),
            type: 'tool-call.delta' as const,
          }
          accumulator.apply(event)
          if (text !== '')
            emit(event)
          break
        }
      }
    },
    end,
    error: (error) => {
      emit({
        ...(error.cause === undefined ? {} : { cause: error.cause }),
        message: error.message,
        type: 'error',
      })
    },
    finish: (next, extra) => {
      if (reason !== undefined)
        return

      reason = next
      messageOverride = extra?.message
      for (const key of parts.keys())
        end(key)
    },
    flush: () => {
      if (finishEmitted)
        return

      finishEmitted = true
      // A wire stream that ends without a terminal signal is truncated, not
      // stopped cleanly.
      reason ??= 'error'
      for (const key of parts.keys())
        end(key)

      emit({
        message: messageOverride ?? {
          content: accumulator.content(),
          ...(messageId === undefined ? {} : { id: messageId }),
          role: 'assistant',
        },
        reason,
        type: 'finish',
        ...(usage === undefined ? {} : { usage }),
      })
    },
    meta: (meta) => {
      if (meta.messageId !== undefined)
        messageId = meta.messageId
      if (meta.usage !== undefined)
        usage = meta.usage
    },
    start: (key, type, init) => {
      if (parts.has(key) || reason !== undefined)
        return

      const index = parts.size
      parts.set(key, {
        closed: false,
        index,
        type,
        ...(init?.callId === undefined ? {} : { callId: init.callId }),
        ...(init?.fallbackId === undefined ? {} : { fallbackId: init.fallbackId }),
        ...(init?.id === undefined ? {} : { id: init.id }),
        ...(init?.name === undefined ? {} : { name: init.name }),
      })
      const event = { contentType: type, index, type: 'content.start' } as const
      accumulator.apply(event)
      emit(event)
    },
  }
}

/**
 * Parses SSE data frames into wire events, feeds them to `map`, and
 * guarantees the termination invariant through {@link partAssembler}.
 * @internal
 */
export const wireEventStream = <W>(map: (wire: W, asm: PartAssembler) => void): TransformStream<string, Event> => {
  let asm: PartAssembler | undefined

  return new TransformStream<string, Event>({
    flush: (controller) => {
      asm ??= partAssembler(event => controller.enqueue(event))
      asm.flush()
    },
    transform: (data, controller) => {
      asm ??= partAssembler(event => controller.enqueue(event))

      let wire: W
      try {
        wire = JSON.parse(data) as W
      }
      catch (cause) {
        asm.error({ cause, message: 'malformed event data' })
        return
      }

      map(wire, asm)
    },
  })
}
