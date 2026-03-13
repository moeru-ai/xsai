import type { OpenResponsesOptions } from '../types/open-responses-options'
import type { Step } from '../types/step'
import type { StreamingEvent } from '../types/streaming-event'
import type { Usage } from '../types/usage'
import type { FunctionCall, FunctionCallOutput, ResponseResource } from '../generated'

import { DelayedPromise, requestBody, requestHeaders, requestURL, responseCatch } from '@xsai/shared'
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

export interface ResponsesResult {
  eventStream: ReadableStream<StreamingEvent>
  steps: Promise<Step[]>
  textStream: ReadableStream<string>
  totalUsage: Promise<undefined | Usage>
  usage: Promise<undefined | Usage>
}

/** @experimental */
export const responses = (options: ResponsesOptions): ResponsesResult => {
  const input = normalizeInput(structuredClone(options.input))
  const steps: Step[] = []
  let usage: undefined | Usage
  let totalUsage: undefined | Usage
  let stepFunctionCallOutputs: FunctionCallOutput[] = []

  const getFunctionCalls = (response: ResponseResource): FunctionCall[] =>
    response.output.filter((item): item is FunctionCall => item.type === 'function_call')

  const getText = (response: ResponseResource): string | undefined => {
    const text = response.output
      .filter((item) => item.type === 'message')
      .flatMap(item => item.content)
      .filter(part => part.type === 'output_text' || part.type === 'text')
      .map(part => part.text)
      .join('')

    return text.length > 0 ? text : undefined
  }

  const pushStep = (response: ResponseResource) => {
    steps.push({
      functionCallOutputs: stepFunctionCallOutputs,
      functionCalls: getFunctionCalls(response),
      response,
      text: getText(response),
      usage,
    })

    stepFunctionCallOutputs = []
  }

  const pushUsage = (nextUsage?: Usage) => {
    if (nextUsage == null)
      return

    usage = nextUsage
    totalUsage = totalUsage
      ? {
          input_tokens: totalUsage.input_tokens + nextUsage.input_tokens,
          output_tokens: totalUsage.output_tokens + nextUsage.output_tokens,
          total_tokens: totalUsage.total_tokens + nextUsage.total_tokens,
        }
      : nextUsage
  }

  // result state
  const resultSteps = new DelayedPromise<Step[]>()
  const resultUsage = new DelayedPromise<undefined | Usage>()
  const resultTotalUsage = new DelayedPromise<undefined | Usage>()

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
    cancel: async () => {
      await reader?.cancel()
      resultSteps.resolve(steps)
      resultUsage.resolve(usage)
      resultTotalUsage.resolve(totalUsage)
    },
    async pull(controller) {
      if (reader == null)
        return controller.close()

      try {
        const { done, value: event } = await reader.read()

        if (done) {
          resultSteps.resolve(steps)
          resultUsage.resolve(usage)
          resultTotalUsage.resolve(totalUsage)
          return controller.close()
        }

        let shouldContinue = false

        // eslint-disable-next-line ts/switch-exhaustiveness-check
        switch (event.type) {
          case 'response.completed': {
            pushUsage(event.response.usage ?? undefined)
            pushStep(event.response)

            // TODO: stopWhen
            shouldContinue = input.at(-1)?.type === 'function_call_output'

            break
          }
          case 'response.failed':
          case 'response.incomplete': {
            pushUsage(event.response.usage ?? undefined)
            pushStep(event.response)

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
              stepFunctionCallOutputs.push(functionCallOutput)
              input.push(...normalizeOutput([functionCallOutput]))
            }

            break
          }
          default:
            break
        }

        controller.enqueue(event)

        if (shouldContinue) {
          reader.releaseLock()
          reader = await createReader()
        }
      }
      catch (err) {
        resultSteps.reject(err)
        resultUsage.reject(err)
        resultTotalUsage.reject(err)
        controller.error(err)
      }
    },
    start: async (controller) => {
      try {
        reader = await createReader()
      }
      catch (err) {
        resultSteps.reject(err)
        resultUsage.reject(err)
        resultTotalUsage.reject(err)
        controller.error(err)
      }
    },
  })

  const [eventStream, textStreamRaw] = mainStream.tee()
  const textStream = textStreamRaw.pipeThrough(new TransformStream<StreamingEvent, string>({
    transform: (event, controller) => event.type === 'response.output_text.delta' ? controller.enqueue(event.delta) : undefined,
  }))

  return {
    eventStream,
    steps: resultSteps.promise,
    textStream,
    totalUsage: resultTotalUsage.promise,
    usage: resultUsage.promise,
  }
}
