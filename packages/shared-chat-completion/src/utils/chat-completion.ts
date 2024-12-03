import { objCamelToSnake, requestBody, requestHeaders } from '@xsai/shared'

import type { ChatCompletionOptions, Tool } from '../types'

export const chatCompletion = async <T extends ChatCompletionOptions>(options: T) => await fetch(options.url, {
  body: requestBody({
    ...objCamelToSnake(options),
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
