import type { AssistantMessage, ImageContentPart, Message, RefusalContentPart, SystemMessage, TextContentPart, ToolCall, ToolMessage, UserMessage } from '@xsai/shared-chat'

export const messages = (...messages: Message[]): Message[] => messages

export const system = <C extends SystemMessage['content']>(content: C): SystemMessage => ({ content, role: 'system' })

export const user = <C extends UserMessage['content']>(content: C): UserMessage => ({ content, role: 'user' })

export const textPart = (text: string): TextContentPart => ({ text, type: 'text' })

export const imagePart = (url: string): ImageContentPart => ({ image_url: { url }, type: 'image_url' })

export const isToolCall = (content: AssistantMessage['content'] | ToolCall | ToolCall[]): content is ToolCall | ToolCall[] => {
  const isElementToolCallLike = (c: AssistantMessage['content'] | RefusalContentPart | string | TextContentPart | ToolCall | ToolCall[]) =>
    (typeof c === 'object'
      && (
        ('type' in c && c.type === 'function')
        && 'id' in c
        && 'function' in c && typeof c.function === 'object')
    )

  return isElementToolCallLike(content)
    || (Array.isArray(content) && content.every(part => isElementToolCallLike(part)))
}

export const assistant = <C extends AssistantMessage['content'] | ToolCall | ToolCall[]>(content: C): AssistantMessage => {
  if (isToolCall(content)) {
    return Array.isArray(content)
      ? { role: 'assistant', tool_calls: content }
      : { role: 'assistant', tool_calls: [content] }
  }

  return { content, role: 'assistant' }
}

export const tool = <C extends ToolMessage['content']>(content: C, toolCall: ToolCall): ToolMessage => ({
  content,
  role: 'tool',
  tool_call_id: toolCall.id,
})
