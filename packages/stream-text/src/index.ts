import type {
  GenerateTextOptions,
  // GenerateTextResult,
} from '@xsai/generate-text'

import { clean, objCamelToSnake, requestUrl } from '@xsai/shared'

export interface StreamTextResult
// extends GenerateTextResult
{
  // textStream: AsyncIterable<string> & ReadableStream<string>
}

export const streamText = async (options: GenerateTextOptions): Promise<StreamTextResult> =>
  await fetch(requestUrl(options.path ?? 'chat/completions', options.base), {
    body: JSON.stringify(clean({
      ...objCamelToSnake(options),
      abortSignal: undefined,
      base: undefined,
      headers: undefined,
      path: undefined,
      stream: true,
    // tools: (options.tools as Tool[] | undefined)?.map(tool => ({
    //   function: tool.function,
    //   type: 'function',
    // })),
    })),
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    method: 'POST',
    signal: options.abortSignal,
  })
