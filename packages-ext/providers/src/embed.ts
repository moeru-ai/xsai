import type { ModelOptions, Provider } from './types'

import { embeddings } from '@xsai/embed'

import { connect } from './utils/connect'

export const embeddingModel = <TModel extends string>(
  provider: Provider<TModel>,
  model: (string & {}) | TModel,
  options: ModelOptions<'embeddings'> = {},
): ReturnType<typeof embeddings> => connect({ embeddings }, ['embeddings'], provider, model, options)
