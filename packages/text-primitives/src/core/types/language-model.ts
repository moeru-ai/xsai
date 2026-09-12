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
  extraBody?: Record<string, unknown>
  maxOutputTokens?: number
  /**
   * Qualitative reasoning effort. Anthropic's `thinking.budget_tokens` is a
   * different model — use `extraBody` there; this option is ignored on wires
   * that take a token budget.
   */
  reasoningEffort?: 'high' | 'low' | 'medium' | 'none'
  signal?: AbortSignal
  temperature?: number
  toolChoice?: ToolChoice
  topP?: number
}

export type ToolChoice = 'auto' | 'none' | 'required' | { name: string }
