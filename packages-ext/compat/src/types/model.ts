import type { CommonRequestOptions } from 'xsai'

interface EmbeddingModel<_T = string> extends CommonRequestOptions {}

export type {
  EmbeddingModel,
  EmbeddingModel as EmbeddingModelV1,
  CommonRequestOptions as LanguageModel,
  CommonRequestOptions as LanguageModelV1,
}
