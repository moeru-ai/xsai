import {
  createChatProvider,
  createEmbedProvider,
  createModelProvider,
  merge,
} from '@xsai-ext/shared-providers'

/** @see {@link https://ollama.com/} */
export const createOllama = (baseURL = 'http://localhost:11434/v1/') => merge(
  /** @see {@link https://ollama.com/models} */
  createChatProvider<
    | 'gemma2'
    | 'llama3.1'
    | 'llama3.2'
    | 'llama3.2-vision'
    | 'llama3.3'
    | 'qwen2.5'
    | 'qwen2.5-coder'
    | 'qwq'
  >({ baseURL }),
  createEmbedProvider<'all-minilm' | 'mxbai-embed-large' | 'nomic-embed-text'>({ baseURL }),
  createModelProvider({ baseURL }),
)
