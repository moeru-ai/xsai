import type {
  AssistantMessage,
  FilePart,
  ImagePart,
  LanguageModelOptions,
  ReasoningPart,
  TextPart,
  ToolCallPart,
  ToolResultPart,
  UserMessage,
  UserMessageContent,
} from '@xsai/text-primitives'

import type { ChatContentPart, ChatMessage } from '../types'

import { XSAIError } from '@xsai/shared'

const normalizeInputTextPart = (part: TextPart): ChatContentPart => ({
  text: part.text,
  type: 'text',
})

const normalizeImagePart = (part: ImagePart): ChatContentPart => {
  const data = part.data.toString()

  if (URL.canParse(data))
    return { image_url: { url: data }, type: 'image_url' }

  throw new XSAIError('invalid-input', 'Image part data must be a URL or a base64 data: URL')
}

const normalizeFilePart = (part: FilePart): ChatContentPart => {
  const data = part.data.toString()

  if (data.startsWith('data:'))
    return { file: { file_data: data }, type: 'file' }

  throw new XSAIError('invalid-input', 'File part data must be a base64 data: URL')
}

const normalizeToolResultPart = (part: ToolResultPart): ChatMessage => {
  const output = typeof part.output === 'string'
    ? part.output
    : part.output.map((content): ChatContentPart => {
        if (content.type !== 'text')
          throw new XSAIError('invalid-input', 'Image tool results are not supported on the Chat Completions API')

        return normalizeInputTextPart(content)
      })
  return {
    // Some gateways reject empty tool content.
    content: output === '' || (Array.isArray(output) && output.length === 0) ? '(no output)' : output,
    role: 'tool',
    tool_call_id: part.callId,
  }
}

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
  let reasoningField: 'reasoning' | 'reasoning_content' = 'reasoning_content'
  const refusal: string[] = []
  const toolCalls: NonNullable<ChatMessage['tool_calls']> = []

  for (const part of message.content) {
    switch (part.type) {
      case 'reasoning':
        reasoning.push(reasoningText(part))
        reasoningField = part.metadata?.chat?.reasoning_field ?? reasoningField
        break
      case 'refusal':
        refusal.push(part.refusal)
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
    // Some gateways reject `content: null` even when tool_calls is set.
    content: content.length === 0 ? '' : content,
    ...(reasoning.length === 0 ? {} : { [reasoningField]: reasoning.join('') }),
    ...(refusal.length === 0 ? {} : { refusal: refusal.join('') }),
    role: 'assistant',
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
export const normalizeInput = (options: LanguageModelOptions): ChatMessage[] => {
  const messages: ChatMessage[] = []

  if (options.instructions != null)
    messages.push({ content: options.instructions, role: 'system' })

  for (const message of typeof options.input === 'string'
    ? [{ content: options.input, role: 'user' as const }]
    : options.input) {
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
