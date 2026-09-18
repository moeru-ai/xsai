import type { AssistantMessage, AssistantMessageContent, EventBuilder, PartKey, PartStartInit, ReasoningPart, ReasoningPartContent, StopReason, StreamStatus, ToolCallPart, Usage } from '@xsai/text-primitives'

import type * as Responses from '../generated'

import { XSAIError } from '@xsai/shared'
import { WireEventStream } from '@xsai/text-primitives'

// The generated schema misses these official reasoning_text events.
type ReasoningTextDeltaEvent = Omit<Responses.ResponseReasoningDeltaStreamingEvent, 'type'> & {
  type: 'response.reasoning_text.delta'
}

type ReasoningTextDoneEvent = Omit<Responses.ResponseReasoningDoneStreamingEvent, 'type'> & {
  type: 'response.reasoning_text.done'
}

type ResponsesEvent
  = | ReasoningTextDeltaEvent
    | ReasoningTextDoneEvent
    | Responses.ErrorStreamingEvent
    | Responses.ResponseCompletedStreamingEvent
    | Responses.ResponseContentPartAddedStreamingEvent
    | Responses.ResponseContentPartDoneStreamingEvent
    | Responses.ResponseCreatedStreamingEvent
    | Responses.ResponseFailedStreamingEvent
    | Responses.ResponseFunctionCallArgumentsDeltaStreamingEvent
    | Responses.ResponseFunctionCallArgumentsDoneStreamingEvent
    | Responses.ResponseIncompleteStreamingEvent
    | Responses.ResponseInProgressStreamingEvent
    | Responses.ResponseOutputItemAddedStreamingEvent
    | Responses.ResponseOutputItemDoneStreamingEvent
    | Responses.ResponseOutputTextAnnotationAddedStreamingEvent
    | Responses.ResponseOutputTextDeltaStreamingEvent
    | Responses.ResponseOutputTextDoneStreamingEvent
    | Responses.ResponseQueuedStreamingEvent
    | Responses.ResponseReasoningDeltaStreamingEvent
    | Responses.ResponseReasoningDoneStreamingEvent
    | Responses.ResponseReasoningSummaryDeltaStreamingEvent
    | Responses.ResponseReasoningSummaryDoneStreamingEvent
    | Responses.ResponseReasoningSummaryPartAddedStreamingEvent
    | Responses.ResponseReasoningSummaryPartDoneStreamingEvent
    | Responses.ResponseRefusalDeltaStreamingEvent
    | Responses.ResponseRefusalDoneStreamingEvent

const normalizeUsage = (usage: Responses.Usage): Usage => ({
  cacheReadInputTokens: usage.input_tokens_details?.cached_tokens,
  inputTokens: usage.input_tokens,
  outputTokens: usage.output_tokens,
  reasoningTokens: usage.output_tokens_details?.reasoning_tokens,
  totalTokens: usage.total_tokens,
})

const normalizeToolCall = (item: Responses.FunctionCall): ToolCallPart => ({
  arguments: item.arguments,
  callId: item.call_id,
  id: item.id,
  name: item.name,
  type: 'tool-call',
})

type MessageContent = Extract<Responses.ItemField, { type: 'message' }>['content'][number]

// Keep message content parts distinct by content_index.
const contentPartKey = (outputIndex: number, contentIndex: number): PartKey => `${outputIndex}:${contentIndex}`

const normalizeContentPart = (part: MessageContent): AssistantMessageContent | undefined => {
  if (part.type === 'refusal')
    return { refusal: part.refusal, type: 'refusal' }
  if ('text' in part && typeof part.text === 'string')
    return { text: part.text, type: 'text' }
  return undefined
}

const normalizeMessageContent = (item: Extract<Responses.ItemField, { type: 'message' }>, index: number): NormalizedPart[] =>
  item.content.flatMap((part, contentIndex): NormalizedPart[] => {
    const content = normalizeContentPart(part)
    return content == null ? [] : [{ content, key: contentPartKey(index, contentIndex) }]
  })

const normalizeReasoningPart = (item: Extract<Responses.ItemField, { type: 'reasoning' }>): ReasoningPart => {
  // Added reasoning items may omit summary/content.
  const reasoningContent: ReasoningPartContent[] = [
    ...(item.summary ?? []).flatMap((part): ReasoningPartContent[] =>
      part.type === 'summary_text' ? [{ text: part.text, type: 'summary' }] : []),
    ...(item.content ?? []).flatMap((part): ReasoningPartContent[] =>
      part.type === 'reasoning_text' ? [{ text: part.text, type: 'text' }] : []),
  ]

  if (item.encrypted_content != null)
    reasoningContent.push({ text: item.encrypted_content, type: 'encrypted' })

  return { content: reasoningContent, id: item.id, type: 'reasoning' }
}

interface NormalizedOutputItem {
  messageId?: string
  parts?: NormalizedPart[]
}

interface NormalizedPart {
  content: AssistantMessageContent
  init?: PartStartInit
  key?: PartKey
}

const normalizeOutputItem = (item: Responses.ItemField, index: number): NormalizedOutputItem => {
  switch (item.type) {
    case 'compaction':
    case 'function_call_output':
      return {}
    case 'function_call':
      return {
        parts: [{
          content: normalizeToolCall(item),
          init: { callId: item.call_id, id: item.id, name: item.name },
        }],
      }
    case 'message':
      return { messageId: item.id, parts: normalizeMessageContent(item, index) }
    case 'reasoning':
      return { parts: [{ content: normalizeReasoningPart(item) }] }
  }
}

const normalizeAssistantMessage = (output: Responses.ItemField[]): AssistantMessage => {
  const content: AssistantMessageContent[] = []
  let id: string | undefined

  for (const [index, item] of output.entries()) {
    const normalized = normalizeOutputItem(item, index)
    for (const part of normalized.parts ?? [])
      content.push(part.content)
    if (normalized.messageId != null)
      id = normalized.messageId
  }

  return {
    content,
    ...(id == null ? {} : { id }),
    role: 'assistant',
  }
}

const normalizeFinishReason = (response: Responses.ResponseResource): StopReason | undefined => {
  if (response.status !== 'incomplete')
    return undefined

  const reason = response.incomplete_details?.reason
  switch (reason) {
    case 'content_filter':
      return 'content-filter'
    case 'max_output_tokens':
      return 'length'
    case null:
    case undefined:
      return undefined
    default:
      return reason
  }
}

const normalizeStatus = (response: Responses.ResponseResource): StreamStatus => {
  switch (response.status) {
    case 'cancelled':
      return 'cancelled'
    case 'completed':
      return 'completed'
    case 'failed':
      return 'failed'
    case 'incomplete':
      return 'incomplete'
    default:
      throw new Error(`unknown response status: ${response.status}`)
  }
}

const finishResponse = (builder: EventBuilder, response: Responses.ResponseResource): void => {
  const status = normalizeStatus(response)
  if (response.usage != null)
    builder.meta({ usage: normalizeUsage(response.usage) })
  const message = normalizeAssistantMessage(response.output)
  if (status === 'failed') {
    const error = new XSAIError('model-error', response.error?.message ?? 'response failed', {
      cause: response.error ?? undefined,
    })
    builder.finishFailure(error, message)
    return
  }

  const reason = normalizeFinishReason(response)
    ?? (status === 'completed' && typeof message.content !== 'string' && message.content.some(part => part.type === 'refusal') ? 'refusal' : undefined)
  builder.finish(status, reason, message)
}

const onItemAdded = (builder: EventBuilder, item: Responses.ItemField, index: number): void => {
  const normalized = normalizeOutputItem(item, index)
  for (const part of normalized.parts ?? [])
    builder.start(part.key ?? index, part.content.type, part.init)
  if (normalized.messageId != null)
    builder.meta({ messageId: normalized.messageId })
}

const onItemDone = (builder: EventBuilder, item: Responses.ItemField, index: number): void => {
  // The done item is authoritative, including parts without deltas.
  for (const part of normalizeOutputItem(item, index).parts ?? []) {
    const key = part.key ?? index
    builder.start(key, part.content.type, part.init)
    builder.end(key, { content: part.content })
  }
}

export class ResponsesEventStream extends WireEventStream<ResponsesEvent> {
  constructor() {
    super((event, builder) => {
      switch (event.type) {
        case 'error':
          builder.finishFailure(new XSAIError('model-error', event.error.message, {
            cause: event.error,
          }))
          break
        case 'response.completed':
        case 'response.failed':
        case 'response.incomplete':
          // The terminal response is authoritative and may arrive without item events.
          finishResponse(builder, event.response)
          break
        case 'response.content_part.added': {
          const content = normalizeContentPart(event.part)
          if (content != null)
            builder.start(contentPartKey(event.output_index, event.content_index), content.type)
          break
        }
        case 'response.content_part.done': {
          const content = normalizeContentPart(event.part)
          if (content != null) {
            const key = contentPartKey(event.output_index, event.content_index)
            builder.start(key, content.type)
            builder.end(key, { content })
          }
          break
        }
        case 'response.created':
          break
        case 'response.function_call_arguments.delta':
        case 'response.reasoning.delta':
        case 'response.reasoning_summary_text.delta':
          builder.delta(event.output_index, event.delta)
          break
        case 'response.function_call_arguments.done':
          break
        case 'response.in_progress':
        case 'response.output_text.annotation.added':
        case 'response.output_text.done':
        case 'response.queued':
        case 'response.reasoning.done':
        case 'response.reasoning_summary_part.added':
        case 'response.reasoning_summary_part.done':
        case 'response.reasoning_summary_text.done':
          break
        case 'response.output_item.added':
          if (event.item != null)
            onItemAdded(builder, event.item, event.output_index)
          break
        case 'response.output_item.done':
          if (event.item != null)
            onItemDone(builder, event.item, event.output_index)
          break
        case 'response.output_text.delta':
        case 'response.refusal.delta': {
          const key = contentPartKey(event.output_index, event.content_index)
          builder.start(key, event.type === 'response.refusal.delta' ? 'refusal' : 'text')
          builder.delta(key, event.delta)
          break
        }
        case 'response.reasoning_text.delta':
          builder.start(event.output_index, 'reasoning')
          builder.delta(event.output_index, event.delta)
          break
        case 'response.reasoning_text.done':
        case 'response.refusal.done':
          break
      }
    })
  }
}
