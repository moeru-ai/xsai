import type { CommonProviderOptions } from '../types/common-provider-options'
import type { ProviderResult } from '../types/provider-result'

import { generateProviderResult } from '../utils/generate-provider-result'

type OllamaChatModel = 'gemma2' | 'llama3.1' | 'llama3.2' | 'llama3.2-vision' | 'mistral-nemo' | 'mistral-small' | 'nemotron' | 'qwen2.5' | 'qwen2.5-coder' | ({} & string)
type OllamaEmbeddingsModel = 'all-minilm' | 'mxbai-embed-large' | 'nomic-embed-text' | ({} & string)

export interface OllamaProvider {
  chat: (model: OllamaChatModel) => ProviderResult
  embeddings: (model: OllamaEmbeddingsModel) => ProviderResult
}

export const createOllama = (userOptions?: CommonProviderOptions): OllamaProvider => {
  const options: CommonProviderOptions = {
    baseURL: new URL('http://localhost:11434/v1/'),
    ...userOptions,
  }

  return {
    chat: model => generateProviderResult(model, 'chat/completions', options),
    embeddings: model => generateProviderResult(model, 'embeddings', options),
  }
}

export const ollama = createOllama()
