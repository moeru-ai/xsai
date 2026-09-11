import type { AssistantMessage, Event, Usage } from '@xsai/text-primitives'

import type * as Responses from '../generated'

import { DONE } from '@xsai/text-primitives'

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
  inputTokens: usage.input_tokens,
  outputTokens: usage.output_tokens,
  totalTokens: usage.total_tokens,
})

const normalizeTextStartEvent = (text: string, index: number): Event => ({
  content: { text, type: 'text' },
  index,
  type: 'content.start',
})

const normalizeTextEndEvent = (index: number): Event => ({
  contentType: 'text',
  index,
  type: 'content.end',
})

const normalizeReasoningDeltaEvent = (delta: string, index: number): Event => ({
  delta,
  index,
  type: 'reasoning.delta',
})

const normalizeAssistantMessage = (output: Responses.ResponseResource['output']): AssistantMessage => {
  const message = output.find(item => item.type === 'message' && item.role === 'assistant')
  const text = output
    .filter(item => item.type === 'message')
    .flatMap(item => item.content)
    .filter(part => part.type === 'output_text' || part.type === 'text' || part.type === 'refusal')
    .map(part => part.type === 'refusal' ? part.refusal : part.text)
    .join('')

  return {
    content: text,
    ...(message == null || message.id == null ? {} : { id: message.id }),
    role: 'assistant',
  }
}

const normalizeFinishEvent = (event: Responses.ResponseCompletedStreamingEvent | Responses.ResponseFailedStreamingEvent | Responses.ResponseIncompleteStreamingEvent): Event => ({
  ...(event.response.error == null && event.response.incomplete_details == null
    ? {}
    : { reason: event.response.incomplete_details?.reason ?? event.response.error?.code }),
  message: normalizeAssistantMessage(event.response.output),
  ...(event.response.usage == null ? {} : { usage: normalizeUsage(event.response.usage) }),
  type: 'finish',
})

const mapEvent = (event: ResponsesEvent, toolNames: Map<string, string>): Event | undefined => {
  switch (event.type) {
    case 'error':
      throw new Error(event.error.message)
    case 'response.completed':
    case 'response.failed':
    case 'response.incomplete':
      return normalizeFinishEvent(event)
    case 'response.content_part.added':
      switch (event.part.type) {
        case 'input_file':
          return undefined
        case 'input_image':
          return undefined
        case 'input_text':
          return undefined
        case 'output_text':
          return normalizeTextStartEvent(event.part.text, event.output_index)
        case 'reasoning_text':
          return undefined
        case 'refusal':
          return normalizeTextStartEvent(event.part.refusal, event.output_index)
        case 'summary_text':
          return undefined
        case 'text':
          return normalizeTextStartEvent(event.part.text, event.output_index)
      }
      return undefined
    case 'response.content_part.done':
      switch (event.part.type) {
        case 'input_file':
          return undefined
        case 'input_image':
          return undefined
        case 'input_text':
          return undefined
        case 'output_text':
          return normalizeTextEndEvent(event.output_index)
        case 'reasoning_text':
          return undefined
        case 'refusal':
          return normalizeTextEndEvent(event.output_index)
        case 'summary_text':
          return undefined
        case 'text':
          return normalizeTextEndEvent(event.output_index)
      }
      return undefined
    case 'response.created':
      return undefined
    case 'response.function_call_arguments.delta': {
      const name = toolNames.get(event.item_id)

      return {
        ...(name == null ? {} : { name }),
        delta: event.delta,
        id: event.item_id,
        index: event.output_index,
        type: 'tool-call.delta',
      }
    }
    case 'response.function_call_arguments.done':
      return undefined
    case 'response.in_progress':
      return undefined
    case 'response.output_item.added':
      if (event.item?.type === 'function_call') {
        toolNames.set(event.item.id, event.item.name)

        return {
          content: {
            arguments: event.item.arguments,
            callId: event.item.call_id,
            id: event.item.id,
            name: event.item.name,
            type: 'tool-call',
          },
          index: event.output_index,
          type: 'content.start',
        }
      }

      if (event.item?.type === 'reasoning') {
        return {
          content: {
            content: [],
            id: event.item.id,
            type: 'reasoning',
          },
          index: event.output_index,
          type: 'content.start',
        }
      }

      return undefined
    case 'response.output_item.done':
      if (event.item?.type === 'function_call') {
        return {
          contentType: 'tool-call',
          index: event.output_index,
          type: 'content.end',
        }
      }

      if (event.item?.type === 'reasoning') {
        return {
          contentType: 'reasoning',
          index: event.output_index,
          type: 'content.end',
        }
      }

      return undefined
    case 'response.output_text.annotation.added':
      return undefined
    case 'response.output_text.delta':
    case 'response.refusal.delta':
      return {
        delta: event.delta,
        index: event.output_index,
        type: 'text.delta',
      }
    case 'response.output_text.done':
      return undefined
    case 'response.queued':
      return undefined
    case 'response.reasoning.delta':
      return normalizeReasoningDeltaEvent(event.delta, event.output_index)
    case 'response.reasoning.done':
      return undefined
    case 'response.reasoning_summary_part.added':
      return undefined
    case 'response.reasoning_summary_part.done':
      return undefined
    case 'response.reasoning_summary_text.delta':
      return normalizeReasoningDeltaEvent(event.delta, event.output_index)
    case 'response.reasoning_summary_text.done':
      return undefined
    case 'response.refusal.done':
      return undefined
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

        if (event != null) {
          controller.enqueue(event)
        }
      },
    })
  }
}
