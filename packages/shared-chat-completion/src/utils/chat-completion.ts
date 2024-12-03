import { objCamelToSnake, requestBody } from '@xsai/shared'

import type { ChatCompletionOptions, Tool } from '../types'

export const chatCompletion = async <T extends ChatCompletionOptions>(options: T) => await fetch(options.url, {
  body: requestBody({
    ...objCamelToSnake(options),
    tools: (options.tools as Tool[] | undefined)?.map(tool => ({
      function: tool.function,
      type: 'function',
    })),
  }),
  headers: {
    'Content-Type': 'application/json',
    ...(options.apiKey
      ? {
          Authorization: `Bearer ${options.apiKey}`,
        }
      : {}),
    ...options.headers,
  },
  method: 'POST',
  signal: options.abortSignal,
})
