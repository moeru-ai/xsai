import type { Promisable } from '@xsai/shared'

import type { UnresolvedSchema } from '../../utils/schema'
import type { Tool } from '../tool'
import type { Message } from './message'
import type { TextEvent } from './text-event'

export type LanguageModel = (options: LanguageModelOptions) => Promisable<ReadableStream<TextEvent>>

export interface LanguageModelOptions {
  includeRawEvents?: boolean
  input: Message[] | string
  instructions?: string
  maxOutputTokens?: number
  /** Strict structured-output schema. */
  outputFormat?: UnresolvedSchema
  providerOptions?: ProviderOptions
  /** Qualitative reasoning effort; provider-specific knobs stay in `providerOptions`. */
  reasoningEffort?: 'high' | 'low' | 'max' | 'medium' | 'none' | 'xhigh' | (string & {})
  signal?: AbortSignal
  temperature?: number
  toolChoice?: ToolChoice
  tools?: Tool[]
  topP?: number
}

/** Extension point for wire-specific request options. */
export interface ProviderOptions {}

export type ToolChoice = 'auto' | 'none' | 'required' | { name: string }
