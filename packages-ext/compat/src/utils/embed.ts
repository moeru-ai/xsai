import type { CommonRequestOptions, EmbedManyOptions as XSAIEmbedManyOptions, EmbedOptions as XSAIEmbedOptions } from 'xsai'

import { embed as xsaiEmbed, embedMany as xsaiEmbedMany } from 'xsai'

import type { EmbeddingModel } from '../types'

interface EmbedManyOptions extends Omit<XSAIEmbedManyOptions, 'input' | keyof CommonRequestOptions> {
  model: EmbeddingModel
  values: XSAIEmbedManyOptions['input']
}

interface EmbedOptions extends Omit<XSAIEmbedOptions, 'input' | keyof CommonRequestOptions> {
  model: EmbeddingModel
  value: XSAIEmbedOptions['input']
}

export const embed = async (options: EmbedOptions) => xsaiEmbed({
  ...options.model,
  input: options.value,
})

export const embedMany = async (options: EmbedManyOptions) => xsaiEmbedMany({
  ...options.model,
  input: options.values,
})

export type {
  EmbedManyResult,
  EmbedResult,
} from 'xsai'
