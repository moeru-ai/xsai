import type { AnthropicMessageCountTokensBody, AnthropicMessageCreateBody } from './anthropic-message'
import type { ExecutableTool } from './anthropic-tool'

export interface CommonAnthropicTransportOptions {
  abortSignal?: AbortSignal
  anthropicBeta?: string | string[]
  anthropicVersion?: string
  apiKey?: string
  baseURL?: string | URL
  fetch?: typeof globalThis.fetch
  headers?: Record<string, string>
}

export interface CountTokensOptions extends CommonAnthropicTransportOptions, Omit<AnthropicMessageCountTokensBody, 'tools'> {
  tools?: ExecutableTool[]
}

export interface MessagesOptions extends CommonAnthropicTransportOptions, Omit<AnthropicMessageCreateBody, 'stream' | 'tools'> {
  stream?: never
  tools?: ExecutableTool[]
}
