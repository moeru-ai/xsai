import {
  createChatProvider,
  createMetadataProvider,
  createModelProvider,
  merge,
} from '@xsai-ext/shared-providers'

/** @see {@link https://docs.anthropic.com/en/api/openai-sdk} */
export const createAnthropic = (apiKey: string, baseURL = 'https://api.anthropic.com/v1/') => merge(
  createMetadataProvider('anthropic'),
  /** @see {@link https://docs.anthropic.com/en/docs/about-claude/models/all-models} */
  createChatProvider<
    | 'claude-3-5-haiku-latest'
    | 'claude-3-5-sonnet-latest'
    | 'claude-3-7-sonnet-latest'
    | 'claude-3-opus-latest'
    /** TODO: {@link https://docs.anthropic.com/en/api/openai-sdk#extended-thinking-support} */
  >({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)
