import {
  createChatProvider,
  createEmbedProvider,
  createModelProvider,
  merge,
} from '@xsai-ext/shared-providers'

export const createGoogleGenerativeAI = (apiKey: string, baseURL = 'https://generativelanguage.googleapis.com/v1beta/openai/') => merge(
  /** @see {@link https://aistudio.google.com/u/1/prompts/new_chat} */
  createChatProvider<
    | 'gemini-2.0-flash'
    | 'gemini-2.0-flash-lite-preview-02-05'
    | 'gemini-2.0-flash-thinking-exp-01-21'
    | 'gemini-2.0-pro-exp-02-05'
    | 'gemma-2-2b-it'
    | 'gemma-2-9b-it'
    | 'gemma-2-27b-it'
  >({ apiKey, baseURL }),
  createEmbedProvider<'text-embedding-004'>({ apiKey, baseURL }),
  createModelProvider({ apiKey, baseURL }),
)
