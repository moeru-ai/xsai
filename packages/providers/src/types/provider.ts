import type { CommonRequestOptions } from '@xsai/shared'

/** T: required apiKey */
export type ProviderOptions<T extends boolean = false> =
  T extends true
    ? Partial<Omit<ProviderResult, 'apiKey'>> & Required<Pick<ProviderResult, 'apiKey'>>
    : Partial<ProviderResult>

export type ProviderResult = Omit<CommonRequestOptions, 'model'> & Partial<Pick<CommonRequestOptions, 'model'>>

export interface ChatProvider<T extends string = string> {
  chat: (model: ({} & string) | T) => CommonRequestOptions
}

export interface EmbeddingsProvider<T extends string = string> {
  embeddings: (model: ({} & string) | T) => CommonRequestOptions
}

export interface ModelsProvider {
  models: () => ProviderResult
}

export interface SpeechProvider<T extends string = string> {
  speech: (model: ({} & string) | T) => CommonRequestOptions
}

export interface TranscriptionsProvider<T extends string = string> {
  transcriptions: (model: ({} & string) | T) => CommonRequestOptions
}
