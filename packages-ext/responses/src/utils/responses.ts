import type { CreateResponseBody } from '../generated'

import { requestBody, requestHeaders, requestURL, responseCatch, trampoline } from '@xsai/shared'
import { signal } from 'alien-signals'
import { EventSourceParserStream } from 'eventsource-parser/stream'

import { normalizeInput } from './normalize-input'
import { StreamingEventParserStream } from './streaming-event-parser-stream'

export interface ResponsesOptions extends Omit<CreateResponseBody, 'input'> {
  abortSignal?: AbortSignal
  apiKey?: string
  baseURL: string | URL
  fetch?: typeof globalThis.fetch
  headers?: Record<string, string>
  input: NonNullable<CreateResponseBody['input']>
}

export const responses = (options: ResponsesOptions) => {
  const input = signal(normalizeInput(structuredClone(options.input)))

  // output
  let textCtrl: ReadableStreamDefaultController<string> | undefined
  const textStream = new ReadableStream<string>({ start: controller => textCtrl = controller })

  const doStream = async () => {
    const res = await (options.fetch ?? globalThis.fetch)(requestURL('responses', options.baseURL), {
      body: requestBody({
        ...options,
        // TODO: tools
        input: input(),
        stream: true,
      }),
      headers: requestHeaders({
        'Content-Type': 'application/json',
        ...options.headers,
      }, options.apiKey),
      method: 'POST',
      signal: options.abortSignal,
    }).then(responseCatch)

    await res.body!
      .pipeThrough(new TextDecoderStream())
      .pipeThrough(new EventSourceParserStream())
      .pipeThrough(new StreamingEventParserStream())
      .pipeTo(new WritableStream({
        abort: (reason) => {
          textCtrl?.error(reason)
        },
        close: () => {},
        write: (event) => {
          // eslint-disable-next-line no-console
          console.log(event)

          if (event.type !== 'response.output_text.delta')
            return

          textCtrl?.enqueue(event.delta)
        },
      }))
  }

  void (async () => {
    try {
      await trampoline(doStream)
      textCtrl?.close()
    }
    catch (err) {
      textCtrl?.error(err)
    }
    finally {
      // TODO: onFinish
    }
  })()

  return {
    textStream,
  }
}
