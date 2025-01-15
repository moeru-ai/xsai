import {
  chat,
  type ChatOptions,
  type FinishReason,
  type Usage,
} from '@xsai/shared-chat'

export interface StreamTextOptions extends ChatOptions {
  onChunk?: (chunk: StreamTextResponse) => Promise<void> | void
  /** if you want to disable stream, use `@xsai/generate-{text,object}` */
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

export interface StreamTextResult {
  chunkStream: ReadableStream<StreamTextResponse>
  finishReason?: FinishReason
  textStream: ReadableStream<string>
  usage?: Usage
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
  usage?: Usage
}

const chunkHeaderPrefix = 'data: '
const chunkErrorPrefix = `{"error":`

/**
 * @experimental WIP, does not support function calling (tools).
 */
export const streamText = async (options: StreamTextOptions): Promise<StreamTextResult> => await chat({
  ...options,
  stream: true,
}).then(async (res) => {
  const decoder = new TextDecoder()

  let finishReason: string | undefined
  let usage: undefined | Usage
  let buffer = ''

  // null body handled by import('@xsai/shared-chat').chat()
  const rawChunkStream = res.body!.pipeThrough(new TransformStream({
    transform: async (chunk, controller) => {
      buffer += decoder.decode(chunk)
      const lines = buffer.split('\n\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        // Some cases:
        // - Empty chunk
        // - :ROUTER PROCESSING from OpenRouter
        if (!line || !line.startsWith(chunkHeaderPrefix)) {
          continue
        }

        if (line.startsWith(chunkErrorPrefix)) {
          // About controller error: https://developer.mozilla.org/en-US/docs/Web/API/TransformStreamDefaultController/error
          controller.error(new Error(`Error from server: ${line}`))
          break
        }

        const lineWithoutPrefix = line.slice(chunkHeaderPrefix.length)
        if (lineWithoutPrefix === '[DONE]') {
          controller.terminate()
          break
        }

        const chunk: StreamTextResponse = JSON.parse(lineWithoutPrefix)
        controller.enqueue(chunk)

        if (options.onChunk)
          await options.onChunk(chunk)

        if (chunk.choices[0].finish_reason) {
          finishReason = chunk.choices[0].finish_reason
        }
        if (chunk.usage) {
          usage = chunk.usage
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
