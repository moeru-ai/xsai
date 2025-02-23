import { createChatProvider, createMetadataProvider, createModelProvider, defineProvider } from '@xsai-ext/shared-providers'

/** @see {@link https://github.com/missuo/claude2openai} */
export const createClaude2OpenAI = (apiKey: string, baseURL = 'http://localhost:6600/v1/') => defineProvider(
  createMetadataProvider('claude2openai'),
  /** @see {@link https://docs.anthropic.com/en/docs/about-claude/models#model-names} */
  createChatProvider<'claude-3-5-haiku-latest' | 'claude-3-5-sonnet-latest'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)
