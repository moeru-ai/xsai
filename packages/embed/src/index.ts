import { clean, type CommonRequestOptions, requestUrl } from '@xsai/shared'

export type EmbedModel = 'all-minilm' | 'mxbai-embed-large' | 'nomic-embed-text' | ({} & string)

export interface EmbedOptions extends CommonRequestOptions<'embeddings'> {
  [key: string]: unknown
  input: string | string[]
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
  request: Request
  response: Response
  usage: EmbedResponseUsage
}

export const embed = async (options: EmbedOptions) => {
  const request = new Request(requestUrl(options.path ?? 'embeddings', options.base), {
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

export default embed
