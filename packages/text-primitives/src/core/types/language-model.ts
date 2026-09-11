import type { Event } from './event'
import type { ModelContext } from './model-context'

export type LanguageModel = (options: ModelContext) => Promise<ReadableStream<Event>>
