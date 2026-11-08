import type { ModelOptions, Provider } from './types'

import { generations } from '@xsai/image'

import { connect } from './utils/connect'

export const imageModel = <TModel extends string>(
  provider: Provider<TModel>,
  model: (string & {}) | TModel,
  options: ModelOptions<'generations'> = {},
): ReturnType<typeof generations> => connect({ generations }, ['generations'], provider, model, options)
