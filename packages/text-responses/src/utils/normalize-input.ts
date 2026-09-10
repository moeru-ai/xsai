import type {
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
  SystemMessageItemParam,
  UserMessageItemParam,
} from '../generated'

type MessageContent = InputFileContentParam | InputImageContentParamAutoParam | InputTextContentParam | OutputTextContentParam

const normalizeTextPart = (part: TextPart, role: Message['role']): InputTextContentParam | OutputTextContentParam => ({
  text: part.text,
  type: role === 'assistant' ? 'output_text' : 'input_text',
})

const normalizeImagePart = (part: ImagePart): InputImageContentParamAutoParam => ({
  ...(part.detail == null ? {} : { detail: part.detail as NonNullable<InputImageContentParamAutoParam['detail']> }),
  image_url: part.data.toString(),
  type: 'input_image',
})

const normalizeFilePart = (part: FilePart): InputFileContentParam => URL.canParse(part.data)
  ? {
      file_url: part.data.toString(),
      type: 'input_file',
    }
  : {
      file_data: part.data.toString(),
      type: 'input_file',
    }

const normalizeReasoningPart = (part: ReasoningPart): ReasoningItemParam => {
  const summary: ReasoningSummaryContentParam[] = []
  let encryptedContent: string | undefined

  for (const content of part.content) {
    switch (content.type) {
      case 'encrypted':
        encryptedContent = content.text
        break
      case 'redacted':
        break
      case 'summary':
      case 'text':
        summary.push({ text: content.text, type: 'summary_text' })
        break
    }
  }

  return {
    ...(encryptedContent == null ? {} : { encrypted_content: encryptedContent }),
    ...(part.id == null ? {} : { id: part.id }),
    summary,
    type: 'reasoning',
  }
}

const normalizeToolCallPart = (part: ToolCallPart): FunctionCallItemParam => ({
  arguments: part.arguments,
  call_id: part.callId,
  id: part.id,
  name: part.name,
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

const normalizeToolResultPart = (part: ToolResultPart): FunctionCallOutputItemParam => ({
  call_id: part.callId,
  output: Array.isArray(part.output) ? part.output.map(normalizeToolResultContent) : part.output,
  type: 'function_call_output',
})

const normalizeMessage = (message: Message): ItemParam[] => {
  const role = message.role
  const id = message.role === 'assistant' ? message.id : undefined

  const createMessageItem = (content: MessageContent[] | string, includeId = true): ItemParam => ({
    content,
    ...(includeId && id != null ? { id } : {}),
    role,
    type: 'message',
  } as AssistantMessageItemParam | DeveloperMessageItemParam | SystemMessageItemParam | UserMessageItemParam)

  if (typeof message.content === 'string')
    return [createMessageItem(message.content)]

  const items: ItemParam[] = []
  let content: MessageContent[] = []
  let includeId = true

  const flushContent = () => {
    if (content.length === 0)
      return

    items.push(createMessageItem(content, includeId))
    content = []
    includeId = false
  }

  for (const part of message.content) {
    switch (part.type) {
      case 'file':
        content.push(normalizeFilePart(part))
        break
      case 'image':
        content.push(normalizeImagePart(part))
        break
      case 'reasoning':
        flushContent()
        items.push(normalizeReasoningPart(part))
        break
      case 'text':
        content.push(normalizeTextPart(part, role))
        break
      case 'tool-call':
        flushContent()
        items.push(normalizeToolCallPart(part))
        break
      case 'tool-result':
        flushContent()
        items.push(normalizeToolResultPart(part))
        break
    }
  }

  flushContent()

  return items.length > 0 ? items : [createMessageItem([])]
}

/** @internal */
export const normalizeInput = (input: readonly Message[] | string): ItemParam[] => typeof input === 'string'
  ? normalizeMessage({ content: input, role: 'user' })
  : input.flatMap(normalizeMessage)
