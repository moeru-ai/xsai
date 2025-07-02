import type { ChatOptions, Tool } from '@xsai/shared-chat'

import { objCamelToSnake } from '@xsai/shared'
import { chat } from '@xsai/shared-chat'

import type { StreamTextChunkResult } from './_transform-chunk'

import { transformChunk } from './_transform-chunk'
import { transformText } from './_transform-text'

export interface StreamTextOptions extends ChatOptions {
  /** @default 1 */
  maxSteps?: number
  /**
   * If you want to disable stream, use `@xsai/generate-{text,object}`.
   */
  stream?: never
  streamOptions?: {
    /**
     * Return usage.
     * @default `undefined`
     */
    includeUsage?: boolean
  }
  tools?: Tool[]
}

export interface StreamTextResult {
  chunkStream: ReadableStream<StreamTextChunkResult>
  // stepStream: ReadableStream<StreamTextStep>
  textStream: ReadableStream<string>
}

export const streamText = async (options: StreamTextOptions): Promise<StreamTextResult> => {
  const res = await chat({
    ...options,
    maxSteps: undefined,
    stream: true,
    streamOptions: options.streamOptions != null
      ? objCamelToSnake(options.streamOptions)
      : undefined,
  })

  const rawChunkStream = res.body!.pipeThrough(transformChunk())

  const [chunkStream, rawTextStream] = rawChunkStream.tee()

  const textStream = rawTextStream.pipeThrough(transformText())

  return { chunkStream, textStream }
}
