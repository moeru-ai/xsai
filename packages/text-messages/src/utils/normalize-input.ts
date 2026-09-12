import type {
  AssistantMessage,
  AssistantMessageContent,
  FilePart,
  ImagePart,
  LanguageModelContext,
  ReasoningPart,
  ReasoningPartContent,
  SystemMessageContent,
  TextPart,
  ToolCallPart,
  ToolResultPart,
  ToolResultPartContent,
  UserMessage,
  UserMessageContent,
} from '@xsai/text-primitives'

import type { ContentBlock, DocumentBlock, ImageBlock, InputMessage, TextBlock, ToolResultBlock, ToolUseBlock } from '../types'

interface DataUrl {
  data: string
  mediaType: string
}

const DATA_URL_PATTERN = /^data:([^;,]+);base64,(.*)$/s

const parseDataUrl = (data: string): DataUrl | undefined => {
  const match = DATA_URL_PATTERN.exec(data)
  return match === null ? undefined : { data: match[2], mediaType: match[1] }
}

const normalizeInputTextPart = (part: TextPart): TextBlock => ({
  text: part.text,
  type: 'text',
})

const normalizeImagePart = (part: ImagePart): ImageBlock => {
  const data = part.data.toString()
  const dataUrl = parseDataUrl(data)

  if (dataUrl !== undefined)
    return { source: { data: dataUrl.data, media_type: dataUrl.mediaType, type: 'base64' }, type: 'image' }

  if (URL.canParse(data))
    return { source: { type: 'url', url: data }, type: 'image' }

  throw new Error('Image part data must be a URL or a base64 data: URL')
}

const normalizeFilePart = (part: FilePart): DocumentBlock => {
  const data = part.data.toString()
  const dataUrl = parseDataUrl(data)

  if (dataUrl !== undefined) {
    if (dataUrl.mediaType !== 'application/pdf')
      throw new Error(`Anthropic documents only support PDF or plain text, got: ${dataUrl.mediaType}`)

    return { source: { data: dataUrl.data, media_type: 'application/pdf', type: 'base64' }, type: 'document' }
  }

  if (URL.canParse(data))
    return { source: { type: 'url', url: data }, type: 'document' }

  return { source: { data, media_type: 'text/plain', type: 'text' }, type: 'document' }
}

const normalizeToolResultContent = (content: ToolResultPartContent): ImageBlock | TextBlock => {
  switch (content.type) {
    case 'image':
      return normalizeImagePart(content)
    case 'text':
      return normalizeInputTextPart(content)
  }
}

const normalizeToolResultPart = (part: ToolResultPart): ToolResultBlock => ({
  ...(part.isError === undefined ? {} : { is_error: part.isError }),
  content: typeof part.output === 'string' ? part.output : part.output.map(normalizeToolResultContent),
  tool_use_id: part.callId,
  type: 'tool_result',
})

const normalizeReasoningPartContent = (content: ReasoningPartContent): ContentBlock[] => {
  switch (content.type) {
    case 'encrypted':
      return [{ data: content.text, type: 'redacted_thinking' }]
    case 'redacted':
      return [{ data: content.data, type: 'redacted_thinking' }]
    case 'summary':
      return []
    case 'text':
      return [{ thinking: content.text, type: 'thinking' }]
  }
}

const normalizeReasoningPart = (part: ReasoningPart): ContentBlock[] => {
  const blocks = part.content.flatMap(normalizeReasoningPartContent)
  const signature = part.metadata?.messages?.signature
  if (signature === undefined)
    return blocks

  // A signature belongs to the thinking block it closed.
  for (let i = blocks.length - 1; i >= 0; i--) {
    const block = blocks[i]
    if (block.type === 'thinking') {
      block.signature = signature
      break
    }
  }
  return blocks
}

const normalizeToolCallPart = (part: ToolCallPart): ToolUseBlock => ({
  id: part.callId,
  input: part.arguments === '' ? {} : JSON.parse(part.arguments),
  name: part.name,
  type: 'tool_use',
})

const normalizeUserPart = (part: UserMessageContent): ContentBlock => {
  switch (part.type) {
    case 'file':
      return normalizeFilePart(part)
    case 'image':
      return normalizeImagePart(part)
    case 'text':
      return normalizeInputTextPart(part)
    case 'tool-result':
      return normalizeToolResultPart(part)
  }
}

const normalizeAssistantPart = (part: AssistantMessageContent): ContentBlock[] => {
  switch (part.type) {
    case 'reasoning':
      return normalizeReasoningPart(part)
    case 'text':
      return [{ text: part.text, type: 'text' }]
    case 'tool-call':
      return [normalizeToolCallPart(part)]
  }
}

const normalizeUserMessage = (message: UserMessage): InputMessage => ({
  content: typeof message.content === 'string'
    ? [{ text: message.content, type: 'text' }]
    : message.content.map(normalizeUserPart),
  role: 'user',
})

const normalizeAssistantMessage = (message: AssistantMessage): InputMessage => ({
  content: typeof message.content === 'string'
    ? [{ text: message.content, type: 'text' }]
    : message.content.flatMap(normalizeAssistantPart),
  role: 'assistant',
})

export interface NormalizedInput {
  messages: InputMessage[]
  system?: TextBlock[]
}

const systemText = (content: readonly SystemMessageContent[] | string): TextBlock[] => typeof content === 'string'
  ? [{ text: content, type: 'text' }]
  : content.map(normalizeInputTextPart)

/** @internal */
export const normalizeInput = (context: LanguageModelContext): NormalizedInput => {
  const system: TextBlock[] = []
  const messages: InputMessage[] = []

  if (context.instructions !== undefined)
    system.push({ text: context.instructions, type: 'text' })

  for (const message of typeof context.input === 'string'
    ? [{ content: context.input, role: 'user' as const }]
    : context.input) {
    switch (message.role) {
      case 'assistant':
        messages.push(normalizeAssistantMessage(message))
        break
      case 'developer':
      case 'system':
        system.push(...systemText(message.content))
        break
      case 'user':
        messages.push(normalizeUserMessage(message))
        break
    }
  }

  return {
    messages,
    ...(system.length === 0 ? {} : { system }),
  }
}
