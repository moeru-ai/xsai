import type { TextOptions } from '../text'
import type { Event } from './event'

export interface Model {
  readonly metadata?: ModelMetadata
  stream: (options: Omit<TextOptions, 'model'>) => Promise<ReadableStream<Event>>
  readonly version: '1.0'
}

export interface ModelMetadata {
  api?: string
  baseURL?: string | URL
  model?: string
  provider?: string
}

export interface ModelOptions {
  apiKey?: string
  /** @example `https://api.openai.com/v1/` */
  baseURL: string | URL
  extraBody?: Record<string, unknown>
  extraHeaders?: Record<string, string>
  model: string
}
