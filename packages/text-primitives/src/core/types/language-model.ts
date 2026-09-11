import type { TextOptions } from '../text'
import type { Event } from './event'

export type LanguageModel = (options: Omit<TextOptions, 'model'>) => Promise<ReadableStream<Event>>
