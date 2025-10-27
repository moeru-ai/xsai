import type { CommonRequestOptions, WithUnknown } from '@xsai/shared'

import { DelayedPromise, requestHeaders, requestURL, responseCatch } from '@xsai/shared'

import { transformChunk } from './internal/_transform-chunk'

export interface StreamTranscriptionDelta {
  delta: string
  type: StreamTranscriptionDeltaType
}

export type StreamTranscriptionDeltaType = 'transcript.text.delta' | 'transcript.text.done'

export interface StreamTranscriptionOptions extends CommonRequestOptions {
  file: Blob
  fileName?: string
  language?: string
  prompt?: string
  responseFormat?: never
  /**
   * If you want to disable stream, use `@xsai/generate-transcription`.
   */
  stream?: never
  temperature?: string
  timestampGranularities?: never
}

export interface StreamTranscriptionResult {
  fullStream: ReadableStream<StreamTranscriptionDelta>
  text: Promise<string>
  textStream: ReadableStream<string>
}

/** @experimental */
export const streamTranscription = (options: WithUnknown<StreamTranscriptionOptions>): StreamTranscriptionResult => {
  let textStreamCtrl: ReadableStreamDefaultController<string> | undefined
  let fullStreamCtrl: ReadableStreamDefaultController<StreamTranscriptionDelta> | undefined
  const fullStream = new ReadableStream<StreamTranscriptionDelta>({ start: controller => fullStreamCtrl = controller })
  const textStream = new ReadableStream<string>({ start: controller => textStreamCtrl = controller })
  const fullText = new DelayedPromise<string>()
  let text = ''

  const doStream = async () => {
    // Build FormData for file upload
    const body = new FormData()
    body.append('model', options.model)
    body.append('file', options.file, options.fileName)
    body.append('stream', 'true')

    if (options.language != null)
      body.append('language', options.language)

    if (options.prompt != null)
      body.append('prompt', options.prompt)

    if (options.temperature != null)
      body.append('temperature', options.temperature)

    const response = await (options.fetch ?? globalThis.fetch)(requestURL('audio/transcriptions', options.baseURL), {
      body,
      headers: requestHeaders(options.headers, options.apiKey),
      method: 'POST',
      signal: options.abortSignal,
    })

    // Check response status before processing
    await responseCatch(response)

    const { body: stream } = response

    await stream!
      .pipeThrough(transformChunk())
      .pipeTo(new WritableStream({
        abort: (reason) => {
          fullStreamCtrl?.error(reason)
          textStreamCtrl?.error(reason)
        },
        close: () => {},
        write: (chunk) => {
          if (chunk.type === 'transcript.text.delta') {
            textStreamCtrl?.enqueue(chunk.delta)
            text += chunk.delta
            fullStreamCtrl?.enqueue(chunk)
          }
          else if (chunk.type === 'transcript.text.done') {
            // TODO: handle usage
          }
        },
      }))
  }

  void (async () => {
    try {
      await doStream()
      fullText.resolve(text)
      fullStreamCtrl?.close()
      textStreamCtrl?.close()
    }
    catch (err) {
      fullStreamCtrl?.error(err)
      textStreamCtrl?.error(err)
      fullText.reject(err)
    }
  })()
  return {
    fullStream,
    text: fullText.promise,
    textStream,
  }
}
