import type { AnthropicModels } from '../../generated/types'

import {
  createChatProviderWithExtraOptions,
  createModelProvider,
  merge,
} from '@xsai-ext/shared-providers'

export interface AnthropicOptions {
  /** @see {@link https://docs.claude.com/en/api/openai-sdk#extended-thinking-support} */
  thinking?: {
    budget_tokens: number
    type: 'enabled'
  }
}

/**
 * Create a Anthropic Provider
 * @see {@link https://docs.claude.com/en/api/openai-sdk}
 */
export const createAnthropic = (apiKey: string, baseURL = 'https://api.anthropic.com/v1/') => merge(
  createChatProviderWithExtraOptions<AnthropicModels, AnthropicOptions>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)
