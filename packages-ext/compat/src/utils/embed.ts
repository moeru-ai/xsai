import type { CommonRequestOptions, EmbedManyOptions as XSAIEmbedManyOptions, EmbedOptions as XSAIEmbedOptions } from 'xsai'

import { embed as xsaiEmbed, embedMany as xsaiEmbedMany } from 'xsai'

// @ts-expect-error unused generics
// eslint-disable-next-line unused-imports/no-unused-vars
export interface EmbeddingModel<T> extends CommonRequestOptions {}

export interface EmbedManyOptions extends Omit<XSAIEmbedManyOptions, 'input' | 'model'> {
  model: EmbeddingModel<string>
  values: XSAIEmbedManyOptions['input']
}

export interface EmbedOptions extends Omit<XSAIEmbedOptions, 'input' | 'model'> {
  model: EmbeddingModel<string>
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
