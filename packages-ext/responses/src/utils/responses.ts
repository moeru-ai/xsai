import type { ResponseCompletedStreamingEvent } from '../generated'
import type { OpenResponsesOptions } from '../types/open-responses-options'
import type { StreamingEvent } from '../types/streaming-event'

import { requestBody, requestHeaders, requestURL, responseCatch } from '@xsai/shared'
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

  const createReader = async () => {
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

    return res.body!
      .pipeThrough(new TextDecoderStream())
      .pipeThrough(new EventSourceParserStream())
      .pipeThrough(new StreamingEventParserStream())
      .getReader()
  }

  let reader: ReadableStreamDefaultReader<StreamingEvent> | undefined

  const mainStream = new ReadableStream<StreamingEvent>({
    cancel: async () => reader?.cancel(),
    async pull(controller) {
      if (reader == null)
        return controller.close()

      try {
        const { done, value: event } = await reader.read()

        if (done)
          return controller.close()

        // eslint-disable-next-line ts/switch-exhaustiveness-check
        switch (event.type) {
          case 'response.completed': {
            steps.push(event)

            // TODO: stopWhen
            if (input.at(-1)?.type === 'function_call_output') {
              reader.releaseLock()
              reader = await createReader()
              return await this.pull!(controller)
            }

            break
          }
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
          default:
            break
        }

        controller.enqueue(event)
      }
      catch (err) {
        controller.error(err)
      }
    },
    start: async () => {
      reader = await createReader()
    },
  })

  const [eventStream, textStreamRaw] = mainStream.tee()
  const textStream = textStreamRaw.pipeThrough(new TransformStream<StreamingEvent, string>({
    transform: (event, controller) => event.type === 'response.output_text.delta' ? controller.enqueue(event.delta) : undefined,
  }))

  return {
    eventStream,
    steps,
    textStream,
  }
}
