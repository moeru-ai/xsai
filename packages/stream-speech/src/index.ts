import type { CommonRequestOptions, WithUnknown } from '@xsai/shared'
import type { Usage } from '@xsai/shared-chat'

import { DelayedPromise, postJSON } from '@xsai/shared'
import { EventSourceParserStream, JsonMessageTransformStream } from '@xsai/shared-stream'

export interface StreamSpeechDelta {
  audio: string
  type: 'speech.audio.delta'
}

export interface StreamSpeechDone {
  type: 'speech.audio.done'
  usage?: {
    input_tokens: number
    output_tokens: number
    total_tokens: number
  }
}

export type StreamSpeechEvent = StreamSpeechDelta | StreamSpeechDone

export interface StreamSpeechOptions extends CommonRequestOptions {
  /** The text to generate audio for.  */
  input: string
  /** Control the voice of your generated audio with additional instructions. */
  instructions?: string
  /**
   * The format to audio in.
   * @default `mp3`
   */
  responseFormat?: 'aac' | 'flac' | 'mp3' | 'opus' | 'pcm' | 'wav'
  /**
   * The speed of the generated audio.
   * @default 1.0
   */
  speed?: number
  /** If you want to disable stream, use `@xsai/generate-speech`. */
  streamFormat?: never
  /** The voice to use when generating the audio. */
  voice: string
}

export interface StreamSpeechResult {
  fullStream: ReadableStream<Uint8Array>
  usage: Promise<undefined | Usage>
}

/** @experimental */
export const streamSpeech = async (options: WithUnknown<StreamSpeechOptions>): Promise<StreamSpeechResult> => {
  const usage = new DelayedPromise<undefined | Usage>()
  let usageResolved = false

  const response = await postJSON('audio/speech', {
    ...options,
    streamFormat: 'sse',
  })

  const fullStream = response.body!
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(new EventSourceParserStream())
    .pipeThrough(new JsonMessageTransformStream<StreamSpeechEvent>())
    .pipeThrough(new TransformStream<StreamSpeechEvent, Uint8Array>({
      flush: () => {
        if (usageResolved)
          return

        usageResolved = true
        usage.resolve(undefined)
      },
      transform: (chunk, controller) => {
        try {
          switch (chunk.type) {
            case 'speech.audio.delta':
              controller.enqueue(Uint8Array.fromBase64(chunk.audio))
              break
            case 'speech.audio.done':
              if (chunk.usage != null) {
                usage.resolve({
                  inputTokens: chunk.usage.input_tokens,
                  outputTokens: chunk.usage.output_tokens,
                  totalTokens: chunk.usage.total_tokens,
                })
                usageResolved = true
              }
              break
          }
        }
        catch (error) {
          if (!usageResolved) {
            usageResolved = true
            usage.reject(error)
          }

          throw error
        }
      },
    }))

  return {
    fullStream,
    usage: usage.promise,
  }
}
