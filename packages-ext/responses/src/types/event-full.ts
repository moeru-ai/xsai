import type { ErrorStreamingEvent, ResponseCompletedStreamingEvent, ResponseContentPartAddedStreamingEvent, ResponseContentPartDoneStreamingEvent, ResponseCreatedStreamingEvent, ResponseFailedStreamingEvent, ResponseFunctionCallArgumentsDeltaStreamingEvent, ResponseFunctionCallArgumentsDoneStreamingEvent, ResponseIncompleteStreamingEvent, ResponseInProgressStreamingEvent, ResponseOutputItemAddedStreamingEvent, ResponseOutputItemDoneStreamingEvent, ResponseOutputTextAnnotationAddedStreamingEvent, ResponseOutputTextDeltaStreamingEvent, ResponseOutputTextDoneStreamingEvent, ResponseQueuedStreamingEvent, ResponseReasoningDeltaStreamingEvent, ResponseReasoningDoneStreamingEvent, ResponseReasoningSummaryDeltaStreamingEvent, ResponseReasoningSummaryDoneStreamingEvent, ResponseReasoningSummaryPartAddedStreamingEvent, ResponseReasoningSummaryPartDoneStreamingEvent, ResponseRefusalDeltaStreamingEvent, ResponseRefusalDoneStreamingEvent } from '../generated'

export type FullEvent
  = ErrorStreamingEvent
    | ResponseCompletedStreamingEvent
    | ResponseContentPartAddedStreamingEvent
    | ResponseContentPartDoneStreamingEvent
    | ResponseCreatedStreamingEvent
    | ResponseFailedStreamingEvent
    | ResponseFunctionCallArgumentsDeltaStreamingEvent
    | ResponseFunctionCallArgumentsDoneStreamingEvent
    | ResponseIncompleteStreamingEvent
    | ResponseInProgressStreamingEvent
    | ResponseOutputItemAddedStreamingEvent
    | ResponseOutputItemDoneStreamingEvent
    | ResponseOutputTextAnnotationAddedStreamingEvent
    | ResponseOutputTextDeltaStreamingEvent
    | ResponseOutputTextDoneStreamingEvent
    | ResponseQueuedStreamingEvent
    | ResponseReasoningDeltaStreamingEvent
    | ResponseReasoningDoneStreamingEvent
    | ResponseReasoningSummaryDeltaStreamingEvent
    | ResponseReasoningSummaryDoneStreamingEvent
    | ResponseReasoningSummaryPartAddedStreamingEvent
    | ResponseReasoningSummaryPartDoneStreamingEvent
    | ResponseReasoningTextDeltaStreamingEvent
    | ResponseReasoningTextDoneStreamingEvent
    | ResponseRefusalDeltaStreamingEvent
    | ResponseRefusalDoneStreamingEvent

export type FullEventType = FullEvent['type']

export interface ResponseReasoningTextDeltaStreamingEvent extends Omit<ResponseReasoningDeltaStreamingEvent, 'type'> {
  type: 'response.reasoning_text.delta'
}

export interface ResponseReasoningTextDoneStreamingEvent extends Omit<ResponseReasoningDoneStreamingEvent, 'type'> {
  type: 'response.reasoning_text.done'
}
