import type { CommonRequestOptions, WithUnknown } from '@xsai/shared'

import { clean, requestBody, requestHeaders, requestURL, responseCatch } from '@xsai/shared'

import type { Message, Tool, ToolChoice } from '../types'

/** @see {@link https://platform.openai.com/docs/api-reference/chat/create} */
export interface ChatOptions extends CommonRequestOptions {
  /**
   * number between -2.0 and 2.0.
   * @default 0
   */
  frequencyPenalty?: number
  messages: Message[]
  /**
   * number between -2.0 and 2.0.
   * @default 0
   */
  presencePenalty?: number
  seed?: number
  /** up to 4 sequences where the API will stop generating further tokens. */
  stop?: [string, string, string, string ] | [string, string, string] | [string, string] | [string] | string
  /**
   * what sampling temperature to use, between 0 and 2.
   * @default 1
   */
  temperature?: number
  toolChoice?: ToolChoice
  tools?: Tool[]
  /** @default 1 */
  topP?: number
}

export const chat = async <T extends WithUnknown<ChatOptions>>(options: T) =>
  (options.fetch ?? globalThis.fetch)(requestURL('chat/completions', options.baseURL), {
    body: requestBody({
      ...options,
      tools: (options.tools)?.map(tool => ({
        function: clean({
          ...tool.function,
          returns: undefined,
        }),
        type: 'function',
      })),
    }),
    headers: requestHeaders({
      'Content-Type': 'application/json',
      ...options.headers,
    }, options.apiKey),
    method: 'POST',
    signal: options.abortSignal,
  }).then(responseCatch)
