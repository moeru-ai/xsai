import type { AssistantMessage, AssistantMessagePart, Message, SystemMessage, SystemMessagePart, ToolCall, ToolMessage, ToolMessagePart, UserMessage, UserMessagePart } from '../types/message'
import type { ImagePart, TextPart } from '../types/message-part'

export function messages(...messages: Message[]): Message[] {
  return messages
}

export function system<C extends string | SystemMessagePart[]>(content: C): SystemMessage {
  return { content, role: 'system' }
}

export function user<C extends Array<UserMessagePart> | string>(content: C): UserMessage {
  return { content, role: 'user' }
}

export function textPart(text: string): TextPart {
  return { text, type: 'text' }
}

export function imagePart(url: string): ImagePart {
  return { image_url: { url }, type: 'image_url' }
}

export function assistant<C extends AssistantMessagePart[] | string | ToolCall>(content: C): AssistantMessage {
  if (typeof content === 'string')
    return { content, role: 'assistant' }
  if (Array.isArray(content))
    return { content, role: 'assistant' }

  return { role: 'assistant', tool_calls: [content] }
}

export function tool<C extends string | ToolMessagePart[]>(content: C, toolCall: ToolCall): ToolMessage {
  return {
    content,
    role: 'tool',
    tool_call_id: toolCall.id,
  }
}
