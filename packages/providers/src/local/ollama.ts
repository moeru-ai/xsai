import type { CommonRequestOptions } from '@xsai/shared'

import type { CommonProviderOptions } from '../types/common-provider-options'

import { generateCRO } from '../utils/generate-cro'

type OllamaChatModel = 'gemma2' | 'llama3.1' | 'llama3.2' | 'llama3.2-vision' | 'mistral-nemo' | 'mistral-small' | 'nemotron' | 'qwen2.5' | 'qwen2.5-coder' | ({} & string)
type OllamaEmbeddingsModel = 'all-minilm' | 'mxbai-embed-large' | 'nomic-embed-text' | ({} & string)

export interface OllamaProvider {
  chat: (model: OllamaChatModel) => CommonRequestOptions
  embeddings: (model: OllamaEmbeddingsModel) => CommonRequestOptions
}

export const createOllama = (userOptions?: CommonProviderOptions): OllamaProvider => {
  const options: CommonProviderOptions = {
    baseURL: new URL('http://localhost:11434/v1/'),
    ...userOptions,
  }

  return {
    chat: model => generateCRO(model, 'chat/completions', options),
    embeddings: model => generateCRO(model, 'embeddings', options),
  }
}

export const ollama = createOllama()
