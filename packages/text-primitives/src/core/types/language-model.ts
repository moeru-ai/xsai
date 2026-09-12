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
  signal?: AbortSignal
}
