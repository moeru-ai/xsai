import type { CommonRequestOptions } from '@xsai/shared'

import { requestBody, requestHeaders, requestURL, responseCatch } from '@xsai/shared'

import type { Message, Tool, ToolChoice } from '../types'

/** @see {@link https://platform.openai.com/docs/api-reference/chat/create} */
export interface ChatOptions extends CommonRequestOptions {
  [key: string]: unknown
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
  /** @default 1 */
  topP?: number
}

export const chat = async <T extends ChatOptions>(options: T) =>
  (options.fetch ?? globalThis.fetch)(requestURL('chat/completions', options.baseURL), {
    body: requestBody({
      ...options,
      tools: (options.tools as Tool[] | undefined)?.map(tool => ({
        function: tool.function,
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
