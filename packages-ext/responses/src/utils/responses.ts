import type { ResponseCompletedStreamingEvent } from '../generated'
import type { OpenResponsesOptions } from '../types/open-responses-options'
import type { StreamingEvent } from '../types/streaming-event'

import { requestBody, requestHeaders, requestURL, responseCatch, trampoline } from '@xsai/shared'
import { signal } from 'alien-signals'
import { EventSourceParserStream } from 'eventsource-parser/stream'

import { normalizeInput } from './normalize-input'
import { normalizeOutput } from './normalize-output'
import { StreamingEventParserStream } from './streaming-event-parser-stream'

export interface ResponsesOptions extends OpenResponsesOptions {
  abortSignal?: AbortSignal
  apiKey?: string
  baseURL: string | URL
  fetch?: typeof globalThis.fetch
  headers?: Record<string, string>
}

export const responses = (options: ResponsesOptions) => {
  const input = signal(normalizeInput(structuredClone(options.input)))
  const steps = signal<ResponseCompletedStreamingEvent[]>([])

  // output
  let textCtrl: ReadableStreamDefaultController<string> | undefined
  const textStream = new ReadableStream<string>({ start: controller => textCtrl = controller })
  let eventCtrl: ReadableStreamDefaultController<StreamingEvent> | undefined
  const eventStream = new ReadableStream<StreamingEvent>({ start: controller => eventCtrl = controller })

  const doStream = async () => {
    const res = await (options.fetch ?? globalThis.fetch)(requestURL('responses', options.baseURL), {
      body: requestBody({
        ...options,
        input: input(),
        stream: true,
        tools: options.tools?.map(({ execute, ...tool }) => tool),
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

          eventCtrl?.enqueue(event)

          // eslint-disable-next-line ts/switch-exhaustiveness-check
          switch (event.type) {
            // case 'response.function_call_arguments.done':

            //   break
            case 'response.completed':
              steps([...steps(), event])
              input([...input(), ...normalizeOutput(event.response.output)])
              break
            case 'response.output_text.delta':
              textCtrl?.enqueue(event.delta)
              break
            default:
              break
          }
        },
      }))
  }

  void (async () => {
    try {
      await trampoline(doStream)
      textCtrl?.close()
      eventCtrl?.close()
    }
    catch (err) {
      textCtrl?.error(err)
      eventCtrl?.error(err)
    }
    finally {
      // TODO: onFinish
    }
  })()

  return {
    eventStream,
    steps,
    textStream,
  }
}
