import type {
  AssistantMessage,
  FilePart,
  ImagePart,
  LanguageModelContext,
  ReasoningPart,
  TextPart,
  ToolCallPart,
  ToolResultPart,
  UserMessage,
  UserMessageContent,
} from '@xsai/text-primitives'

import type { ChatContentPart, ChatMessage } from '../types'

const normalizeInputTextPart = (part: TextPart): ChatContentPart => ({
  text: part.text,
  type: 'text',
})

const normalizeImagePart = (part: ImagePart): ChatContentPart => {
  const data = part.data.toString()

  // image_url accepts both remote URLs and base64 data: URLs.
  if (URL.canParse(data))
    return { image_url: { url: data }, type: 'image_url' }

  throw new Error('Image part data must be a URL or a base64 data: URL')
}

const normalizeFilePart = (part: FilePart): ChatContentPart => {
  const data = part.data.toString()

  if (data.startsWith('data:'))
    return { file: { file_data: data }, type: 'file' }

  throw new Error('File part data must be a base64 data: URL')
}

const normalizeToolResultPart = (part: ToolResultPart): ChatMessage => ({
  content: typeof part.output === 'string'
    ? part.output
    : part.output.map((content): ChatContentPart => {
        if (content.type !== 'text')
          throw new Error('Image tool results are not supported on the Chat Completions API')

        return normalizeInputTextPart(content)
      }),
  role: 'tool',
  tool_call_id: part.callId,
})

const reasoningText = (part: ReasoningPart): string =>
  part.content
    .filter(content => content.type === 'text')
    .map(content => content.text)
    .join('')

const normalizeToolCallPart = (part: ToolCallPart): NonNullable<ChatMessage['tool_calls']>[number] => ({
  function: {
    arguments: part.arguments,
    name: part.name,
  },
  id: part.callId,
  type: 'function',
})

const normalizeAssistantMessage = (message: AssistantMessage): ChatMessage => {
  if (typeof message.content === 'string')
    return { content: message.content, role: 'assistant' }

  const content: ChatContentPart[] = []
  const reasoning: string[] = []
  const toolCalls: NonNullable<ChatMessage['tool_calls']> = []

  for (const part of message.content) {
    switch (part.type) {
      case 'reasoning':
        reasoning.push(reasoningText(part))
        break
      case 'text':
        content.push(normalizeInputTextPart(part))
        break
      case 'tool-call':
        toolCalls.push(normalizeToolCallPart(part))
        break
    }
  }

  return {
    content: content.length === 0 ? null : content,
    role: 'assistant',
    ...(reasoning.length === 0 ? {} : { reasoning_content: reasoning.join('') }),
    ...(toolCalls.length === 0 ? {} : { tool_calls: toolCalls }),
  }
}

const normalizeUserPart = (part: Exclude<UserMessageContent, ToolResultPart>): ChatContentPart => {
  switch (part.type) {
    case 'file':
      return normalizeFilePart(part)
    case 'image':
      return normalizeImagePart(part)
    case 'text':
      return normalizeInputTextPart(part)
  }
}

const normalizeUserMessage = (message: UserMessage, messages: ChatMessage[]): void => {
  if (typeof message.content === 'string') {
    messages.push({ content: message.content, role: 'user' })
    return
  }

  let content: ChatContentPart[] = []
  const flush = (): void => {
    if (content.length === 0)
      return

    messages.push({ content, role: 'user' })
    content = []
  }

  for (const part of message.content) {
    if (part.type === 'tool-result') {
      flush()
      messages.push(normalizeToolResultPart(part))
      continue
    }

    content.push(normalizeUserPart(part))
  }

  flush()
}

const joinText = (content: readonly { text: string }[] | string): string => typeof content === 'string'
  ? content
  : content.map(part => part.text).join('')

/** @internal */
export const normalizeInput = (context: LanguageModelContext): ChatMessage[] => {
  const messages: ChatMessage[] = []

  if (context.instructions !== undefined)
    messages.push({ content: context.instructions, role: 'system' })

  for (const message of typeof context.input === 'string'
    ? [{ content: context.input, role: 'user' as const }]
    : context.input) {
    switch (message.role) {
      case 'assistant':
        messages.push(normalizeAssistantMessage(message))
        break
      case 'developer':
      case 'system':
        messages.push({ content: joinText(message.content), role: message.role })
        break
      case 'user':
        normalizeUserMessage(message, messages)
        break
    }
  }

  return messages
}
