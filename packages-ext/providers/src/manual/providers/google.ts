import {
  createChatProvider,
  createEmbedProvider,
  createModelProvider,
  merge,
} from '@xsai-ext/shared-providers'

import type { GoogleModels } from '../../generated/types'

/**
 * Create a Google Provider
 * @see {@link https://ai.google.dev/gemini-api/docs/pricing}
 */
export const createGoogleGenerativeAI = (apiKey: string, baseURL = 'https://generativelanguage.googleapis.com/v1beta/openai/') => merge(
  createChatProvider<GoogleModels>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
  createEmbedProvider({ apiKey, baseURL }),
)
