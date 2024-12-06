import type { CommonRequestOptions } from '@xsai/shared'

import type { CommonProviderOptions } from '../types/common-provider-options'

import { generateCRO } from '../utils/generate-cro'

type OllamaChatModel = 'gemma2' | 'llama3.1' | 'llama3.2' | 'llama3.2-vision' | 'mistral-nemo' | 'mistral-small' | 'nemotron' | 'qwen2.5' | 'qwen2.5-coder' | ({} & string)
type OllamaEmbeddingsModel = 'all-minilm' | 'mxbai-embed-large' | 'nomic-embed-text' | ({} & string)

export interface OllamaProvider {
  chat: (model: OllamaChatModel) => CommonRequestOptions
  embeddings: (model: OllamaEmbeddingsModel) => CommonRequestOptions
  models: () => CommonProviderOptions
}

export const createOllama = (userOptions?: Partial<CommonProviderOptions>): OllamaProvider => {
  const options: CommonProviderOptions = {
    ...userOptions,
    baseURL: userOptions?.baseURL ?? new URL('http://localhost:11434/v1/'),
  }

  const result = (model: string) => generateCRO(model, options)

  return {
    chat: result,
    embeddings: result,
    models: () => options,
  }
}

export const ollama = createOllama()
