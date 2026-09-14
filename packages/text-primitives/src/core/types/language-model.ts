import type { Tool } from '../tool'
import type { Event } from './event'
import type { Message } from './message'

export type LanguageModel = (context: LanguageModelContext, options?: LanguageModelOptions) => Promise<ReadableStream<Event>>

export interface LanguageModelContext {
  input: Message[] | string
  instructions?: string
  tools?: Tool[]
}

export interface LanguageModelOptions {
  /**
   * Wire-native fields merged last into the request body — the escape hatch
   * for wire features the options don't model. Overrides fields the adapter
   * normalizes, so it can also break them (`stream`, `messages`, `tools`…).
   */
  extraBody?: Record<string, unknown>
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
  topP?: number
}

export type ToolChoice = 'auto' | 'none' | 'required' | { name: string }
