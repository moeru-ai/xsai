import { chatCompletion, type ChatCompletionOptions, type FinishReason } from '@xsai/shared-chat'

export interface StreamTextOptions extends ChatCompletionOptions {
  /** if you want to disable stream, use `@xsai/generate-text` */
  stream?: never
  streamOptions?: {
    /**
     * Return usage.
     * @default `undefined`
     * @remarks Ollama doesn't support this, see {@link https://github.com/ollama/ollama/issues/5200}
     */
    usage?: boolean
  }
}

export interface StreamTextResponseUsage {
  completion_tokens: number
  prompt_tokens: number
  total_tokens: number
}

export interface StreamTextResult {
  chunkStream: ReadableStream<StreamTextResponse>
  finishReason?: FinishReason
  textStream: ReadableStream<string>
  usage?: StreamTextResponseUsage
}

// TODO: improve chunk type
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
  usage?: StreamTextResponseUsage
}

const dataHeaderPrefix = 'data: '
const dataErrorPrefix = `{"error":`

/**
 * @experimental WIP, does not support function calling (tools).
 */
export const streamText = async (options: StreamTextOptions): Promise<StreamTextResult> =>
  await chatCompletion({
    ...options,
    stream: true,
  })
    .then((res) => {
      if (!res.body) {
        return Promise.reject(res)
      }

      const decoder = new TextDecoder()

      let finishReason: string | undefined
      let usage: StreamTextResponseUsage | undefined
      let buffer = ''

      const rawChunkStream = res.body.pipeThrough(new TransformStream({
        transform: (chunk, controller) => {
          buffer += decoder.decode(chunk)
          const lines = buffer.split('\n\n')
          buffer = lines.pop() || ''

          for (const line of lines) {
            // Some cases:
            // - Empty chunk
            // - :ROUTER PROCESSING from OpenRouter
            if (!line || !line.startsWith(dataHeaderPrefix)) {
              continue
            }

            if (line.startsWith(dataErrorPrefix)) {
              // About controller error: https://developer.mozilla.org/en-US/docs/Web/API/TransformStreamDefaultController/error
              controller.error(new Error(`Error from server: ${line}`))
              continue
            }

            const lineWithoutPrefix = line.slice(dataHeaderPrefix.length)
            if (lineWithoutPrefix === '[DONE]') {
              controller.terminate()
              continue
            }

            const data: StreamTextResponse = JSON.parse(lineWithoutPrefix)
            controller.enqueue(data)

            if (data.choices[0].finish_reason) {
              finishReason = data.choices[0].finish_reason
            }
            if (data.usage) {
              usage = data.usage
            }
          }
        },
      }))

      const [chunkStream, rawTextStream] = rawChunkStream.tee()

      const textStream = rawTextStream.pipeThrough(new TransformStream({
        transform: (chunk, controller) => controller.enqueue(chunk.choices[0].delta.content),
      }))

      return { chunkStream, finishReason, textStream, usage }
    })

export default streamText
