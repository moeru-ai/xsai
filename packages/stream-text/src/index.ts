import type {
  GenerateTextOptions,
  // GenerateTextResult,
} from '@xsai/generate-text'

import { clean, objCamelToSnake, requestUrl } from '@xsai/shared'

export interface StreamTextResult
// extends GenerateTextResult
{
  textStream: ReadableStream<string>
  // AsyncIterable<string> & ReadableStream<string>
}

export interface StreamTextResponse {
  choices: {
    delta: {
      content: string
      role: 'assistant'
    }
    finish_reason?: 'stop' | ({} & string)
    index: number
  }[]
  created: number
  id: string
  model: string
  object: 'chat.completion.chunk'
  system_fingerprint: string
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
    .then((res) => {
      const decoder = new TextDecoder()

      const transformStream = new TransformStream({
        transform: (chunk, controller) => {
          const text = decoder.decode(chunk)

          for (const line of text.split('\n')) {
            if (line.includes('[DONE]')) {
              controller.terminate()
              return
            }

            try {
              const data = JSON.parse(line.slice(6)) as StreamTextResponse
              controller.enqueue(data.choices[0].delta.content)
            }
            catch {}
          }
        },
      })

      const textStream = res.body!.pipeThrough(transformStream)

      return { textStream }
    })
