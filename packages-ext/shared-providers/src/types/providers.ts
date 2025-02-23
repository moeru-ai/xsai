import type { CommonRequestOptions } from '@xsai/shared'

import type { ProviderMetadata } from './metadata'

export interface ChatProvider<T = string> {
  // eslint-disable-next-line sonarjs/no-useless-intersection
  chat: (model: (string & {}) | T) => CommonRequestOptions
}

export interface ChatProviderWithExtraOptions<T = string, T2 = undefined> {
  // eslint-disable-next-line sonarjs/no-useless-intersection
  chat: (model: (string & {}) | T, extraOptions?: T2) => CommonRequestOptions & T2
}

export interface EmbedProvider<T = string> {
  // eslint-disable-next-line sonarjs/no-useless-intersection
  embed: (model: (string & {}) | T) => CommonRequestOptions
}

export interface MetadataProviders {
  metadata: ProviderMetadata
}

export interface ModelProvider {
  model: () => Omit<CommonRequestOptions, 'model'>
}

export interface SpeechProvider<T = string> {
  // eslint-disable-next-line sonarjs/no-useless-intersection
  speech: (model: (string & {}) | T) => CommonRequestOptions
}

export interface SpeechProviderWithExtraOptions<T = string, T2 = undefined> {
  // eslint-disable-next-line sonarjs/no-useless-intersection
  speech: (model: (string & {}) | T, extraOptions?: T2) => CommonRequestOptions & Partial<T2>
}

export interface TranscriptionProvider<T = string> {
  // eslint-disable-next-line sonarjs/no-useless-intersection
  transcription: (model: (string & {}) | T) => CommonRequestOptions
}
