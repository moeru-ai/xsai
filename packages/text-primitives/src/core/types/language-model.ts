import type { Promisable } from '@xsai/shared'

import type { UnresolvedSchema } from '../../utils/schema'
import type { Tool } from '../tool'
import type { Event } from './event'
import type { Message } from './message'

export type LanguageModel = (options: LanguageModelOptions) => Promisable<ReadableStream<Event>>

export interface LanguageModelOptions {
  /** Wire-native fields merged last into the request body. */
  extraBody?: Record<string, unknown>
  input: Message[] | string
  instructions?: string
  maxOutputTokens?: number
  /** Strict structured-output schema. */
  outputFormat?: UnresolvedSchema
  /** Qualitative reasoning effort; provider-specific knobs stay in `extraBody`. */
  reasoningEffort?: 'high' | 'low' | 'max' | 'medium' | 'none' | 'xhigh' | (string & {})
  signal?: AbortSignal
  temperature?: number
  toolChoice?: ToolChoice
  tools?: Tool[]
  topP?: number
}

export type ToolChoice = 'auto' | 'none' | 'required' | { name: string }
