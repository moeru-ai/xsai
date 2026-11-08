import type { ModelOptions, Provider } from './types'

import { speech, transcriptions } from '@xsai/audio'

import { connect } from './utils/connect'

export const speechModel = <TModel extends string>(
  provider: Provider<TModel>,
  model: (string & {}) | TModel,
  options: ModelOptions<'speech'> = {},
): ReturnType<typeof speech> => connect({ speech }, ['speech'], provider, model, options)

export const transcriptionModel = <TModel extends string>(
  provider: Provider<TModel>,
  model: (string & {}) | TModel,
  options: ModelOptions<'transcriptions'> = {},
): ReturnType<typeof transcriptions> => connect({ transcriptions }, ['transcriptions'], provider, model, options)
