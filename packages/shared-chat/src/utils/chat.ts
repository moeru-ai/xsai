import { requestBody, requestHeaders, requestURL, responseCatch } from '@xsai/shared'

import type { ChatOptions } from '../types'

export const chat = async <T extends ChatOptions>(options: T) =>
  await (options.fetch ?? globalThis.fetch)(requestURL('chat/completions', options.baseURL), {
    body: requestBody({
      ...options,
      tools: options.tools?.map(tool => ({
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
