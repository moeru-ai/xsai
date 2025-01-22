import type { AssistantMessage, AssistantMessagePart, Message, SystemMessage, SystemMessagePart, ToolCall, ToolMessage, ToolMessagePart, UserMessage, UserMessagePart } from '@xsai/shared-chat'
import type { ImagePart, TextPart } from '@xsai/shared-chat'

export const messages = (...messages: Message[]): Message[] => messages

export const system = <C extends string | SystemMessagePart[]>(content: C): SystemMessage => ({ content, role: 'system' })

export const user = <C extends Array<UserMessagePart> | string>(content: C): UserMessage => ({ content, role: 'user' })

export const textPart = (text: string): TextPart => ({ text, type: 'text' })

export const imagePart = (url: string): ImagePart => ({ image_url: { url }, type: 'image_url' })

export const assistant = <C extends AssistantMessagePart[] | string | ToolCall>(content: C): AssistantMessage =>
  (typeof content === 'string' || Array.isArray(content))
    ? { content, role: 'assistant' }
    : { role: 'assistant', tool_calls: [content] }

export const tool = <C extends string | ToolMessagePart[]>(content: C, toolCall: ToolCall): ToolMessage => ({
  content,
  role: 'tool',
  tool_call_id: toolCall.id,
})
