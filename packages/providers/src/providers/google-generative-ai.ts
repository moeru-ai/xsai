import type { ChatProvider, EmbedProvider, ModelProvider, ProviderOptions, ProviderResult } from '../types'

import { generateCRO } from '../utils/generate-cro'

export const createGoogleGenerativeAI = (userOptions: ProviderOptions<true>):
  /** @see {@link https://aistudio.google.com/u/1/prompts/new_chat} */
  ChatProvider<
    // gemini 1.5
    'gemini-1.5-flash' | 'gemini-1.5-flash-8b' | 'gemini-1.5-pro' |
    // preview
    'gemini-2.0-flash-exp' | 'gemini-2.0-flash-thinking-exp-1219' | 'gemini-exp-1206' |
    // gemma
    'gemma-2-2b-it' | 'gemma-2-9b-it' | 'gemma-2-27b-it' |
    // preview
    'lernlm-1.5-pro-experimental'
  >
  & EmbedProvider<'text-embedding-004'>
  & ModelProvider => {
  const options: ProviderResult = {
    ...userOptions,
    baseURL: userOptions.baseURL ?? new URL('https://generativelanguage.googleapis.com/v1beta/openai/'),
  }

  const result = (model: string) => generateCRO(model, options)

  return {
    chat: result,
    embed: result,
    model: () => options,
  }
}
