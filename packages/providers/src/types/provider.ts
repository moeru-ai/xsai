import type { CommonRequestOptions } from '@xsai/shared'

export interface ChatProvider<T extends string = string> {
  chat: (model: (string & {}) | T) => CommonRequestOptions
}

export interface EmbedProvider<T extends string = string> {
  embed: (model: (string & {}) | T) => CommonRequestOptions
}

export interface ModelProvider {
  model: () => ProviderResult
}

/** T: required apiKey */
export type ProviderOptions<T extends boolean = false> =
  T extends true
    ? Partial<Omit<ProviderResult, 'apiKey'>> & Required<Pick<ProviderResult, 'apiKey'>>
    : Partial<ProviderResult>

export type ProviderResult = Omit<CommonRequestOptions, 'model'> & Partial<Pick<CommonRequestOptions, 'model'>>

export interface SpeechProvider<T extends string = string, T2 = undefined> {
  speech: T2 extends undefined
    ? (model: (string & {}) | T) => CommonRequestOptions
    : (model: (string & {}) | T, extraOptions?: T2) => CommonRequestOptions & T2
}

export interface TranscriptionProvider<T extends string = string> {
  transcription: (model: (string & {}) | T) => CommonRequestOptions
}
