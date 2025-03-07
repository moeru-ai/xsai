import type { AssistantMessagePart, UserMessagePart } from 'xsai'

export type AssistantContent = Array<AssistantMessagePart> | string

export type UserContent = Array<UserMessagePart> | string

export type {
  AssistantMessage as CoreAssistantMessage,
  Message as CoreMessage,
  SystemMessage as CoreSystemMessage,
  ToolMessage as CoreToolMessage,
  UserMessage as CoreUserMessage,
} from 'xsai'

// TODO:
// ToolResultPart
// ToolInvocation
