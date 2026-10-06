import type { Promisable } from '@xsai/shared'

import type { UnresolvedSchema } from '../../utils/schema'
import type { Tool } from '../tool'
import type { Message } from './message'
import type { TextEvent } from './text-event'

export type LanguageModel = (options: LanguageModelOptions) => Promisable<ReadableStream<TextEvent>>

export interface LanguageModelOptions {
  events?: EventTarget
  includeRawEvents?: boolean
  input: Message[] | string
  instructions?: string
  maxOutputTokens?: number
  /** Strict structured-output schema. */
  outputFormat?: UnresolvedSchema
  providerOptions?: LanguageModelProviderOptions
  /** Qualitative reasoning effort; provider-specific knobs stay in `providerOptions`. */
  reasoningEffort?: 'high' | 'low' | 'max' | 'medium' | 'none' | 'xhigh' | (string & {})
  signal?: AbortSignal
  temperature?: number
  toolChoice?: ToolChoice
  tools?: Tool[]
  topP?: number
}

export interface LanguageModelProviderOptions {}

export type ToolChoice = 'auto' | 'none' | 'required' | { name: string }
