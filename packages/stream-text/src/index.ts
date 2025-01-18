import {
  chat,
  type ChatOptions,
  type FinishReason,
  type Usage,
} from '@xsai/shared-chat'

// TODO: improve chunk type
export interface ChunkResult {
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

export interface StreamTextOptions extends ChatOptions {
  onChunk?: (chunk: ChunkResult) => Promise<void> | void
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
  chunkStream: ReadableStream<ChunkResult>
  finishReason?: FinishReason
  textStream: ReadableStream<string>
  usage?: Usage
}

const chunkHeaderPrefix = 'data:'

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

  /**
   * Process a single line of SSE data
   * @param line The line to process
   * @param controller The transform stream controller
   * @returns true if processing should stop (e.g. [DONE] or error)
   */
  const processLine = async (line: string, controller: TransformStreamDefaultController<ChunkResult>) => {
  // Skip empty lines
    if (!line)
      return
    // Skip comments
    if (line.startsWith(':'))
      return
    // Skip lines that don't start with "data:"
    if (!line.startsWith(chunkHeaderPrefix))
      return

    // Extract content after "data:" prefix
    const content = line.slice(chunkHeaderPrefix.length)
    // Remove leading single space if present
    const data = content.startsWith(' ') ? content.slice(1) : content

    // Handle special cases
    if (data === '[DONE]') {
      controller.terminate()
      return true
    }

    // TODO: should we use JSON.parse?
    if (data.startsWith('{') && data.includes('"error":')) {
      controller.error(new Error(`Error from server: ${data}`))
      return true
    }

    // Process normal chunk
    const chunk: ChunkResult = JSON.parse(data)
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

  let lastCharWasCarriageReturn = false
  let buffer = ''

  const rawChunkStream = res.body!.pipeThrough(new TransformStream({
    transform: async (chunk, controller) => {
      const text = decoder.decode(chunk, { stream: true })

      // Handle \r at the end of previous chunk
      if (lastCharWasCarriageReturn) {
        if (text.startsWith('\n')) {
          // It's a CRLF, remove the trailing \r from buffer
          buffer = buffer.slice(0, -1)
          // Skip the \n
          buffer += text.slice(1)
        }
        else {
          // Standalone \r, keep as is
          buffer += text
        }
        lastCharWasCarriageReturn = false
      }
      else {
        buffer += text
      }

      // Check if current chunk ends with \r
      if (buffer.endsWith('\r')) {
        lastCharWasCarriageReturn = true
      }
      const lines = buffer.split(/\r\n|\r|\n/)
      buffer = lines.pop() || ''

      // Process complete lines
      for (const line of lines) {
        const shouldBreak = await processLine(line, controller)
        if (shouldBreak)
          break
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
