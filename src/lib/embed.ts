import type { EmbedModel } from './types/model'

import { clean } from '../utils/clean'
import { base, type CommonRequestOptions } from './common'

export interface EmbedOptions extends CommonRequestOptions {
  [key: string]: unknown
  input: string | string[]
  model: EmbedModel
  /** @default `embeddings` */
  path?: 'embeddings' | ({} & string)
}

export interface EmbedResponse {
  data: {
    embedding: number[]
    index: number
    object: 'embedding'
  }[]
  model: string
  object: 'list' | ({} & string)
  system_fingerprint?: string
  usage: EmbedResponseUsage
}

export interface EmbedResponseUsage {
  prompt_tokens: number
  total_tokens: number
}

export interface EmbedResult {
  embedding: number[]
  request: Request
  response: Response
  usage: EmbedResponseUsage
}

export const embed = async (options: EmbedOptions) => {
  const request = new Request(new URL(options.path ?? 'embeddings', options.base ?? base), {
    body: JSON.stringify(clean({
      ...options,
      base: undefined,
      headers: undefined,
      path: undefined,
    })),
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    method: 'POST',
  })

  const response = await fetch(request)

  const json = await response.json() as EmbedResponse

  return {
    embedding: json.data[0].embedding,
    request,
    response,
    usage: json.usage,
  }
}
