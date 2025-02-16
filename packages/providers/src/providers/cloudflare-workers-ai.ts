import type { ChatProvider, EmbedProvider, ProviderOptions, ProviderResult } from '../types'

import { generateCRO } from '../utils/generate-cro'

export const createWorkersAI = (userOptions: ProviderOptions<true> & { accountId: string }):
/** @see {@link https://developers.cloudflare.com/workers-ai/models/} */
  ChatProvider<
    | 'deepseek-math-7b-instruct'
    | 'deepseek-r1-distill-qwen-32b'
    | 'hermes-2-pro-mistral-7b'
    | 'llama-3.3-70b-instruct-fp8-fast'
  >
  & EmbedProvider<
    | 'bge-base-en-v1.5'
    | 'bge-large-en-v1.5'
    | 'bge-small-en-v1.5'
  > => {
  const options: ProviderResult = {
    ...userOptions,
    baseURL: userOptions.baseURL ?? new URL(`https://api.cloudflare.com/client/v4/accounts/${userOptions.accountId}/ai/v1/`),
  }

  const result = (model: string) => generateCRO(model, options)

  return {
    chat: result,
    embed: result,
  }
}
