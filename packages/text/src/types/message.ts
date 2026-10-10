import type { FilePart, ImagePart, ProviderPart, ReasoningPart, RefusalPart, TextPart, ToolCallPart, ToolResultPart } from './content'
import type { MessageProviderMetadata } from './metadata'

export interface AssistantMessage {
  content: readonly AssistantMessageContent[] | string
  id?: string
  providerMetadata?: MessageProviderMetadata
  role: 'assistant'
}

export type AssistantMessageContent = ProviderPart | ReasoningPart | RefusalPart | TextPart | ToolCallPart

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
