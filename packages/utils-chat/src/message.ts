import type { AssistantMessage, AssistantMessagePart, ImagePart, Message, SystemMessage, SystemMessagePart, TextPart, ToolCall, ToolMessage, ToolMessagePart, UserMessage, UserMessagePart } from '@xsai/shared-chat'

export interface InsertResolver {
  parts: PartsInsertResolver
  string: StringInsertResolver
}
export type PartsInsertResolver = (content: TextPart[], inserts: Record<string, string>) => TextPart[]
export type StringInsertResolver = (content: string, inserts: Record<string, string>) => string

const replaceInString: StringInsertResolver = (content, inserts) => {
  const regex = /\{\{([^{}]+)\}\}/g
  return content.replace(regex, (match, p1: string) => inserts[p1] || match)
}

const replaceInParts: PartsInsertResolver = (content, inserts) => {
  const regex = /\{\{([^{}]+)\}\}/g
  return content.map(part => ({ ...part, text: part.text.replace(regex, (match, p1: string) => inserts[p1] || match) }))
}

export const defaultInsertResolver: InsertResolver = {
  parts: replaceInParts,
  string: replaceInString,
}

export const messages = (...messages: Message[]): Message[] => messages

export const textPart = (text: string, inserts: Record<string, string> = {}, resolver: StringInsertResolver = defaultInsertResolver.string): TextPart => ({ text: resolver(text, inserts), type: 'text' })

export const imagePart = (url: string): ImagePart => ({ image_url: { url }, type: 'image_url' })

export const system = <C extends string | SystemMessagePart[]>(
  content: C,
  inserts: Record<string, string> = {},
  resolver: InsertResolver = defaultInsertResolver,
): SystemMessage => ({ content: typeof content === 'string' ? resolver.string(content, inserts) : resolver.parts(content, inserts), role: 'system' })

export const user = <C extends Array<UserMessagePart> | string>(
  content: C,
  inserts: Record<string, string> = {},
  resolver: InsertResolver = defaultInsertResolver,
): UserMessage => ({ content: typeof content === 'string' ? resolver.string(content, inserts) : resolver.parts(content.filter(part => part.type === 'text'), inserts), role: 'user' })

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
    return {
      role: 'assistant',
      tool_calls: Array.isArray(content) ? content : [content],
    }
  }

  return { content, role: 'assistant' }
}

export const tool = <C extends string | ToolMessagePart[]>(content: C, toolCall: ToolCall): ToolMessage => ({
  content,
  role: 'tool',
  tool_call_id: toolCall.id,
})
