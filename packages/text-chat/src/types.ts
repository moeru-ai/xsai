// Chat Completions API wire types — only the fields this implementation uses.

export interface ChatChoice {
  delta: ChatDelta
  finish_reason: null | string
  index: number
}

export interface ChatChunk {
  choices?: ChatChoice[]
  error?: {
    message: string
    type?: string
  }
  id?: string
  usage?: ChatUsage
}

export type ChatContentPart
  = | { file: { file_data: string }, type: 'file' }
    | { image_url: { url: string }, type: 'image_url' }
    | { text: string, type: 'text' }

export interface ChatDelta {
  content?: null | string
  reasoning?: string
  reasoning_content?: string
  refusal?: string
  role?: string
  tool_calls?: ChatToolCallDelta[]
}

export interface ChatMessage {
  content?: ChatContentPart[] | null | string
  reasoning_content?: string
  refusal?: string
  role: 'assistant' | 'developer' | 'system' | 'tool' | 'user'
  tool_call_id?: string
  tool_calls?: ChatToolCall[]
}

export interface ChatTool {
  function: {
    description?: string
    name: string
    parameters: Record<string, unknown>
    strict?: boolean
  }
  type: 'function'
}

export interface ChatToolCall {
  function: {
    arguments: string
    name: string
  }
  id: string
  type: 'function'
}

export interface ChatToolCallDelta {
  function?: {
    arguments?: string
    name?: string
  }
  id?: string
  index: number
  type?: 'function'
}

export interface ChatUsage {
  completion_tokens?: number
  completion_tokens_details?: {
    reasoning_tokens?: number
  }
  prompt_tokens?: number
  prompt_tokens_details?: {
    cached_tokens?: number
  }
  total_tokens?: number
}
