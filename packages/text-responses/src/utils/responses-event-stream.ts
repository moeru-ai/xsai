import type { AssistantMessage, AssistantMessageContent, EventBuilder, FinishReason, PartKey, PartStartInit, ReasoningPart, ReasoningPartContent, ToolCallPart, Usage } from '@xsai/text-primitives'

import type * as Responses from '../generated'

import { XSAIError } from '@xsai/shared'
import { WireEventStream } from '@xsai/text-primitives'

type ResponsesEvent
  = | Responses.ErrorStreamingEvent
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

// A message item's content entries are separate parts, keyed by their
// `content_index` — output text stays text, refusal stays refusal.
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
  // Added-time items may omit `summary`/`content`; only the summary_text
  // and reasoning_text members carry normalized content.
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

const normalizeFinishReason = (response: Responses.ResponseResource): FinishReason => {
  // The terminal `status` is authoritative; `incomplete_details` only
  // refines it. Unmodelled statuses pass through rather than collapsing
  // to `stop`.
  switch (response.status) {
    case 'completed':
      return 'stop'
    case 'failed':
      return 'error'
    case 'incomplete': {
      const reason = response.incomplete_details?.reason
      switch (reason) {
        case 'content_filter':
          return 'content-filter'
        case 'max_output_tokens':
          return 'max-output-tokens'
        case null:
        case undefined:
          return 'incomplete'
        default:
          return reason
      }
    }
    default:
      return response.status ?? 'other'
  }
}

const finishResponse = (builder: EventBuilder, response: Responses.ResponseResource): void => {
  const reason = normalizeFinishReason(response)
  if (response.usage != null)
    builder.meta({ usage: normalizeUsage(response.usage) })
  const error = reason === 'error'
    ? new XSAIError('model-error', response.error?.message ?? 'response failed', { cause: response.error })
    : undefined
  builder.finish(reason, {
    ...(error == null ? {} : { error }),
    message: normalizeAssistantMessage(response.output),
  })
}

const onItemAdded = (builder: EventBuilder, item: Responses.ItemField, index: number): void => {
  const normalized = normalizeOutputItem(item, index)
  for (const part of normalized.parts ?? [])
    builder.start(part.key ?? index, part.content.type, part.init)
  if (normalized.messageId != null)
    builder.meta({ messageId: normalized.messageId })
}

const onItemDone = (builder: EventBuilder, item: Responses.ItemField, index: number): void => {
  // `output_item.done` carries the authoritative item; it overrides
  // content accumulated from deltas, including content parts that never
  // streamed a delta.
  for (const part of normalizeOutputItem(item, index).parts ?? []) {
    const key = part.key ?? index
    builder.start(key, part.content.type, part.init)
    builder.end(key, { content: part.content })
  }
}

export class ResponsesEventStream extends WireEventStream<ResponsesEvent> {
  constructor() {
    super((event, builder) => {
      // Response-scoped id and status; distinct from the output message id.
      if ('response' in event && event.response != null)
        builder.meta({ responseId: event.response.id, responseStatus: event.response.status })
      switch (event.type) {
        case 'error':
          builder.finish('error', {
            error: new XSAIError('model-error', event.error.message, { cause: event.error }),
          })
          break
        case 'response.completed':
        case 'response.failed':
        case 'response.incomplete':
          // The terminal event carries the authoritative output record; a bare
          // terminal event may arrive without any per-item events. The
          // response's own `status` decides the finish reason, not the tag.
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
        case 'response.refusal.done':
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
      }
    })
  }
}
