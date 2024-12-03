import { type CommonRequestOptions, requestBody } from '@xsai/shared'

export interface EmbedOptions extends CommonRequestOptions {
  [key: string]: unknown
  input: string
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

export const embed = async (options: EmbedOptions): Promise<EmbedResult> =>
  await fetch(options.url, {
    body: requestBody(options),
    headers: {
      'Content-Type': 'application/json',
      ...(options.apiKey
        ? {
            Authorization: `Bearer ${options.apiKey}`,
          }
        : {}),
      ...options.headers,
    },
    method: 'POST',
    signal: options.abortSignal,
  })
    .then(res => res.json() as Promise<EmbedResponse>)
    .then(({ data, usage }) => ({
      embedding: data[0].embedding,
      input: options.input,
      usage,
    }))
