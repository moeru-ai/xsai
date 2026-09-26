import type { FilePart, ImagePart, ReasoningPart, RefusalPart, TextPart, ToolCallPart, ToolResultPart } from './content'
import type { ProviderMessageMetadata } from './metadata'

export interface AssistantMessage {
  content: readonly AssistantMessageContent[] | string
  id?: string
  providerMetadata?: ProviderMessageMetadata
  role: 'assistant'
}

export type AssistantMessageContent = ReasoningPart | RefusalPart | TextPart | ToolCallPart | ToolResultPart

export interface DeveloperMessage {
  content: readonly DeveloperMessageContent[] | string
  role: 'developer'
}

export type DeveloperMessageContent = TextPart

export type Message = MessageMap[MessageType]

export interface MessageMap {
  assistant: AssistantMessage
  developer: DeveloperMessage
  system: SystemMessage
  user: UserMessage
}

export type MessageType = keyof MessageMap

export interface SystemMessage {
  content: readonly SystemMessageContent[] | string
  role: 'system'
}

export type SystemMessageContent = TextPart

export interface UserMessage {
  content: readonly UserMessageContent[] | string
  role: 'user'
}

export type UserMessageContent = FilePart | ImagePart | TextPart | ToolResultPart
