import type { AssistantMessage, AssistantMessageContent, Event, FinishReason, ReasoningPart, ReasoningPartContent, TextPart, ToolCallPart, Usage } from '@xsai/text-primitives'

import type * as Responses from '../generated'

import { DONE, reconcileFinishReason } from '@xsai/text-primitives'

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

const normalizeAssistantMessage = (output: Responses.ItemField[]): AssistantMessage => {
  const content: AssistantMessageContent[] = []
  let id: string | undefined

  for (const item of output) {
    switch (item.type) {
      case 'compaction':
      case 'function_call_output':
        break
      case 'function_call':
        content.push(normalizeToolCall(item))
        break
      case 'message':
        id = item.id
        content.push(normalizeTextPart(item))
        break
      case 'reasoning':
        content.push(normalizeReasoningPart(item))
        break
    }
  }

  return {
    content,
    ...(id === undefined ? {} : { id }),
    role: 'assistant',
  }
}

const normalizeFinishReason = (response: Responses.ResponseResource): FinishReason => {
  const rawReason = response.incomplete_details?.reason ?? response.error?.code

  switch (rawReason) {
    case 'content_filter':
      return 'content-filter'
    case 'max_output_tokens':
      return 'max-output-tokens'
    case undefined:
      return 'stop'
    default:
      return rawReason
  }
}

const normalizeFinishEvent = (
  event: Responses.ResponseCompletedStreamingEvent | Responses.ResponseFailedStreamingEvent | Responses.ResponseIncompleteStreamingEvent,
): Event => {
  const message = normalizeAssistantMessage(event.response.output)
  const reason = normalizeFinishReason(event.response)
  return {
    message,
    reason: Array.isArray(message.content) ? reconcileFinishReason(message.content, reason) : reason,
    ...(event.response.usage === null ? {} : { usage: normalizeUsage(event.response.usage) }),
    type: 'finish',
  }
}

const normalizeContentStartEvent = (item: Responses.ItemField, index: number, toolNames: Map<string, string>): Event | undefined => {
  switch (item.type) {
    case 'compaction':
    case 'function_call_output':
      return undefined
    case 'function_call':
      toolNames.set(item.id, item.name)
      return { contentType: 'tool-call', index, type: 'content.start' }
    case 'message':
      return { contentType: 'text', index, type: 'content.start' }
    case 'reasoning':
      return { contentType: 'reasoning', index, type: 'content.start' }
  }
}

const normalizeContentEndEvent = (item: Responses.ItemField, index: number): Event | undefined => {
  switch (item.type) {
    case 'compaction':
    case 'function_call_output':
      return undefined
    case 'function_call':
      return { content: normalizeToolCall(item), index, type: 'content.end' }
    case 'message':
      return { content: normalizeTextPart(item), index, type: 'content.end' }
    case 'reasoning':
      return { content: normalizeReasoningPart(item), index, type: 'content.end' }
  }
}

const mapEvent = (event: ResponsesEvent, toolNames: Map<string, string>): Event | undefined => {
  switch (event.type) {
    case 'error':
      return { cause: event.error, message: event.error.message, type: 'error' }
    case 'response.completed':
      return normalizeFinishEvent(event)
    case 'response.content_part.added':
    case 'response.content_part.done':
    case 'response.created':
      return undefined
    case 'response.failed':
      return normalizeFinishEvent(event)
    case 'response.function_call_arguments.delta':
      return {
        delta: event.delta,
        id: event.item_id,
        index: event.output_index,
        name: toolNames.get(event.item_id)!,
        type: 'tool-call.delta',
      }
    case 'response.function_call_arguments.done':
    case 'response.in_progress':
      return undefined
    case 'response.incomplete':
      return normalizeFinishEvent(event)
    case 'response.output_item.added':
      return normalizeContentStartEvent(event.item!, event.output_index, toolNames)
    case 'response.output_item.done':
      return normalizeContentEndEvent(event.item!, event.output_index)
    case 'response.output_text.annotation.added':
      return undefined
    case 'response.output_text.delta':
      return { delta: event.delta, index: event.output_index, type: 'text.delta' }
    case 'response.output_text.done':
    case 'response.queued':
      return undefined
    case 'response.reasoning.delta':
      return { delta: event.delta, index: event.output_index, type: 'reasoning.delta' }
    case 'response.reasoning.done':
    case 'response.reasoning_summary_part.added':
    case 'response.reasoning_summary_part.done':
      return undefined
    case 'response.reasoning_summary_text.delta':
      return { delta: event.delta, index: event.output_index, type: 'reasoning.delta' }
    case 'response.reasoning_summary_text.done':
    case 'response.refusal.done':
      return undefined
    case 'response.refusal.delta':
      return { delta: event.delta, index: event.output_index, type: 'text.delta' }
  }
}

/** Converts Responses API SSE data to text primitive events. */
export class ResponsesEventStream extends TransformStream<string, Event> {
  constructor() {
    const toolNames = new Map<string, string>()

    super({
      transform: (data, controller) => {
        if (data === DONE) {
          controller.terminate()
          return
        }

        const event = mapEvent(JSON.parse(data) as ResponsesEvent, toolNames)

        if (event !== undefined)
          controller.enqueue(event)
      },
    })
  }
}
