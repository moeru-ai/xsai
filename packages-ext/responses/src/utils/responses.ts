import type { FunctionCall, FunctionCallOutput, ResponseResource } from '../generated'
import type { Event } from '../types/event'
import type { FullEvent } from '../types/event-full'
import type { OpenResponsesOptions } from '../types/open-responses-options'
import type { PrepareStepResult } from '../types/prepare-step'
import type { Step } from '../types/step'
import type { StopCondition } from '../types/stop-when'
import type { Usage } from '../types/usage'

import { DelayedPromise, objCamelToSnake, requestBody, requestHeaders, requestURL, responseCatch } from '@xsai/shared'
import { closeControllers, createControlledStream, errorControllers, EventSourceParserStream, JsonMessageTransformStream } from '@xsai/shared-stream'

import { executeTool } from './execute-tool'
import { normalizeInput } from './normalize-input'
import { normalizeOutput } from './normalize-output'
import { shouldStop, stepCountAtLeast } from './stop-when'
import { normalizeTool } from './tool'

export interface ResponsesOptions extends OpenResponsesOptions {
  abortSignal?: AbortSignal
  apiKey?: string
  baseURL: string | URL
  fetch?: typeof globalThis.fetch
  headers?: Record<string, string>
  /** @default `stepCountAtLeast(1)` */
  stopWhen?: StopCondition
}

export interface ResponsesResult {
  eventStream: ReadableStream<Event>
  fullStream: ReadableStream<FullEvent>
  steps: Promise<Step[]>
  textStream: ReadableStream<string>
  totalUsage: Promise<undefined | Usage>
  usage: Promise<undefined | Usage>
}

/** @experimental */
export const responses = (options: ResponsesOptions): ResponsesResult => {
  const input = normalizeInput(structuredClone(options.input))
  const steps: Step[] = []
  const stopWhen = options.stopWhen ?? stepCountAtLeast(1)
  let usage: undefined | Usage
  let totalUsage: undefined | Usage
  let stepFunctionCallOutputs: FunctionCallOutput[] = []

  const getFunctionCalls = (response: ResponseResource): FunctionCall[] =>
    response.output.filter((item): item is FunctionCall => item.type === 'function_call')

  const getText = (response: ResponseResource): string | undefined => {
    const text = response.output
      .filter(item => item.type === 'message')
      .flatMap(item => item.content)
      .filter(part => part.type === 'output_text' || part.type === 'text')
      .map(part => part.text)
      .join('')

    return text.length > 0 ? text : undefined
  }

  const pushStep = (response: ResponseResource): Step => {
    const step: Step = {
      functionCallOutputs: stepFunctionCallOutputs,
      functionCalls: getFunctionCalls(response),
      response,
      text: getText(response),
      usage,
    }

    steps.push(step)

    stepFunctionCallOutputs = []

    return step
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

  const mapFullEvent = (event: FullEvent): Event[] => {
    // eslint-disable-next-line ts/switch-exhaustiveness-check
    switch (event.type) {
      case 'error':
        return [{ error: event.error, type: 'error' }]
      case 'response.completed':
      case 'response.failed':
      case 'response.incomplete':
        return [{ output: event.response.output, type: 'step.done', usage: event.response.usage ?? undefined }]
      case 'response.content_part.added':
        return event.part.type === 'output_text' || event.part.type === 'text' || event.part.type === 'refusal'
          ? [{ outputIndex: event.output_index, type: 'text.start' }]
          : []
      case 'response.created':
        return [{ type: 'step.start' }]
      case 'response.function_call_arguments.delta':
        return [{ delta: event.delta, type: 'tool-call.delta' }]
      case 'response.function_call_arguments.done':
        return []
      case 'response.output_item.added': {
        if (event.item?.type === 'reasoning')
          return [{ outputIndex: event.output_index, type: 'reasoning.start' }]

        if (event.item?.type === 'function_call')
          return [{ outputIndex: event.output_index, type: 'tool-call.start' }]

        return []
      }
      case 'response.output_text.delta':
      case 'response.refusal.delta':
        return [{ delta: event.delta, type: 'text.delta' }]
      case 'response.output_text.done':
        return [{ text: event.text, type: 'text.done' }]
      case 'response.reasoning.delta':
      case 'response.reasoning_summary_text.delta':
        return [{ delta: event.delta, type: 'reasoning.delta' }]
      case 'response.reasoning.done':
      case 'response.reasoning_summary_text.done':
        return [{ text: event.text, type: 'reasoning.done' }]
      case 'response.refusal.done':
        return [{ text: event.refusal, type: 'text.done' }]
      default:
        return []
    }
  }

  // result state
  const resultSteps = new DelayedPromise<Step[]>()
  const resultUsage = new DelayedPromise<undefined | Usage>()
  const resultTotalUsage = new DelayedPromise<undefined | Usage>()

  // output
  const [fullStream, fullStreamCtrl] = createControlledStream<FullEvent>()
  const [textStream, textStreamCtrl] = createControlledStream<string>()
  const [eventStream, eventStreamCtrl] = createControlledStream<Event>()

  const pushStreamingEvent = (event: FullEvent) => {
    fullStreamCtrl.current?.enqueue(event)

    if (event.type === 'response.output_text.delta' || event.type === 'response.refusal.delta')
      textStreamCtrl.current?.enqueue(event.delta)
  }

  const pushEvent = (event: Event) => {
    eventStreamCtrl.current?.enqueue(event)
  }

  const pushEvents = (events: Event[]) => {
    for (const event of events) {
      pushEvent(event)
    }
  }

  const resolveStepOptions = async (): Promise<PrepareStepResult> =>
    options.prepareStep == null
      ? {}
      : options.prepareStep({
          input: structuredClone(input),
          model: options.model,
          stepNumber: steps.length,
          steps: structuredClone(steps),
        })

  const createReader = async () => {
    const stepOptions = await resolveStepOptions()
    const res = await (options.fetch ?? globalThis.fetch)(requestURL('responses', options.baseURL), {
      body: requestBody({
        ...options,
        input: stepOptions.input != null ? structuredClone(stepOptions.input) : input,
        model: stepOptions.model ?? options.model,
        stopWhen: undefined,
        stream: true,
        streamOptions: options.streamOptions != null
          ? objCamelToSnake(options.streamOptions)
          : undefined,
        toolChoice: stepOptions.toolChoice ?? options.toolChoice,
        tools: options.tools?.map(normalizeTool).map(({ execute: _execute, ...tool }) => tool),
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
      .pipeThrough(new JsonMessageTransformStream<FullEvent>())
      .getReader()
  }

  let reader: ReadableStreamDefaultReader<FullEvent> | undefined

  const doStream = async () => {
    reader = await createReader()

    while (reader != null) {
      const { done, value: event } = await reader.read()

      if (done)
        return

      let shouldContinue = false
      const events = mapFullEvent(event)

      // eslint-disable-next-line ts/switch-exhaustiveness-check
      switch (event.type) {
        case 'response.completed': {
          pushUsage(event.response.usage ?? undefined)
          const step = pushStep(event.response)

          shouldContinue = input.at(-1)?.type === 'function_call_output'
            && !shouldStop(stopWhen, {
              input,
              step,
              steps,
            })

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
              abortSignal: options.abortSignal,
              functionCall: event.item,
              tools: options.tools,
            })
            stepFunctionCallOutputs.push(functionCallOutput)
            input.push(...normalizeOutput([functionCallOutput]))
            events.push({
              toolCall: {
                arguments: event.item.arguments,
                id: event.item.call_id,
                name: event.item.name,
              },
              type: 'tool-call.done',
            }, {
              toolResult: {
                id: event.item.call_id,
                name: event.item.name,
                output: functionCallOutput.output,
              },
              type: 'tool-result.done',
            })
          }

          break
        }
        default:
          break
      }

      pushStreamingEvent(event)
      pushEvents(events)

      if (shouldContinue) {
        reader.releaseLock()
        reader = await createReader()
      }
    }
  }

  void (async () => {
    let finalError: unknown

    try {
      await doStream()
    }
    catch (err) {
      finalError = err
    }

    if (finalError != null) {
      errorControllers(finalError, fullStreamCtrl, textStreamCtrl, eventStreamCtrl)

      resultSteps.reject(finalError)
      resultUsage.reject(finalError)
      resultTotalUsage.reject(finalError)
      return
    }

    closeControllers(fullStreamCtrl, textStreamCtrl, eventStreamCtrl)

    resultSteps.resolve(steps)
    resultUsage.resolve(usage)
    resultTotalUsage.resolve(totalUsage)
  })()

  return {
    eventStream,
    fullStream,
    steps: resultSteps.promise,
    textStream,
    totalUsage: resultTotalUsage.promise,
    usage: resultUsage.promise,
  }
}
