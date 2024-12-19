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

export interface EmbedProvider<T extends string = string> {
  embed: (model: ({} & string) | T) => CommonRequestOptions
}

export interface ModelProvider {
  model: () => ProviderResult
}

export interface SpeechProvider<T extends string = string> {
  speech: (model: ({} & string) | T) => CommonRequestOptions
}

export interface TranscriptionProvider<T extends string = string> {
  transcription: (model: ({} & string) | T) => CommonRequestOptions
}
