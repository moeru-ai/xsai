import {
  createChatProvider,
  createModelProvider,
  merge,
} from '@xsai-ext/shared-providers'

import type { AnthropicModels } from '../../generated/types'

/**
 * Create a Anthropic Provider
 * @see {@link https://docs.claude.com/en/api/openai-sdk}
 */
export const createAnthropic = (apiKey: string, baseURL = 'https://api.anthropic.com/v1/') => merge(
  /** TODO: {@link https://docs.claude.com/en/api/openai-sdk#extended-thinking-support} */
  createChatProvider<AnthropicModels>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)
