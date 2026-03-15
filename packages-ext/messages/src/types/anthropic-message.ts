import type { AnthropicCacheControl, AnthropicTool, AnthropicToolChoice } from './anthropic-tool'
import type { AnthropicStopReason } from './finish-reason'
import type { Usage } from './usage'

export interface AnthropicAssistantMessageParam {
  content: (AnthropicRedactedThinkingBlock | AnthropicTextBlockParam | AnthropicThinkingBlockParam | AnthropicToolUseBlock)[] | AnthropicRedactedThinkingBlock[] | AnthropicTextBlockParam[] | AnthropicThinkingBlockParam[] | AnthropicToolUseBlock[] | string
  role: 'assistant'
}

export interface AnthropicBase64ImageSource {
  data: string
  media_type: 'image/gif' | 'image/jpeg' | 'image/png' | 'image/webp'
  type: 'base64'
}

export interface AnthropicBase64PDFSource {
  data: string
  media_type: 'application/pdf'
  type: 'base64'
}

export type AnthropicContentBlock = AnthropicRedactedThinkingBlock | AnthropicTextBlock | AnthropicThinkingBlock | AnthropicToolUseBlock | (Record<string, unknown> & { type: string })

export interface AnthropicDocumentBlockParam {
  cache_control?: AnthropicCacheControl | null
  citations?: {
    enabled?: boolean
  }
  context?: string
  source: AnthropicBase64PDFSource | AnthropicPlainTextSource | AnthropicURLDocumentSource
  title?: string
  type: 'document'
}

export interface AnthropicImageBlockParam {
  cache_control?: AnthropicCacheControl | null
  source: AnthropicBase64ImageSource | AnthropicURLImageSource
  type: 'image'
}

export interface AnthropicMessage {
  content: AnthropicContentBlock[]
  id: string
  model: string
  role: 'assistant'
  stop_reason: AnthropicStopReason | null
  stop_sequence: null | string
  type: 'message'
  usage: Usage
}

export interface AnthropicMessageCountTokensBody {
  cache_control?: AnthropicCacheControl | null
  messages: AnthropicMessageParam[]
  model: string
  system?: AnthropicSystemPrompt
  thinking?: AnthropicThinkingConfig
  tool_choice?: AnthropicToolChoice
  tools?: AnthropicTool[]
}

export interface AnthropicMessageCreateBody {
  cache_control?: AnthropicCacheControl | null
  max_tokens: number
  messages: AnthropicMessageParam[]
  metadata?: AnthropicMetadata
  model: string
  service_tier?: 'auto' | 'standard_only'
  stop_sequences?: string[]
  stream?: boolean
  system?: AnthropicSystemPrompt
  temperature?: number
  thinking?: AnthropicThinkingConfig
  tool_choice?: AnthropicToolChoice
  tools?: AnthropicTool[]
  top_k?: number
  top_p?: number
}

export type AnthropicMessageParam = AnthropicAssistantMessageParam | AnthropicUserMessageParam

export interface AnthropicMetadata {
  user_id?: null | string
}

export interface AnthropicPlainTextSource {
  data: string
  media_type: 'text/plain'
  type: 'text'
}

export interface AnthropicRedactedThinkingBlock {
  data: string
  type: 'redacted_thinking'
}

export type AnthropicSystemPrompt = AnthropicTextBlockParam[] | string

export interface AnthropicTextBlock {
  citations?: unknown[]
  text: string
  type: 'text'
}

export interface AnthropicTextBlockParam {
  cache_control?: AnthropicCacheControl | null
  citations?: {
    enabled?: boolean
  }
  text: string
  type: 'text'
}

export interface AnthropicThinkingBlock {
  signature: string
  thinking: string
  type: 'thinking'
}

export interface AnthropicThinkingBlockParam {
  signature: string
  thinking: string
  type: 'thinking'
}

export type AnthropicThinkingConfig = AnthropicThinkingConfigAdaptive | AnthropicThinkingConfigDisabled | AnthropicThinkingConfigEnabled

export interface AnthropicThinkingConfigAdaptive {
  type: 'adaptive'
}

export interface AnthropicThinkingConfigDisabled {
  type: 'disabled'
}

export interface AnthropicThinkingConfigEnabled {
  budget_tokens: number
  type: 'enabled'
}

export interface AnthropicToolResultBlockParam {
  cache_control?: AnthropicCacheControl | null
  content?: AnthropicTextBlockParam[] | string
  is_error?: boolean
  tool_use_id: string
  type: 'tool_result'
}

export interface AnthropicToolUseBlock {
  id: string
  input: Record<string, unknown>
  name: string
  type: 'tool_use'
}

export interface AnthropicURLDocumentSource {
  type: 'url'
  url: string
}

export interface AnthropicURLImageSource {
  type: 'url'
  url: string
}

export interface AnthropicUserMessageParam {
  content: (AnthropicDocumentBlockParam | AnthropicImageBlockParam | AnthropicTextBlockParam | AnthropicToolResultBlockParam)[] | AnthropicDocumentBlockParam[] | AnthropicImageBlockParam[] | AnthropicTextBlockParam[] | AnthropicToolResultBlockParam[] | string
  role: 'user'
}
