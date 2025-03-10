import {
  createChatProvider,
  createEmbedProvider,
  createMetadataProvider,
  createModelProvider,
  createSpeechProvider,
  createTranscriptionProvider,
  merge,
} from '@xsai-ext/shared-providers'

interface CreateAzureOptions {
  /**
   * The static API key or AD access token fetcher for authorization.
   *
   * If passed in as a function, it is treated as an accessTokenFetcher.
   */
  apiKey: (() => Promise<string> | string) | string
  /**
   * The Azure API version to use (`api-version` param).
   *
   * @default '2024-05-01-preview'
   */
  apiVersion?: string
  /** Azure resource name. */
  resourceName: string
}

/**
 * For Azure AI services, you can have multiple deployments of the same model with different names.
 *
 * Please pass your deployment name as the `model` parameter. By default, Azure will use the model name as the deployment name when deploying a model.
 *
 * @see {@link https://ai.azure.com/explore/models}
 */
export const createAzure = async (options: CreateAzureOptions) => {
  const headers = typeof options.apiKey === 'string'
    ? { 'api-key': options.apiKey }
    : undefined

  const baseURL = `https://${options.resourceName}.services.ai.azure.com/models/`
  const fetch: typeof globalThis.fetch = async (input, init) => {
    // If the input is a string, it is the URL, otherwise it is an object with a url property
    const inputIsURL = typeof input === 'string' || !('url' in input)

    // Add the api-version query parameter to the URL
    const url = new URL(inputIsURL ? input : input.url)
    url.searchParams.set('api-version', options.apiVersion ?? '2024-05-01-preview')
    const urlString = url.toString()

    // Add credential header
    if (typeof options.apiKey === 'function') {
      const token = `Bearer ${await options.apiKey()}`

      init ??= {}
      init.headers ??= {}

      if (Array.isArray(init.headers)) {
        init.headers.push(['Authorization', token])
      }
      else if (init.headers instanceof globalThis.Headers) {
        init.headers.append('Authorization', token)
      }
      else {
        init.headers.Authorization = token
      }
    }

    return globalThis.fetch(inputIsURL ? urlString : { ...input, url: urlString }, init)
  }

  return merge(
    createMetadataProvider('azure'),
    createChatProvider<
      | 'Cohere-command-r'
      | 'Cohere-command-r-plus'
      | 'DeepSeek-R1'
      | 'DeepSeek-R1-Distilled-NPU-Optimized'
      | 'DeepSeek-V3'
      | 'gpt-4o'
      | 'gpt-4o-mini'
      | 'Llama-3.2-11B-Vision-Instruct'
      | 'Llama-3.2-90B-Vision-Instruct'
      | 'Llama-3.3-70B-Instruct'
      | 'Mistral-large'
      | 'Mistral-small'
      | 'o1'
      | 'o1-mini'
      | 'o1-preview'
      | 'o3-mini'
      | 'Phi-3.5-mini-instruct'
      | 'Phi-3.5-MoE-instruct'
      | 'Phi-3.5-vision-instruct'
      | 'Phi-4'
      | 'Phi-4-mini-instruct'
      | 'Phi-4-multimodal-instruct'
    >({ baseURL, fetch, headers }),
    createEmbedProvider<
      | 'Cohere-embed-v3-english'
      | 'Cohere-embed-v3-multilingual'
      | 'text-embedding-3-large'
      | 'text-embedding-3-small'
      | 'text-embedding-ada-002'
    >({ baseURL, fetch, headers }),
    createSpeechProvider<
      | 'tts'
      | 'tts-hd'
    >({ baseURL, fetch, headers }),
    createTranscriptionProvider<
      | 'openai-whisper-large'
      | 'openai-whisper-large-v3'
      | 'whisper'
    >({ baseURL, fetch, headers }),
    createModelProvider({ baseURL, fetch, headers }),
  )
}
