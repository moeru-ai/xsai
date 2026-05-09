import type { CommonRequestOptions, WithUnknown } from '@xsai/shared'

import { postJSON, responseJSON } from '@xsai/shared'

export interface EmbedOptions extends CommonRequestOptions {
  /** The number of dimensions the resulting output embeddings should have. */
  dimensions?: number
  /** Input text to embed. */
  input: string
}

export interface EmbedResponse {
  data: {
    embedding: number[]
    index: number
    object: 'embedding'
  }[]
  model: string
  object: 'list'
  system_fingerprint?: string
  usage: EmbedResponseUsage
}

export interface EmbedResponseUsage {
  prompt_tokens: number
  total_tokens: number
}

export interface EmbedResult {
  embedding: number[]
  input: string
  usage: EmbedResponseUsage
}

export const embed = async (options: WithUnknown<EmbedOptions>): Promise<EmbedResult> =>
  postJSON('embeddings', options)
    .then(responseJSON<EmbedResponse>)
    .then(({ data, usage }) => ({
      embedding: data[0].embedding,
      input: options.input,
      usage,
    }))
