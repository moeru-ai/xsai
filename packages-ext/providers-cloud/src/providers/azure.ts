import {
  createChatProvider,
  createEmbedProvider,
  createMetadataProvider,
  createModelProvider,
  createSpeechProvider,
  createTranscriptionProvider,
  merge,
} from '@xsai-ext/shared-providers'

/**
 * For Azure AI services, you can have multiple deployments of the same model with different names.
 *
 * Please pass your deployment name as the `model` parameter. By default, Azure will use the model name as the deployment name when deploying a model.
 *
 * @see {@link https://ai.azure.com/explore/models}
 */
export const createAzure = (apiKey: string, resourceName: string) => {
  const baseURL = `https://${resourceName}.services.ai.azure.com/models/`
  const headers = { 'api-key': apiKey }

  return merge(
    createMetadataProvider('azure'),
    createChatProvider<AzureChatModels>({ baseURL, headers }),
    createEmbedProvider<AzureTextEmbeddingModels>({ baseURL, headers }),
    createSpeechProvider<AzureSpeechModels>({ baseURL, headers }),
    createTranscriptionProvider<AzureTranscriptionModels>({ baseURL, headers }),
    createModelProvider({ baseURL, headers }),
  )
}

export type AzureChatModels =
  | 'AI21-Jamba-1.5-Large'
  | 'AI21-Jamba-1.5-Mini'
  | 'ALLaM-2-7b-instruct'
  | 'Cerence-CaLLM-Edge'
  | 'Codestral-2501'
  | 'Cohere-command-r'
  | 'Cohere-command-r-08-2024'
  | 'Cohere-command-r-plus'
  | 'Cohere-command-r-plus-08-2024'
  | 'databricks-dbrx-instruct'
  | 'DeepSeek-R1'
  | 'DeepSeek-R1-Distilled-NPU-Optimized'
  | 'DeepSeek-V3'
  | 'E.L.Y.Crop-Protection'
  | 'financial-reports-analysis'
  | 'gpt-4'
  | 'gpt-4-32k'
  | 'gpt-4.5-preview'
  | 'gpt-4o'
  | 'gpt-4o-mini'
  | 'gpt-35-turbo'
  | 'gpt-35-turbo-16k'
  | 'gpt-35-turbo-instruct'
  | 'Gretel-Navigator-Tabular'
  | 'jais-30b-chat'
  | 'Llama-2-7b-chat'
  | 'Llama-2-13b-chat'
  | 'Llama-2-70b-chat'
  | 'Llama-3.2-1B-Instruct'
  | 'Llama-3.2-3B-Instruct'
  | 'Llama-3.2-11B-Vision-Instruct'
  | 'Llama-3.2-90B-Vision-Instruct'
  | 'Llama-3.3-70B-Instruct'
  | 'Llama-Guard-3-1B'
  | 'Llama-Guard-3-8B'
  | 'Llama-Guard-3-11B-Vision'
  | 'Meta-Llama-3-8B-Instruct'
  | 'Meta-Llama-3-70B-Instruct'
  | 'Meta-Llama-3.1-8B-Instruct'
  | 'Meta-Llama-3.1-70B-Instruct'
  | 'Meta-Llama-3.1-405B-Instruct'
  | 'Ministral-3B'
  | 'Mistral-large'
  | 'Mistral-large-2407'
  | 'Mistral-Large-2411'
  | 'Mistral-Nemo'
  | 'Mistral-small'
  | 'mistralai-Mistral-7B-Instruct-v0-2'
  | 'mistralai-Mistral-7B-Instruct-v01'
  | 'mistralai-Mixtral-8x7B-Instruct-v01'
  | 'mistralai-Mixtral-8x22B-Instruct-v0-1'
  | 'o1'
  | 'o1-mini'
  | 'o1-preview'
  | 'o3-mini'
  | 'Phi-3-medium-4k-instruct'
  | 'Phi-3-medium-128k-instruct'
  | 'Phi-3-mini-4k-instruct'
  | 'Phi-3-mini-128k-instruct'
  | 'Phi-3-small-8k-instruct'
  | 'Phi-3-small-128k-instruct'
  | 'Phi-3-vision-128k-instruct'
  | 'Phi-3.5-mini-instruct'
  | 'Phi-3.5-MoE-instruct'
  | 'Phi-3.5-vision-instruct'
  | 'Phi-4'
  | 'Phi-4-mini-instruct'
  | 'Phi-4-multimodal-instruct'
  | 'RA-FT-Optix-Food-Beverage'
  | 'snowflake-arctic-instruct'
  | 'supply-chain-trade-regulations'
  | 'tsuzumi-7b'

export type AzureSpeechModels =
  | 'tts'
  | 'tts-hd'

export type AzureTextEmbeddingModels =
  | 'Cohere-embed-v3-english'
  | 'Cohere-embed-v3-multilingual'
  | 'text-embedding-3-large'
  | 'text-embedding-3-small'
  | 'text-embedding-ada-002'

export type AzureTranscriptionModels =
  | 'openai-whisper-large'
  | 'openai-whisper-large-v3'
  | 'whisper'
