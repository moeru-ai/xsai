import type { ChatProvider, EmbedProvider, ModelProvider, ProviderOptions, ProviderResult } from '../types'

import { generateCRO } from '../utils/generate-cro'

export const createOllama = (userOptions?: ProviderOptions<false>):
  /** @see {@link https://ollama.com/search} */
  ChatProvider<'gemma2' | 'llama3.1' | 'llama3.2' | 'llama3.2-vision' | 'llama3.3' | 'qwen2.5' | 'qwen2.5-coder' | 'qwq' | (string & {})>
  & EmbedProvider<'all-minilm' | 'mxbai-embed-large' | 'nomic-embed-text' | (string & {})>
  & ModelProvider => {
  const options: ProviderResult = {
    ...userOptions,
    baseURL: userOptions?.baseURL ?? new URL('http://localhost:11434/v1/'),
  }

  const result = (model: string) => generateCRO(model, options)

  return {
    chat: result,
    embed: result,
    model: () => options,
  }
}

export const ollama = createOllama()
