import type { Fetch } from '@xsai/shared'

import {
  createChatProvider,
  createEmbedProvider,
  createMetadataProvider,
  createModelProvider,
  createSpeechProvider,
  createTranscriptionProvider,
  merge,
} from '@xsai-ext/shared-providers'

export interface CreateAzureOptions {
  /**
   * The static API key or AD access token fetcher for authorization.
   *
   * If passed in as a function, it is treated as an accessTokenFetcher.
   *
   * @see {@link https://learn.microsoft.com/en-us/azure/api-management/api-management-authenticate-authorize-azure-openai}
   */
  apiKey: (() => Promise<string> | string) | string
  /**
   * The Azure API version to use (`api-version` param).
   *
   * Notice: Different deployment over different time may have different API versions, please
   * follow the exact prompt from either [Azure AI Foundry](https://ai.azure.com/) or Azure OpenAI service
   * to get the correct API version from the Azure OpenAI Service endpoint.
   *
   * On Azure AI Foundry portal, you can go to https://ai.azure.com/build/overview > Choose the project >
   * Overview > Endpoints and keys > Included capabilities > Azure OpenAI Service to get the correct endpoint.
   *
   * @see {@link https://learn.microsoft.com/en-us/azure/ai-services/openai/reference#rest-api-versioning}
   */
  apiVersion?: string
  /**
   * Azure resource name.
   *
   * On Azure AI Foundry portal, you can go to https://ai.azure.com/build/overview > Choose the project >
   * Overview > Endpoints and keys > Included capabilities > Azure OpenAI Service to get the correct endpoint.
   *
   * @see {@link https://learn.microsoft.com/en-us/azure/ai-services/openai/reference#uri-parameters}
   */
  resourceName: string
}

/**
 * For Azure AI services, you can have multiple deployments of the same model with different names.
 *
 * Please pass your deployment name as the `model` parameter. By default, Azure will use the model name
 * as the deployment name when deploying a model.
 *
 * @see {@link https://ai.azure.com/explore/models} and
 * {@link https://learn.microsoft.com/en-us/azure/ai-foundry/model-inference/concepts/endpoints?tabs=rest#routing}
 */
export const createAzure = async (options: CreateAzureOptions) => {
  const headers = typeof options.apiKey === 'string'
    ? { 'api-key': options.apiKey }
    : undefined

  // More reference about how the URL concatenation works:
  // https://learn.microsoft.com/en-us/azure/ai-foundry/model-inference/how-to/inference?tabs=python#endpoints
  //
  // Vercel AI SDK implemented it like this:
  // https://sdk.vercel.ai/providers/ai-sdk-providers/azure
  //
  // For *.openai.azure.com, you can learn more here:
  // https://learn.microsoft.com/en-us/azure/ai-services/openai/reference
  const baseURL = `https://${options.resourceName}.services.ai.azure.com/models/`
  const fetch: Fetch = async (input, init) => {
    if (options.apiVersion != null)
      input.searchParams.set('api-version', options.apiVersion)

    // For the extra steps to obtain the bearer token, please refer to the following links:
    // https://learn.microsoft.com/en-us/azure/api-management/api-management-authenticate-authorize-azure-openai
    // https://learn.microsoft.com/en-us/azure/ai-services/openai/reference#authentication
    if (options.apiKey) {
      const token = `Bearer ${typeof options.apiKey === 'function' ? await options.apiKey() : options.apiKey}`

      init.headers ??= {}
      if (Array.isArray(init.headers))
        init.headers.push(['Authorization', token])
      else if (init.headers instanceof Headers)
        init.headers.append('Authorization', token)
      else
        init.headers.Authorization = token
    }

    return globalThis.fetch(input, init)
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
