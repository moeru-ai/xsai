import type { ErrorStreamingEvent, ResponseCompletedStreamingEvent, ResponseContentPartAddedStreamingEvent, ResponseContentPartDoneStreamingEvent, ResponseCreatedStreamingEvent, ResponseFailedStreamingEvent, ResponseFunctionCallArgumentsDeltaStreamingEvent, ResponseFunctionCallArgumentsDoneStreamingEvent, ResponseIncompleteStreamingEvent, ResponseInProgressStreamingEvent, ResponseOutputItemAddedStreamingEvent, ResponseOutputItemDoneStreamingEvent, ResponseOutputTextAnnotationAddedStreamingEvent, ResponseOutputTextDeltaStreamingEvent, ResponseOutputTextDoneStreamingEvent, ResponseQueuedStreamingEvent, ResponseReasoningDeltaStreamingEvent, ResponseReasoningDoneStreamingEvent, ResponseReasoningSummaryDeltaStreamingEvent, ResponseReasoningSummaryDoneStreamingEvent, ResponseReasoningSummaryPartAddedStreamingEvent, ResponseReasoningSummaryPartDoneStreamingEvent, ResponseRefusalDeltaStreamingEvent, ResponseRefusalDoneStreamingEvent } from '../generated'

export type StreamingEvent
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
    | ResponseRefusalDeltaStreamingEvent
    | ResponseRefusalDoneStreamingEvent
