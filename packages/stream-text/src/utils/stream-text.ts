import type {
  // GenerateTextResult,
  FinishReason,
  GenerateTextOptions,
} from '@xsai/generate-text'

import { clean, objCamelToSnake, requestUrl } from '@xsai/shared'

import type { Tool } from '../types/internal/tool'

// export interface StreamTextResult extends GenerateTextResult {
export interface StreamTextResult {
  textStream: ReadableStream<string>
  // textStream: AsyncIterable<string> & ReadableStream<string>
}

export interface StreamTextResponse {
  choices: {
    delta: {
      content: string
      role: 'assistant'
    }
    finish_reason?: FinishReason
    index: number
  }[]
  created: number
  id: string
  model: string
  object: 'chat.completion.chunk'
  system_fingerprint: string
}

/**
 * @experimental
 * WIP, currently only returns `textStream`, does not support function calling (tools).
 */
export const streamText = async (options: GenerateTextOptions): Promise<StreamTextResult> =>
  await fetch(requestUrl(options.path ?? 'chat/completions', options.base), {
    body: JSON.stringify(clean({
      ...objCamelToSnake(options),
      abortSignal: undefined,
      base: undefined,
      headers: undefined,
      path: undefined,
      stream: true,
      tools: (options.tools as Tool[] | undefined)?.map(tool => ({
        function: tool.function,
        type: 'function',
      })),
    })),
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    method: 'POST',
    signal: options.abortSignal,
  })
    .then((res) => {
      const decoder = new TextDecoder()

      const transformStream = new TransformStream({
        transform: (chunk, controller) => {
          for (const line of decoder.decode(chunk).split('\n')) {
            if (line.startsWith('data: ') && line !== 'data: [DONE]') {
              const data = JSON.parse(line.slice(6)) as StreamTextResponse
              controller.enqueue(data.choices[0].delta.content)
            }
            else if (line === 'data: [DONE]') {
              controller.terminate()
            }
          }
        },
      })

      const textStream = res.body!.pipeThrough(transformStream)

      return { textStream }
    })
