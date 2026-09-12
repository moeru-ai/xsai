import type { AssistantMessage, AssistantMessageContent, FinishReason, PartAssembler, ReasoningPart, ReasoningPartContent, TextPart, ToolCallPart, Usage } from '@xsai/text-primitives'

import type * as Responses from '../generated'

import { wireEventStream } from '@xsai/text-primitives'

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

const onItemAdded = (asm: PartAssembler, item: Responses.ItemField, index: number): void => {
  switch (item.type) {
    case 'compaction':
    case 'function_call_output':
      break
    case 'function_call':
      asm.start(index, 'tool-call', { callId: item.call_id, id: item.id, name: item.name })
      break
    case 'message':
      asm.start(index, 'text')
      asm.meta({ messageId: item.id })
      break
    case 'reasoning':
      asm.start(index, 'reasoning')
      break
  }
}

const onItemDone = (asm: PartAssembler, item: Responses.ItemField, index: number): void => {
  switch (item.type) {
    case 'compaction':
    case 'function_call_output':
      break
    // `output_item.done` carries the authoritative item; it overrides
    // content accumulated from deltas.
    case 'function_call':
      asm.end(index, { content: normalizeToolCall(item) })
      break
    case 'message':
      asm.end(index, { content: normalizeTextPart(item) })
      break
    case 'reasoning':
      asm.end(index, { content: normalizeReasoningPart(item) })
      break
  }
}

/** Converts Responses API SSE data to text primitive events. */
export const responsesEventStream = () =>
  wireEventStream<ResponsesEvent>((event, asm) => {
    switch (event.type) {
      case 'error':
        asm.error({ cause: event.error, message: event.error.message })
        break
      case 'response.completed':
      case 'response.failed':
      case 'response.incomplete':
        if (event.response.usage !== null)
          asm.meta({ usage: normalizeUsage(event.response.usage) })
        // The terminal event carries the authoritative output record; a bare
        // `response.completed` may arrive without any per-item events.
        asm.finish(normalizeFinishReason(event.response), { message: normalizeAssistantMessage(event.response.output) })
        break
      case 'response.content_part.added':
      case 'response.content_part.done':
      case 'response.created':
      case 'response.function_call_arguments.done':
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
      case 'response.function_call_arguments.delta':
      case 'response.output_text.delta':
      case 'response.reasoning.delta':
      case 'response.reasoning_summary_text.delta':
      case 'response.refusal.delta':
        asm.delta(event.output_index, event.delta)
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
