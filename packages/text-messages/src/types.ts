// Anthropic Messages API wire types — only the fields this implementation uses.

export type ContentBlock
  = | DocumentBlock
    | ImageBlock
    | RedactedThinkingBlock
    | TextBlock
    | ThinkingBlock
    | ToolResultBlock
    | ToolUseBlock

export interface ContentBlockDeltaEvent {
  delta: ContentDelta
  index: number
  type: 'content_block_delta'
}

export interface ContentBlockStartEvent {
  content_block: ContentBlock
  index: number
  type: 'content_block_start'
}

export interface ContentBlockStopEvent {
  index: number
  type: 'content_block_stop'
}

export type ContentDelta
  = | { partial_json: string, type: 'input_json_delta' }
    | { signature: string, type: 'signature_delta' }
    | { text: string, type: 'text_delta' }
    | { thinking: string, type: 'thinking_delta' }

export interface DocumentBlock {
  source: DocumentSource
  type: 'document'
}

export type DocumentSource
  = | { data: string, media_type: 'application/pdf', type: 'base64' }
    | { data: string, media_type: 'text/plain', type: 'text' }
    | { type: 'url', url: string }

export interface ImageBlock {
  source: ImageSource
  type: 'image'
}

export type ImageSource
  = | { data: string, media_type: string, type: 'base64' }
    | { type: 'url', url: string }

export interface InputMessage {
  content: ContentBlock[] | string
  role: 'assistant' | 'user'
}

export interface MessageDeltaEvent {
  delta: {
    stop_reason: null | string
    stop_sequence?: null | string
  }
  type: 'message_delta'
  usage?: MessagesUsage
}

export interface MessagesErrorEvent {
  error: {
    message: string
    type: string
  }
  type: 'error'
}

export type MessagesEvent
  = | ContentBlockDeltaEvent
    | ContentBlockStartEvent
    | ContentBlockStopEvent
    | MessageDeltaEvent
    | MessagesErrorEvent
    | MessageStartEvent
    | MessageStopEvent
    | PingEvent

export interface MessageStartEvent {
  message: {
    id: string
    usage: MessagesUsage
  }
  type: 'message_start'
}

export interface MessagesTool {
  description?: string
  input_schema: Record<string, unknown>
  name: string
}

export type MessagesToolChoice
  = | { name: string, type: 'tool' }
    | { type: 'any' | 'auto' | 'none' }

export interface MessageStopEvent {
  type: 'message_stop'
}

export interface MessagesUsage {
  cache_creation_input_tokens?: number
  cache_read_input_tokens?: number
  input_tokens?: number
  output_tokens?: number
  output_tokens_details?: {
    thinking_tokens?: number
  }
}

export interface PingEvent {
  type: 'ping'
}

export interface RedactedThinkingBlock {
  data: string
  type: 'redacted_thinking'
}

export interface TextBlock {
  text: string
  type: 'text'
}

export interface ThinkingBlock {
  signature?: string
  thinking: string
  type: 'thinking'
}

export interface ToolResultBlock {
  content: Array<ImageBlock | TextBlock> | string
  is_error?: boolean
  tool_use_id: string
  type: 'tool_result'
}

export interface ToolUseBlock {
  id: string
  input: unknown
  name: string
  type: 'tool_use'
}
