import type { CommonRequestOptions } from 'xsai'

// @ts-expect-error unused generics
// eslint-disable-next-line unused-imports/no-unused-vars
interface EmbeddingModel<T = string> extends CommonRequestOptions {}

export type {
  EmbeddingModel,
  EmbeddingModel as EmbeddingModelV1,
  CommonRequestOptions as LanguageModel,
  CommonRequestOptions as LanguageModelV1,
}
