import type {
  Content,
  FilePart,
  ImagePart,
  Message,
  ReasoningPart,
  TextPart,
  ToolCallPart,
  ToolResultPart,
  ToolResultPartContent,
} from '@xsai/text-primitives'

import type {
  AssistantMessageItemParam,
  DeveloperMessageItemParam,
  FunctionCallItemParam,
  FunctionCallOutputItemParam,
  InputFileContentParam,
  InputImageContentParamAutoParam,
  InputTextContentParam,
  ItemParam,
  OutputTextContentParam,
  ReasoningItemParam,
  ReasoningSummaryContentParam,
  ReasoningTextContent,
  SystemMessageItemParam,
  UserMessageItemParam,
} from '../generated'

type MessageContent = InputFileContentParam | InputImageContentParamAutoParam | InputTextContentParam | OutputTextContentParam
type MessageItemParam = AssistantMessageItemParam | DeveloperMessageItemParam | SystemMessageItemParam | UserMessageItemParam
type NormalizedItemParam = ItemParam | ReasoningItem
type ReasoningItem = Omit<ReasoningItemParam, 'content'> & {
  content?: null | ReasoningTextContent[]
}

const normalizeTextPart = (part: TextPart, role: Message['role']): InputTextContentParam | OutputTextContentParam => ({
  text: part.text,
  type: role === 'assistant' ? 'output_text' : 'input_text',
})

const normalizeImagePart = (part: ImagePart): InputImageContentParamAutoParam => ({
  ...(part.detail == null ? {} : { detail: part.detail }),
  image_url: part.data.toString(),
  type: 'input_image',
})

const normalizeFilePart = (part: FilePart): InputFileContentParam =>
  URL.canParse(part.data)
    ? {
        file_url: part.data.toString(),
        type: 'input_file',
      }
    : {
        file_data: part.data.toString(),
        type: 'input_file',
      }

const normalizeReasoningPart = (part: ReasoningPart): ReasoningItem | undefined => {
  if (part.id == null)
    return undefined

  const summary: ReasoningSummaryContentParam[] = []
  const content: ReasoningTextContent[] = []
  let encryptedContent: string | undefined

  for (const partContent of part.content) {
    switch (partContent.type) {
      case 'encrypted':
        encryptedContent ??= partContent.text
        break
      case 'redacted':
        encryptedContent ??= partContent.data
        break
      case 'summary':
        summary.push({ text: partContent.text, type: 'summary_text' })
        break
      case 'text':
        content.push({ text: partContent.text, type: 'reasoning_text' })
        break
    }
  }

  return {
    ...(content.length === 0 ? {} : { content }),
    ...(encryptedContent == null ? {} : { encrypted_content: encryptedContent }),
    id: part.id,
    summary,
    type: 'reasoning',
  }
}

const normalizeToolCallPart = (part: ToolCallPart): FunctionCallItemParam => ({
  arguments: part.arguments,
  call_id: part.callId,
  ...(part.id.startsWith('fc_') ? { id: part.id } : {}),
  name: part.name,
  status: 'completed',
  type: 'function_call',
})

const normalizeToolResultContent = (content: ToolResultPartContent): InputImageContentParamAutoParam | InputTextContentParam => {
  switch (content.type) {
    case 'image':
      return normalizeImagePart(content)
    case 'text':
      return { text: content.text, type: 'input_text' }
  }
}

const normalizeToolResultPart = (part: ToolResultPart): FunctionCallOutputItemParam => {
  const output = Array.isArray(part.output) ? part.output.map(normalizeToolResultContent) : part.output

  return {
    call_id: part.callId,
    output,
    status: 'completed',
    type: 'function_call_output',
  }
}

const normalizeMessagePart = (
  part: Content,
  role: Message['role'],
  id: string | undefined,
  createMessageItem: (content: MessageContent[] | string) => ItemParam,
): NormalizedItemParam | undefined => {
  switch (part.type) {
    case 'file':
      return createMessageItem([normalizeFilePart(part)])
    case 'image':
      return createMessageItem([normalizeImagePart(part)])
    case 'reasoning':
      return normalizeReasoningPart(part)
    case 'text':
      if (role === 'assistant' && part.text.length === 0)
        return undefined

      return createMessageItem(role === 'assistant' && id == null
        ? part.text
        : [normalizeTextPart(part, role)])
    case 'tool-call':
      return normalizeToolCallPart(part)
    case 'tool-result':
      return normalizeToolResultPart(part)
  }
}

const normalizeMessage = (message: Message): NormalizedItemParam[] => {
  const role = message.role
  const id = role === 'assistant' ? message.id : undefined

  const createMessageItem = (content: MessageContent[] | string): ItemParam => ({
    content,
    ...(id == null ? {} : { id }),
    role,
    ...(role === 'assistant' && id != null ? { status: 'completed' } : {}),
    type: 'message',
  } as MessageItemParam)

  if (typeof message.content === 'string') {
    if (role === 'assistant' && message.content.length === 0)
      return []

    return [createMessageItem(id == null || role !== 'assistant'
      ? message.content
      : [{ text: message.content, type: 'output_text' }])]
  }

  const items = message.content
    .map(part => normalizeMessagePart(part, role, id, createMessageItem))
    .filter((item): item is ItemParam => item != null)

  return [
    ...items.filter(item => item.type === 'reasoning'),
    ...items.filter(item => item.type !== 'reasoning'),
  ]
}

/** @internal */
export const normalizeInput = (input: readonly Message[] | string): NormalizedItemParam[] => typeof input === 'string'
  ? normalizeMessage({ content: input, role: 'user' })
  : input.flatMap(normalizeMessage)
