import type { AssistantMessage, Message, SystemMessage, ToolCall, ToolMessage, UserMessage } from '../types/message'
import type { AudioPart, ImagePart, TextPart } from '../types/message-part'

export function messages(...messages: Message[]): Message[] {
  return messages
}

export function system(content: string): SystemMessage {
  return { content, role: 'system' }
}

export function user<C extends Array<AudioPart | ImagePart | TextPart> | string>(content: C): UserMessage {
  return { content, role: 'user' }
}

export function textPart(text: string): TextPart {
  return { text, type: 'text' }
}

export function imagePart(url: string): ImagePart {
  return { image_url: { url }, type: 'image_url' }
}

export function assistant<C extends string | ToolCall>(content: C): AssistantMessage {
  if (typeof content === 'string')
    return { content, role: 'assistant' }

  return { role: 'assistant', tool_calls: [content] }
}

export function tool(content: string, toolCall: ToolCall): ToolMessage {
  return {
    content,
    role: 'tool',
    tool_call_id: toolCall.id,
  }
}
