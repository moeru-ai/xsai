import type { AudioBase64, ImageURLorBase64, Message, ToolCall, ToolMessagePart } from '@xsai/shared-chat'

export type UIMessage = Message & {
  id: string
  parts: UIMessagePart[]
}

export interface UIMessageAudioPart {
  audio: AudioBase64
  type: 'audio'
}

export interface UIMessageImagePart {
  type: 'image'
  url: ImageURLorBase64
}

export type UIMessagePart =
  | UIMessageAudioPart
  | UIMessageImagePart
  | UIMessageReasoningPart
  | UIMessageRefusalPart
  | UIMessageTextPart
  | UIMessageToolCallPart

export interface UIMessageReasoningPart {
  reasoning: string
  type: 'reasoning'
}

export interface UIMessageRefusalPart {
  refusal: string
  type: 'refusal'
}

export interface UIMessageTextPart {
  text: string
  type: 'text'
}

export interface UIMessageToolCallPart {
  /**
   * The status of the tool call
   * - `complete` - the tool call has finished
   * - `error` - the tool call has errored
   * - `loading` - the tool call is loading
   * - `partial` - the tool call has partially loaded
   *
   * partial -> loading -> complete
   *         -> loading -> error
   *         -> error
   */
  status: 'complete' | 'error' | 'loading' | 'partial'
  toolCall: ToolCall
  type: 'tool-call'
  result?: string | ToolMessagePart[]
  error?: unknown
}
