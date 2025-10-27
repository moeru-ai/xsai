import { createChatProvider, createModelProvider, merge } from '@xsai-ext/shared-providers'

import type { CerebrasModels } from '../../generated/types'

/**
 * Create a Cerebras Provider
 * @see {@link https://inference-docs.cerebras.ai/resources/openai}
 */
export const createCerebras = (apiKey: string, baseURL = 'https://api.cerebras.ai/v1/') => merge(
  createChatProvider<CerebrasModels>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)
