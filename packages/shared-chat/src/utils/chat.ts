import { requestBody, requestHeaders, requestURL } from '@xsai/shared'

import type { ChatOptions, Tool } from '../types'

export const chat = async <T extends ChatOptions>(options: T) =>
  await (options.fetch ?? globalThis.fetch)(requestURL('chat/completions', options.baseURL), {
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
  })
