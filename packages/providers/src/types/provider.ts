import type { CommonRequestOptions } from '@xsai/shared'

/** T: required apiKey */
export type ProviderOptions<T extends boolean = false> =
  T extends true
    ? Partial<Omit<ProviderResult, 'apiKey'>> & Required<Pick<ProviderResult, 'apiKey'>>
    : Partial<ProviderResult>

export type ProviderResult = Omit<CommonRequestOptions, 'model'> & Partial<Pick<CommonRequestOptions, 'model'>>

export interface ChatProvider<T extends string> {
  chat: (model: ({} & string) | T) => ProviderResult
}

export interface EmbeddingsProvider<T extends string> {
  embeddings: (model: ({} & string) | T) => ProviderResult
}

export interface ModelsProvider {
  models: () => ProviderResult
}
