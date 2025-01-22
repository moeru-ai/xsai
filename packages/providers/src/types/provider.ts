import type { CommonRequestOptions } from '@xsai/shared'

export interface ChatProvider<T extends string = string> {
  // eslint-disable-next-line sonarjs/no-useless-intersection
  chat: (model: (string & {}) | T) => CommonRequestOptions
}

export interface EmbedProvider<T extends string = string> {
  // eslint-disable-next-line sonarjs/no-useless-intersection
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
    // eslint-disable-next-line sonarjs/no-useless-intersection
    ? (model: (string & {}) | T) => CommonRequestOptions
    // eslint-disable-next-line sonarjs/no-useless-intersection
    : (model: (string & {}) | T, extraOptions?: T2) => CommonRequestOptions & T2
}

export interface TranscriptionProvider<T extends string = string> {
  // eslint-disable-next-line sonarjs/no-useless-intersection
  transcription: (model: (string & {}) | T) => CommonRequestOptions
}
