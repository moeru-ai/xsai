import type { AssistantMessage, FinishReason, Message, ToolCall, Usage } from '@xsai/shared-chat'

// eslint-disable-next-line @masknet/string-no-data-url
export const chunkHeaderPrefix = 'data:'

export interface StreamTextChoice {
  finish_reason?: FinishReason | null
  index: number
  message: StreamTextMessage
}

export interface StreamTextChoiceState {
  calledToolCallIDs: Set<string>
  currentToolID: null | string
  endedToolCallIDs: Set<string>
  index: number
  toolCallErrors: { [id: string]: Error }
  toolCallResults: { [id: string]: string }
}

export interface StreamTextChunkResult {
  choices: {
    delta: {
      content?: string
      refusal?: string
      role: 'assistant'
      tool_calls?: ToolCall[]
    }
    finish_reason?: FinishReason
    index: number
  }[]
  created: number
  id: string
  model: string
  object: 'chat.completion.chunk'
  system_fingerprint: string
  usage?: Usage
}

export interface StreamTextMessage extends Omit<AssistantMessage, 'tool_calls'> {
  content?: string
  tool_calls?: { [id: string]: StreamTextToolCall }
}

export interface StreamTextStep {
  choices: StreamTextChoice[]
  messages: Message[]
  usage?: Usage
}

export interface StreamTextToolCall extends ToolCall {
  function: {
    arguments: string
    name: string
    parsed_arguments: Record<string, unknown>
  }
  id: string
  type: 'function'
}
