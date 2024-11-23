import { clean, type CommonRequestOptions, requestUrl } from '@xsai/shared'

export type EmbedModel = 'all-minilm' | 'mxbai-embed-large' | 'nomic-embed-text' | ({} & string)

export interface EmbedOptions extends CommonRequestOptions<'embeddings'> {
  [key: string]: unknown
  input: string
  model: EmbedModel
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
  input: string
  usage: EmbedResponseUsage
}

export const embed = async (options: EmbedOptions): Promise<EmbedResult> => {
  const { data, usage } = await fetch(requestUrl(options.path ?? 'embeddings', options.base), {
    body: JSON.stringify(clean({
      ...options,
      abortSignal: undefined,
      base: undefined,
      headers: undefined,
      path: undefined,
    })),
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    method: 'POST',
    signal: options.abortSingal,
  }).then(res => res.json() as Promise<EmbedResponse>)

  return {
    embedding: data[0].embedding,
    input: options.input,
    usage,
  }
}
