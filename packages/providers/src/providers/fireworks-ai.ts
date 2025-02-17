import type { ChatProvider, EmbedProvider, ModelProvider, ProviderOptions, ProviderResult, TranscriptionProvider } from '../types'

import { generateCRO } from '../utils/generate-cro'

/**
 * Fireworks AI provider
 *
 * Fireworks AI is a generative AI inference platform to run and customize models with
 * industry-leading speed and production-readiness.
 *
 * Please keep in mind that for Transcribe Audio tasks, you will need to follow
 * the [documentation](https://docs.fireworks.ai/api-reference/audio-transcriptions)
 * to set the `baseUrl` to `https://audio-prod.us-virginia-1.direct.fireworks.ai/v1` since
 * they live in a different API endpoint.
 *
 * @see {@link https://docs.fireworks.ai/getting-started/introduction}
 */
export const createFireworksAI = (userOptions: ProviderOptions<true>):
  /** @see {@link https://docs.fireworks.ai/api-reference/introduction} */
  ChatProvider<
    | 'accounts/fireworks/models/deepseek-r1'
    | 'accounts/fireworks/models/deepseek-v3'
    | 'accounts/fireworks/models/llama-v3p2-11b-vision-instruct'
    | 'accounts/fireworks/models/llama-v3p2-90b-vision-instruct'
    | 'accounts/fireworks/models/llama-v3p3-70b-instruct'
    | 'accounts/fireworks/models/phi-3-vision-128k-instruct'
    | 'accounts/fireworks/models/qwen2p5-72b-instruct'
    | 'accounts/fireworks/models/qwen2p5-coder-32b-instruct'
    | 'accounts/fireworks/models/qwen-qwq-32b-preview'
  >
  & EmbedProvider<'nomic-ai/nomic-embed-text-v1.5'>
  & ModelProvider
  & TranscriptionProvider => {
  const options: ProviderResult = {
    ...userOptions,
    baseURL: userOptions.baseURL ?? new URL('https://api.fireworks.ai/inference/v1/'),
  }

  const result = (model: string) => generateCRO(model, options)

  return {
    chat: result,
    embed: result,
    model: () => options,
    transcription: result,
  }
}
