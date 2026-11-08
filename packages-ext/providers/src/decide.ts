import type { ModelOptions, Provider } from './types'

import { decisions, systemone } from '@xsai/decide'

import { connect } from './utils/connect'

/** Prefers Decisions, then SystemOne. */
export const decisionModel = <TModel extends string>(
  provider: Provider<TModel>,
  model: (string & {}) | TModel,
  options: ModelOptions<'decisions' | 'systemone'> = {},
): ReturnType<typeof decisions> => connect({ decisions, systemone }, ['decisions', 'systemone'], provider, model, options)
