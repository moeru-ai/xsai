import type {
  AssistantMessage,
  AssistantMessageContent,
  FinishReason,
  ProviderPartMetadata,
  StepStatus,
  TextEvent,
  Usage,
} from '../core'

import { XSAIError } from '@xsai/shared'

/** Internal adapter/event protocol boundary. */
export interface EventBuilder {
  /** Appends text or tool-call identity to a part. */
  delta: (key: PartKey, text: string, extra?: PartDeltaExtra) => void
  /** Records a non-failed terminal status and closes open parts. */
  done: (status: Exclude<StepStatus, 'failed'>, reason?: FinishReason, message?: AssistantMessage) => void
  /** Closes a part and emits `content.end`. */
  end: (key: PartKey, extra?: PartEndExtra) => void
  /** Records a provider-declared failure and closes open parts. */
  fail: (error: XSAIError, message?: AssistantMessage) => void
  /** Emits `step.end` or fails for an incomplete wire stream. */
  flush: () => void
  /** Records message identity and usage metadata. */
  meta: (meta: FinishMeta) => void
  /** Opens a part and emits `content.start`. */
  start: (key: PartKey, type: AssistantMessageContent['type'], init?: PartStartInit) => void
}

export interface FinishMeta {
  messageId?: string
  usage?: Usage
}

export interface PartDeltaExtra {
  callId?: string
  name?: string
}

export interface PartEndExtra {
  /** Authoritative part content, e.g. a Responses `output_item.done` item. */
  content?: AssistantMessageContent
  /** Attached to reasoning or text parts. */
  providerMetadata?: ProviderPartMetadata
}

/** Adapter-assigned identity for a part. */
export type PartKey = number | string

export interface PartStartInit {
  callId?: string
  /** Used when the wire never sends a call id, e.g. `call_${index}`. */
  fallbackId?: string
  /** Wire-level part identity, distinct from the tool call id when both exist. */
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
  resolvedCallId?: string
}

type TerminalState
  = | {
    error: XSAIError
    message?: AssistantMessage
    status: 'failed'
  }
  | {
    message?: AssistantMessage
    reason?: FinishReason
    status: Exclude<StepStatus, 'failed'>
  }

const emptyContent = (type: AssistantMessageContent['type']): AssistantMessageContent => {
  switch (type) {
    case 'reasoning': return { content: [], type }
    case 'refusal': return { refusal: '', type }
    case 'text': return { text: '', type }
    case 'tool-call': return { arguments: '', callId: '', id: '', name: '', type }
    case 'tool-result': return { callId: '', output: '', type }
  }
}

// Ignore empty identity values from continuation deltas.
const acceptIdentity = (current: string | undefined, incoming: string | undefined): string | undefined =>
  incoming != null && incoming !== '' ? incoming : current

const resolveCallId = (state: PartState): string => {
  if (state.resolvedCallId != null)
    return state.resolvedCallId

  state.resolvedCallId = acceptIdentity(state.fallbackId, state.callId) ?? `call_${state.index}`
  return state.resolvedCallId
}

/** @internal */
export const eventBuilder = (emit: (event: TextEvent) => void, fail: (error: XSAIError) => void): EventBuilder => {
  const parts: AssistantMessageContent[] = []
  const states = new Map<PartKey, PartState>()
  let terminalEmitted = false
  let messageId: string | undefined
  let terminal: TerminalState | undefined
  let usage: undefined | Usage

  const updateReasoning = (state: PartState, text: string): void => {
    if (text === '')
      return

    const part = parts[state.index]
    if (part.type !== 'reasoning')
      return
    const content = part.content
    const last = content.at(-1)
    parts[state.index] = {
      ...part,
      content: last?.type === 'text'
        ? content.with(-1, { text: last.text + text, type: 'text' })
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

    if (text === '')
      return

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
      callId: id,
      delta: text,
      index: state.index,
      name: state.name,
      type: 'tool-call.delta' as const,
    }
    emit(event)
  }

  const delta = (key: PartKey, text: string, extra?: PartDeltaExtra): void => {
    const state = states.get(key)
    if (state === undefined || state.closed || terminal !== undefined)
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
      case 'tool-result':
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
            content: accumulated.content.length === 0
              ? [{ text: '', type: 'text' as const }]
              : accumulated.content,
            id: state.id,
          }
        : accumulated
    const authoritative = extra?.content ?? built
    const content = extra?.providerMetadata != null && (authoritative.type === 'reasoning' || authoritative.type === 'text')
      ? { ...authoritative, providerMetadata: extra.providerMetadata }
      : authoritative
    parts[state.index] = content
    emit({ content, index: state.index, type: 'content.end' })
  }

  const emitTerminal = (): void => {
    if (terminalEmitted || terminal === undefined)
      return

    terminalEmitted = true
    const message = terminal.message ?? {
      content: parts,
      role: 'assistant' as const,
    }
    const common = {
      // Keep the streamed id when the override omits it.
      message: message.id == null && messageId != null
        ? { ...message, id: messageId }
        : message,
      type: 'step.end' as const,
      usage,
    }
    if (terminal.status === 'failed') {
      emit({ ...common, error: terminal.error, status: terminal.status })
      return
    }

    emit({
      ...common,
      reason: terminal.reason,
      status: terminal.status,
    })
  }

  return {
    delta,
    done: (status, reason, message) => {
      if (terminal !== undefined)
        return

      const messageContent = message?.content ?? parts
      const hasToolCall = typeof messageContent !== 'string' && messageContent.some(part => part.type === 'tool-call')
      const reconciledReason = status === 'completed' && (reason == null || reason === 'stop') && hasToolCall
        ? 'tool-calls'
        : reason
      terminal = { message, reason: reconciledReason, status }
      for (const key of states.keys())
        end(key)
    },
    end,
    fail: (error, message) => {
      if (terminal !== undefined)
        return

      terminal = { error, message, status: 'failed' }
      for (const key of states.keys())
        end(key)
      emitTerminal()
    },
    flush: () => {
      if (terminalEmitted)
        return

      // Fail if the wire ended without a terminal signal.
      if (terminal === undefined) {
        terminalEmitted = true
        fail(new XSAIError('truncated-stream', 'wire stream ended without a terminal signal'))
        return
      }

      emitTerminal()
    },
    meta: (meta) => {
      if (meta.messageId != null)
        messageId = meta.messageId
      if (meta.usage != null)
        usage = meta.usage
    },
    start: (key, type, init) => {
      if (states.has(key) || terminal !== undefined)
        return

      const index = states.size
      const state: PartState = {
        callId: init?.callId,
        closed: false,
        fallbackId: init?.fallbackId,
        id: init?.id,
        index,
        name: init?.name,
      }
      states.set(key, state)
      parts.push(emptyContent(type))
      emit({ contentType: type, index, type: 'content.start' })
    },
  }
}

/** Parses wire events and enforces stream termination. @internal */
export class WireEventStream<W> extends TransformStream<string, TextEvent> {
  constructor(map: (wire: W, builder: EventBuilder) => void, includeRawEvents = false) {
    let builder!: EventBuilder
    super({
      flush: () => {
        builder.flush()
      },
      start: (controller) => {
        builder = eventBuilder(
          (event) => {
            controller.enqueue(event)
            if (event.type === 'step.end' && event.status === 'failed')
              controller.terminate()
          },
          error => controller.error(error),
        )
        controller.enqueue({ type: 'step.start' })
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

        try {
          if (includeRawEvents)
            controller.enqueue({ detail: wire, type: 'raw' })
          map(wire, builder)
        }
        catch (cause) {
          controller.error(new XSAIError('protocol-error', 'failed to normalize wire event', { cause }))
        }
      },
    })
  }
}
