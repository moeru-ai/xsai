import type { AssistantMessage, AssistantMessageContent, FinishReason, PartAssembler, PartStartInit, ReasoningPart, ReasoningPartContent, TextPart, ToolCallPart, Usage } from '@xsai/text-primitives'

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

const normalizeTextPart = (item: Extract<Responses.ItemField, { type: 'message' }>): TextPart => ({
  text: (item.content as Array<Responses.OutputTextContent | Responses.RefusalContent | Responses.TextContent>)
    .map(part => part.type === 'refusal' ? part.refusal : part.text)
    .join(''),
  type: 'text',
})

const normalizeReasoningPart = (item: Extract<Responses.ItemField, { type: 'reasoning' }>): ReasoningPart => {
  const summary = item.summary as Responses.SummaryTextContent[]
  const reasoning = item.content as Responses.ReasoningTextContent[] | undefined
  const reasoningContent: ReasoningPartContent[] = [
    ...summary.map(part => ({ text: part.text, type: 'summary' as const })),
    ...reasoning?.map(part => ({ text: part.text, type: 'text' as const })) ?? [],
  ]

  if (item.encrypted_content !== undefined)
    reasoningContent.push({ text: item.encrypted_content, type: 'encrypted' })

  return { content: reasoningContent, id: item.id, type: 'reasoning' }
}

interface NormalizedOutputItem {
  messageId?: string
  part?: {
    content: () => AssistantMessageContent
    init?: PartStartInit
    type: AssistantMessageContent['type']
  }
}

const normalizeOutputItem = (item: Responses.ItemField): NormalizedOutputItem => {
  switch (item.type) {
    case 'compaction':
    case 'function_call_output':
      return {}
    case 'function_call':
      return {
        part: {
          content: () => normalizeToolCall(item),
          init: { callId: item.call_id, id: item.id, name: item.name },
          type: 'tool-call',
        },
      }
    case 'message':
      return { messageId: item.id, part: { content: () => normalizeTextPart(item), type: 'text' } }
    case 'reasoning':
      return { part: { content: () => normalizeReasoningPart(item), type: 'reasoning' } }
  }
}

const normalizeAssistantMessage = (output: Responses.ItemField[]): AssistantMessage => {
  const content: AssistantMessageContent[] = []
  let id: string | undefined

  for (const item of output) {
    const normalized = normalizeOutputItem(item)
    if (normalized.part !== undefined)
      content.push(normalized.part.content())
    if (normalized.messageId !== undefined)
      id = normalized.messageId
  }

  return {
    content,
    ...(id === undefined ? {} : { id }),
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

const finishResponse = (asm: PartAssembler, response: Responses.ResponseResource): void => {
  const reason = normalizeFinishReason(response)
  if (response.usage !== null)
    asm.meta({ usage: normalizeUsage(response.usage) })
  const error = reason === 'error'
    ? new XSAIError('model-error', response.error?.message ?? 'response failed', { cause: response.error })
    : undefined
  asm.finish(reason, {
    ...(error === undefined ? {} : { error }),
    message: normalizeAssistantMessage(response.output),
  })
}

const onItemAdded = (asm: PartAssembler, item: Responses.ItemField, index: number): void => {
  const normalized = normalizeOutputItem(item)
  if (normalized.part === undefined)
    return

  asm.start(index, normalized.part.type, normalized.part.init)
  if (normalized.messageId !== undefined)
    asm.meta({ messageId: normalized.messageId })
}

const onItemDone = (asm: PartAssembler, item: Responses.ItemField, index: number): void => {
  const part = normalizeOutputItem(item).part
  // `output_item.done` carries the authoritative item; it overrides
  // content accumulated from deltas.
  if (part !== undefined)
    asm.end(index, { content: part.content() })
}

/** Converts Responses API SSE data to text primitive events. */
export class ResponsesEventStream extends WireEventStream<ResponsesEvent> {
  constructor() {
    super((event, asm) => {
      // Response-scoped id and status; distinct from the output message id.
      if ('response' in event && event.response != null)
        asm.meta({ responseId: event.response.id, responseStatus: event.response.status })
      switch (event.type) {
        case 'error':
          asm.finish('error', {
            error: new XSAIError('model-error', event.error.message, { cause: event.error }),
          })
          break
        case 'response.completed':
        case 'response.failed':
        case 'response.incomplete':
          // The terminal event carries the authoritative output record; a bare
          // terminal event may arrive without any per-item events. The
          // response's own `status` decides the finish reason, not the tag.
          finishResponse(asm, event.response)
          break
        case 'response.content_part.added':
        case 'response.content_part.done':
        case 'response.created':
          break
        case 'response.function_call_arguments.delta':
        case 'response.output_text.delta':
        case 'response.reasoning.delta':
        case 'response.reasoning_summary_text.delta':
        case 'response.refusal.delta':
          asm.delta(event.output_index, event.delta)
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
            onItemAdded(asm, event.item, event.output_index)
          break
        case 'response.output_item.done':
          if (event.item != null)
            onItemDone(asm, event.item, event.output_index)
          break
      }
    })
  }
}
