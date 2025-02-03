import type { AssistantMessage, AssistantMessagePart, ImagePart, Message, SystemMessage, SystemMessagePart, TextPart, ToolCall, ToolMessage, ToolMessagePart, UserMessage, UserMessagePart } from '@xsai/shared-chat'

export const messages = (...messages: Message[]): Message[] => messages

export const system = <C extends string | SystemMessagePart[]>(content: C): SystemMessage => ({ content, role: 'system' })

export const user = <C extends Array<UserMessagePart> | string>(content: C): UserMessage => ({ content, role: 'user' })

export const textPart = (text: string): TextPart => ({ text, type: 'text' })

export const imagePart = (url: string): ImagePart => ({ image_url: { url }, type: 'image_url' })

export const isToolCall = (content: AssistantMessagePart[] | string | ToolCall | ToolCall[]): content is ToolCall | ToolCall[] => {
  const isElementToolCallLike = (c: AssistantMessagePart | AssistantMessagePart[] | string | ToolCall | ToolCall[]) => {
    return (typeof c === 'object'
      && (
        ('type' in c && c.type === 'function')
        && 'id' in c
        && 'function' in c && typeof c.function === 'object')
    )
  }

  return isElementToolCallLike(content)
    || (Array.isArray(content) && content.every(part => isElementToolCallLike(part)))
}

export const assistant = <C extends AssistantMessagePart[] | string | ToolCall | ToolCall[]>(content: C): AssistantMessage => {
  if (isToolCall(content)) {
    return Array.isArray(content)
      ? { role: 'assistant', tool_calls: content }
      : { role: 'assistant', tool_calls: [content] }
  }

  return { content, role: 'assistant' }
}

export const tool = <C extends string | ToolMessagePart[]>(content: C, toolCall: ToolCall): ToolMessage => ({
  content,
  role: 'tool',
  tool_call_id: toolCall.id,
})
