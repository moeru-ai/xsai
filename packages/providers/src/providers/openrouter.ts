import { objCamelToSnake } from '@xsai/shared'

import type { ChatProvider, ModelProvider, ProviderOptions, ProviderResult } from '../types'

import { generateCRO } from '../utils/generate-cro'

export interface OpenRouterOptions {
  extraHeaders?: (Headers | Record<string, string>) & {
    'HTTP-Referer'?: string
    'X-Title'?: string
  }
  /**
   * Model routing
   *
   * @see {@link https://openrouter.ai/docs/features/model-routing}
   * @example
   * ```
   * {
   *   model: [ 'openai/gpt-1o' ],
   *   models: [ 'openai/gpt-4o', 'google/gemini-2.0-flash-001' ],
   *   messages: [
   *     { role: 'user', content: 'Hello, world!' },
   *   ]
   * }
   * ```
   */
  models?: string[]
  /**
   * Provider routing
   *
   * @see {@link https://openrouter.ai/docs/features/provider-routing}
   */
  provider?: {
    /**
     * Whether to allow backup providers when the primary is unavailable.
     *
     * @see {@link https://openrouter.ai/docs/features/provider-routing#disabling-fallbacks}
     * @default true
     * @example false
     */
    allowFallbacks?: boolean
    /**
     * Control whether to use providers that may store data.
     *
     * @see {@link https://openrouter.ai/docs/features/provider-routing#requiring-providers-to-comply-with-data-policies}
     * @default 'allow'
     */
    dataCollection?: 'allow' | 'deny'
    /**
     * List of provider names to skip for this request.
     *
     * @see {@link https://openrouter.ai/docs/features/provider-routing#ignoring-providers}
     */
    ignore?: string[]
    /**
     * List of provider names to try in order (e.g. ["Anthropic", "OpenAI"]).
     *
     * @see {@link https://openrouter.ai/docs/features/provider-routing#ordering-specific-providers}
     * @example [ 'Anthropic', 'OpenAI' ]
     */
    order?: string[]
    /**
     * List of quantization levels to filter by (e.g. ["int4", "int8"]).
     *
     * @see {@link https://openrouter.ai/docs/features/provider-routing#quantization}
     * @example [ 'int4', 'int8' ]
     */
    quantizations?: string[]
    /**
     * Only use providers that support all parameters in your request.
     *
     * @see {@link https://openrouter.ai/docs/features/provider-routing#requiring-providers-to-support-all-parameters-beta}
     */
    requireParameters?: boolean
    /**
     * Sort providers by price or throughput. (e.g. "price" or "throughput").
     *
     * @see {@link https://openrouter.ai/docs/features/provider-routing#provider-sorting}
     * @example 'price'
     */
    sort?: string
  }
  /**
   * To help with prompts that exceed the maximum context size of a model.
   *
   * All OpenRouter endpoints with 8k or less context length will default to using middle-out.
   * To disable this, set `transforms: []` in the request body.
   *
   * @see {@link https://openrouter.ai/docs/features/message-transforms}
   * @default 'middle-out'
   */
  transforms?: string[]
}

export const createOpenRouter = (userOptions: ProviderOptions<true>):
  /** @see {@link https://openrouter.ai/models} */
  ChatProvider<'anthropic/claude-3.5-sonnet' | 'google/gemini-2.0-flash-001' | 'google/gemini-flash-1.5-8b' | 'openai/gpt-4o' | 'openai/gpt-4o-mini' | 'openai/o1-mini' | 'openai/o1-preview', OpenRouterOptions>
  & ModelProvider => {
  const options: ProviderResult = {
    ...userOptions,
    baseURL: userOptions.baseURL ?? new URL('https://openrouter.ai/api/v1/'),
  }

  return {
    chat: (model, openRouterOptions) => {
      const requestOptions = generateCRO(model, options)

      const toOpenRouterOptions = ({ extraHeaders, models, provider }: OpenRouterOptions): Record<string, unknown> => {
        if (extraHeaders != null) {
          requestOptions.headers ??= {}
          Object.assign(requestOptions.headers, extraHeaders)
        }

        let transformedProvider: Record<string, unknown> | undefined
        if (provider != null) {
          transformedProvider = objCamelToSnake(provider)
        }

        return objCamelToSnake({
          models,
          provider: transformedProvider,
        })
      }

      return {
        ...(openRouterOptions ? toOpenRouterOptions(openRouterOptions) : {}),
        ...requestOptions,
      }
    },
    model: () => options,
  }
}
