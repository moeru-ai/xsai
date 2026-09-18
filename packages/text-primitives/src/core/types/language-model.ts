import type { Promisable } from '@xsai/shared'

import type { UnresolvedSchema } from '../../utils/schema'
import type { Tool } from '../tool'
import type { Event } from './event'
import type { Message } from './message'

/** JSON Schema or a Standard Schema with JSON Schema support. */
export type Format = UnresolvedSchema

export type LanguageModel = (options: LanguageModelOptions) => Promisable<ReadableStream<Event>>

export interface LanguageModelOptions {
  /** Wire-native fields merged last into the request body. */
  extraBody?: Record<string, unknown>
  /** Strict structured-output schema. */
  format?: Format
  input: Message[] | string
  instructions?: string
  maxOutputTokens?: number
  /** Qualitative reasoning effort; provider-specific knobs stay in `extraBody`. */
  reasoningEffort?: 'high' | 'low' | 'max' | 'medium' | 'none' | 'xhigh' | (string & {})
  signal?: AbortSignal
  temperature?: number
  toolChoice?: ToolChoice
  tools?: Tool[]
  topP?: number
}

export type ToolChoice = 'auto' | 'none' | 'required' | { name: string }
