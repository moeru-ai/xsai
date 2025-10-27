import { createChatProvider, createEmbedProvider, createModelProvider, merge } from '@xsai-ext/shared-providers'

import type { DeepinfraModels } from '../../generated/types'

/**
 * Create a DeepInfra Provider
 * @see {@link https://deepinfra.com/docs/openai_api}
 */
export const createDeepInfra = (apiKey: string, baseURL = 'https://api.deepinfra.com/v1/openai/') => merge(
  createChatProvider<DeepinfraModels>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
  createEmbedProvider({ apiKey, baseURL }),
)
