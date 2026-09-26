import type {
  AssistantMessage,
  FilePart,
  ImagePart,
  Message,
  ReasoningPart,
  TextPart,
  ToolCallPart,
  ToolResultPart,
  ToolResultPartContent,
  UserMessage,
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
  RefusalContentParam,
  SystemMessageItemParam,
  UserMessageItemParam,
} from '../generated'
import type { WebSearchAction, WebSearchCallParam } from '../types/web-search'

type InputMessageContent = InputFileContentParam | InputImageContentParamAutoParam | InputTextContentParam

type ReplayItem = ItemParam | WebSearchCallParam

const normalizeInputTextPart = (part: TextPart): InputTextContentParam => ({
  text: part.text,
  type: 'input_text',
})

const normalizeOutputTextPart = (part: TextPart): OutputTextContentParam => ({
  ...(part.providerMetadata?.responses?.annotations == null ? {} : { annotations: part.providerMetadata.responses.annotations }),
  text: part.text,
  type: 'output_text',
})

const normalizeImagePart = (part: ImagePart): InputImageContentParamAutoParam => ({
  detail: part.detail,
  image_url: part.data.toString(),
  type: 'input_image',
})

const normalizeFilePart = (part: FilePart): InputFileContentParam => {
  const data = part.data.toString()
  const protocol = URL.parse(data)?.protocol

  return protocol === 'http:' || protocol === 'https:'
    ? { file_url: data, type: 'input_file' }
    : { file_data: data, type: 'input_file' }
}

const normalizeReasoningPart = (part: ReasoningPart): ReasoningItemParam => {
  const summary: ReasoningSummaryContentParam[] = []
  let encryptedContent: string | undefined

  for (const partContent of part.content) {
    switch (partContent.type) {
      case 'encrypted':
      case 'redacted':
        encryptedContent = partContent.text
        break
      case 'summary':
        summary.push({ text: partContent.text, type: 'summary_text' })
        break
      case 'text':
        break
    }
  }

  return {
    encrypted_content: encryptedContent,
    id: part.id,
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
      return normalizeInputTextPart(content)
  }
}

const normalizeToolResultPart = (part: ToolResultPart): FunctionCallOutputItemParam => ({
  call_id: part.callId,
  output: Array.isArray(part.output) ? part.output.map(normalizeToolResultContent) : part.output,
  type: 'function_call_output',
})

const normalizeWebSearchAction = (action: WebSearchAction): WebSearchAction => {
  switch (action.type) {
    case 'find_in_page':
      return { pattern: action.pattern, type: 'find_in_page', url: action.url }
    case 'open_page':
      return { ...(action.url == null ? {} : { url: action.url }), type: 'open_page' }
    case 'search':
      return {
        ...(action.queries == null ? {} : { queries: action.queries }),
        ...(action.query == null ? {} : { query: action.query }),
        type: 'search',
      }
  }
}

const normalizeAssistantMessage = (message: AssistantMessage): readonly ReplayItem[] => {
  const createMessageItem = (content: (OutputTextContentParam | RefusalContentParam)[], includeId = true): AssistantMessageItemParam => ({
    content,
    id: includeId ? message.id : undefined,
    role: 'assistant',
    type: 'message',
  })

  if (typeof message.content === 'string')
    return [createMessageItem([{ text: message.content, type: 'output_text' }])]

  const items: ReplayItem[] = []
  let content: (OutputTextContentParam | RefusalContentParam)[] = []
  let includeId = true

  const flushContent = (): void => {
    if (content.length === 0)
      return

    items.push(createMessageItem(content, includeId))
    content = []
    includeId = false
  }

  for (const part of message.content) {
    switch (part.type) {
      case 'reasoning':
        flushContent()
        items.push(normalizeReasoningPart(part))
        break
      case 'refusal':
        content.push({ refusal: part.refusal, type: 'refusal' })
        break
      case 'text':
        content.push(normalizeOutputTextPart(part))
        break
      case 'tool-call':
        flushContent()
        if (part.providerExecuted !== true)
          items.push(normalizeToolCallPart(part))
        break
      case 'tool-result':
        if (part.providerExecuted === true) {
          const call = message.content.find(candidate => candidate.type === 'tool-call' && candidate.callId === part.callId)
          if (call?.type === 'tool-call' && call.name === 'web_search') {
            const action = JSON.parse(part.output as string) as WebSearchAction
            items.push({ action: normalizeWebSearchAction(action), id: call.id, status: 'completed', type: 'web_search_call' })
          }
        }
        break
    }
  }

  flushContent()
  return items
}

const normalizeUserMessage = (message: UserMessage): ItemParam[] => {
  const createMessageItem = (content: InputMessageContent[] | string): UserMessageItemParam => ({
    content,
    role: 'user',
    type: 'message',
  })

  if (typeof message.content === 'string')
    return [createMessageItem(message.content)]

  const items: ItemParam[] = []
  let content: InputMessageContent[] = []

  const flushContent = (): void => {
    if (content.length === 0)
      return

    items.push(createMessageItem(content))
    content = []
  }

  for (const part of message.content) {
    switch (part.type) {
      case 'file':
        content.push(normalizeFilePart(part))
        break
      case 'image':
        content.push(normalizeImagePart(part))
        break
      case 'text':
        content.push(normalizeInputTextPart(part))
        break
      case 'tool-result':
        flushContent()
        items.push(normalizeToolResultPart(part))
        break
    }
  }

  flushContent()
  return items
}

const normalizeMessage = (message: Message): readonly ReplayItem[] => {
  switch (message.role) {
    case 'assistant':
      return normalizeAssistantMessage(message)
    case 'developer':
      return [{
        content: typeof message.content === 'string' ? message.content : message.content.map(normalizeInputTextPart),
        role: 'developer',
        type: 'message',
      } satisfies DeveloperMessageItemParam]
    case 'system':
      return [{
        content: typeof message.content === 'string' ? message.content : message.content.map(normalizeInputTextPart),
        role: 'system',
        type: 'message',
      } satisfies SystemMessageItemParam]
    case 'user':
      return normalizeUserMessage(message)
  }
}

/** @internal */
export const normalizeInput = (input: readonly Message[] | string): ReplayItem[] => typeof input === 'string'
  ? [{ content: input, role: 'user', type: 'message' }]
  : input.flatMap(normalizeMessage)
