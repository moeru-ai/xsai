import type { GenerateTranscriptionOptions } from '@xsai/generate-transcription'
import type { CommonRequestOptions, WithUnknown } from '@xsai/shared'

import { DelayedPromise, requestBody, requestHeaders, requestURL, responseCatch, responseJSON } from '@xsai/shared'

import { transformChunk } from './internal/_transform-chunk'

export interface StreamTranscriptionDelta {
  delta: string
  type: StreamTranscriptionDeltaType
}

export type StreamTranscriptionDeltaType = 'transcription.text.delta' | 'transcription.text.done'
export interface StreamTranscriptionOptions extends GenerateTranscriptionOptions {
  responseFormat?: never
  stream?: never

  timestampGranularities?: never
}

export interface StreamTranscriptionResult {
  fullStream: ReadableStream<StreamTranscriptionDelta>
  fullText: DelayedPromise<string>
  textStream: ReadableStream<string>
}

export const streamTranscription = (options: WithUnknown<StreamTranscriptionOptions>): StreamTranscriptionResult => {
  let textStreamCtrl: ReadableStreamDefaultController<string> | undefined
  let fullStreamCtrl: ReadableStreamDefaultController<StreamTranscriptionDelta> | undefined
  const fullStream = new ReadableStream<StreamTranscriptionDelta>({ start: controller => fullStreamCtrl = controller })
  const textStream = new ReadableStream<string>({ start: controller => textStreamCtrl = controller })
  const fullText = new DelayedPromise<string>()
  let text = ''

  const doStream = async () => {
    const { body: stream } = await (options.fetch ?? globalThis.fetch)(requestURL('audio/transcriptions', options.baseURL), {
      body: requestBody(options),
      headers: requestHeaders(options.headers, options.apiKey),
      method: 'POST',
      signal: options.abortSignal,
    })

    await stream!
      .pipeThrough(transformChunk())
      .pipeTo(new WritableStream({
        abort: (reason) => {
          fullStreamCtrl?.error(reason)
          textStreamCtrl?.error(reason)
        },
        close: () => {},
        write: (chunk) => {
          if (chunk.type === 'transcription.text.delta') {
            textStreamCtrl?.enqueue(chunk.delta)
            text += chunk.delta
            fullStreamCtrl?.enqueue(chunk)
          }
          else if (chunk.type === 'transcription.text.done') {
            // TODO: handle usage
          }
        },
      }))
  }

  void (async () => {
    try {
      await doStream()
    }
    catch (err) {
      fullStreamCtrl?.error(err)
      textStreamCtrl?.error(err)
      fullText.reject(err)
    }
    finally {
      fullText.resolve(text)
      fullStreamCtrl?.close()
      textStreamCtrl?.close()
    }
  })()
  return {
    fullStream,
    fullText,
    textStream,
  }
}
