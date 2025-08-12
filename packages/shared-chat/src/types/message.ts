import type { CommonContentPart, RefusalContentPart, TextContentPart } from './message-content'
import type { ToolCall } from './tool-call'

export interface AssistantMessage {
  content?: (RefusalContentPart | TextContentPart)[] | string
  name?: string
  refusal?: string
  role: 'assistant'
  tool_calls?: ToolCall[]
}

export interface DeveloperMessage {
  content: string | TextContentPart[]
  name?: string
  /** @remarks Before using, confirm that your model supports this. */
  role: 'developer'
}

export type Message = AssistantMessage | DeveloperMessage | SystemMessage | ToolMessage | UserMessage

export interface SystemMessage {
  content: string | TextContentPart[]
  name?: string
  role: 'system'
}

export interface ToolMessage {
  /** @remarks considering the support of ecosystems (such as MCP), we have relaxed this type. */
  content: CommonContentPart[] | string
  role: 'tool'
  tool_call_id: string
}

export interface UserMessage {
  content: CommonContentPart[] | string
  name?: string
  role: 'user'
}
