import type { ResponseCompletedStreamingEvent } from '../generated'
import type { OpenResponsesOptions } from '../types/open-responses-options'
import type { StreamingEvent } from '../types/streaming-event'

import { requestBody, requestHeaders, requestURL, responseCatch, trampoline } from '@xsai/shared'
import { EventSourceParserStream } from 'eventsource-parser/stream'

import { executeTool } from './execute-tool'
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
  const input = normalizeInput(structuredClone(options.input))
  const steps: ResponseCompletedStreamingEvent[] = []

  // output
  let textCtrl: ReadableStreamDefaultController<string> | undefined
  const textStream = new ReadableStream<string>({ start: controller => textCtrl = controller })
  let eventCtrl: ReadableStreamDefaultController<StreamingEvent> | undefined
  const eventStream = new ReadableStream<StreamingEvent>({ start: controller => eventCtrl = controller })

  const doStream = async () => {
    const res = await (options.fetch ?? globalThis.fetch)(requestURL('responses', options.baseURL), {
      body: requestBody({
        ...options,
        input,
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
        write: async (event) => {
          // eslint-disable-next-line no-console
          console.log(event)

          eventCtrl?.enqueue(event)

          // eslint-disable-next-line ts/switch-exhaustiveness-check
          switch (event.type) {
            case 'response.completed':
              steps.push(event)
              break
            case 'response.output_item.done': {
              if (event.item == null)
                break

              input.push(...normalizeOutput([event.item]))

              if (event.item.type === 'function_call') {
                const functionCallOutput = await executeTool({
                  functionCall: event.item,
                  tools: options.tools,
                })
                input.push(...normalizeOutput([functionCallOutput]))
              }

              break
            }
            case 'response.output_text.delta':
              textCtrl?.enqueue(event.delta)
              break
            default:
              break
          }
        },
      }))

    // TODO: stopWhen
    if (input.at(-1)?.type === 'function_call_output')
      return async () => doStream()
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
