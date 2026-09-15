import type { Promisable } from '@xsai/shared'

import type { UnresolvedSchema } from '../../utils/schema'
import type { Tool } from '../tool'
import type { Event } from './event'
import type { Message } from './message'

/** Raw JSON Schema or a `StandardJSONSchemaV1`, optionally carrying a `StandardSchemaV1` validator. */
export type Format = UnresolvedSchema

export type LanguageModel = (options: LanguageModelOptions) => Promisable<ReadableStream<Event>>

export interface LanguageModelOptions {
  /**
   * Wire-native fields merged last into the request body — the escape hatch
   * for wire features the options don't model. Overrides fields the adapter
   * normalizes, so it can also break them (`stream`, `messages`, `tools`…).
   */
  extraBody?: Record<string, unknown>
  /** Structured output schema; `title`/`description` keywords supply the wire format name/description. Always strict. */
  format?: Format
  input: Message[] | string
  instructions?: string
  maxOutputTokens?: number
  /**
   * Qualitative reasoning effort. On Anthropic this maps to
   * `output_config.effort`; `thinking.budget_tokens` is an orthogonal knob
   * and stays in `extraBody`.
   */
  reasoningEffort?: 'high' | 'low' | 'max' | 'medium' | 'none' | 'xhigh' | (string & {})
  signal?: AbortSignal
  temperature?: number
  toolChoice?: ToolChoice
  tools?: Tool[]
  topP?: number
}

export type ToolChoice = 'auto' | 'none' | 'required' | { name: string }
