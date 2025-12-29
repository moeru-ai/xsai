import type { CommonRequestOptions } from '@xsai/shared'

export interface ChatProvider<T = string> {
  chat: (model: (string & {}) | T) => CommonRequestOptions
}

export interface ChatProviderWithExtraOptions<T = string, T2 = undefined> {
  chat: (model: (string & {}) | T, extraOptions?: T2) => CommonRequestOptions & Partial<T2>
}

export type CreateProviderOptions = Omit<CommonRequestOptions, 'model'>

export interface EmbedProvider<T = string> {
  embed: (model: (string & {}) | T) => CommonRequestOptions
}

export interface EmbedProviderWithExtraOptions<T = string, T2 = undefined> {
  embed: (model: (string & {}) | T, extraOptions?: T2) => CommonRequestOptions & Partial<T2>
}

export interface ImageProvider<T = string> {
  image: (model: (string & {}) | T) => CommonRequestOptions
}

export interface ModelProvider {
  model: () => CreateProviderOptions
}

export interface ModelProviderWithExtraOptions<T = undefined> {
  model: (options?: T) => CreateProviderOptions & Partial<T>
}

export interface SpeechProvider<T = string> {
  speech: (model: (string & {}) | T) => CommonRequestOptions
}

export interface SpeechProviderWithExtraOptions<T = string, T2 = undefined> {
  speech: (model: (string & {}) | T, extraOptions?: T2) => CommonRequestOptions & Partial<T2>
}

export interface TranscriptionProvider<T = string> {
  transcription: (model: (string & {}) | T) => CommonRequestOptions
}

export interface TranscriptionProviderWithExtraOptions<T = string, T2 = undefined> {
  transcription: (model: (string & {}) | T, extraOptions?: T2) => CommonRequestOptions & Partial<T2>
}
