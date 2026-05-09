import type { CompletionStep, CompletionToolCall, CompletionToolResult, FinishReason, PrepareStep, Usage } from '@xsai/shared-chat'

import type { FunctionCall, FunctionCallOutput, ItemParam, ResponseResource } from '../generated'
import type { Event } from '../types/event'
import type { FullEvent } from '../types/event-full'
import type { OpenResponsesOptions } from '../types/open-responses-options'
import type { StopCondition } from '../types/stop-when'

import { DelayedPromise, objCamelToSnake, requestBody, requestHeaders, requestURL, responseCatch, trampoline } from '@xsai/shared'
import { computeTotalUsage, executeTool, resolvePrepareStep } from '@xsai/shared-chat'
import { closeControllers, createControlledStream, errorControllers, EventSourceParserStream, JsonMessageTransformStream } from '@xsai/shared-stream'

import { normalizeInput } from './normalize-input'
import { normalizeOutput } from './normalize-output'
import { toFunctionCallOutput, toFunctionTool, toToolCall } from './normalize-tool'
import { normalizeUsage } from './normalize-usage'
import { shouldStop, stepCountAtLeast } from './stop-when'

export interface ResponsesOptions extends OpenResponsesOptions {
  abortSignal?: AbortSignal
  apiKey?: string
  baseURL: string | URL
  fetch?: typeof globalThis.fetch
  headers?: Record<string, string>
  onEvent?: (event: Event) => Promise<unknown> | unknown
  onFinish?: (step?: CompletionStep) => Promise<unknown> | unknown
  onStepFinish?: (step: CompletionStep) => Promise<unknown> | unknown
  prepareStep?: PrepareStep<ItemParam[], NonNullable<OpenResponsesOptions['toolChoice']>>
  /** @default `stepCountAtLeast(1)` */
  stopWhen?: StopCondition
}

export interface ResponsesResult {
  eventStream: ReadableStream<Event>
  fullStream: ReadableStream<FullEvent>
  input: Promise<ItemParam[]>
  reasoningTextStream: ReadableStream<string>
  steps: Promise<CompletionStep[]>
  textStream: ReadableStream<string>
  totalUsage: Promise<undefined | Usage>
  usage: Promise<undefined | Usage>
}

/** @experimental */
export const responses = (options: ResponsesOptions): ResponsesResult => {
  const input = normalizeInput(structuredClone(options.input))
  const steps: CompletionStep[] = []
  const stopWhen = options.stopWhen ?? stepCountAtLeast(1)
  let usage: undefined | Usage
  let totalUsage: undefined | Usage

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

  const createStep = (response: ResponseResource, stepOptions: {
    finishReason: FinishReason
    toolCalls: CompletionToolCall[]
    toolResults: CompletionToolResult[]
  }): CompletionStep => ({
    finishReason: stepOptions.finishReason,
    text: getText(response),
    toolCalls: stepOptions.toolCalls,
    toolResults: stepOptions.toolResults,
    usage,
  })

  const pushStep = (step: CompletionStep) => {
    steps.push(step)

    void options.onStepFinish?.(step)
  }

  const pushUsage = (nextUsage?: NonNullable<ResponseResource['usage']>) => {
    if (nextUsage == null)
      return

    usage = normalizeUsage(nextUsage)
    totalUsage = computeTotalUsage(totalUsage, usage)
  }

  const pushResponseStep = (response: ResponseResource, stepOptions: {
    finishReason: FinishReason
    toolCalls: CompletionToolCall[]
    toolResults: CompletionToolResult[]
  }): CompletionStep => {
    pushUsage(response.usage ?? undefined)
    const step = createStep(response, stepOptions)
    pushStep(step)

    return step
  }

  const mapFullEvent = (event: FullEvent): Event[] => {
    // eslint-disable-next-line ts/switch-exhaustiveness-check
    switch (event.type) {
      case 'error':
        return [{ error: event.error, type: 'error' }]
      case 'response.completed':
      case 'response.failed':
      case 'response.incomplete':
        return [{ output: event.response.output, type: 'step.done', usage: event.response.usage != null ? normalizeUsage(event.response.usage) : undefined }]
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

        if (event.item?.type === 'function_call') {
          return [{
            outputIndex: event.output_index,
            toolCall: {
              id: event.item.call_id,
              name: event.item.name,
            },
            type: 'tool-call.start',
          }]
        }

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
  const resultInput = new DelayedPromise<ItemParam[]>()
  const resultSteps = new DelayedPromise<CompletionStep[]>()
  const resultUsage = new DelayedPromise<undefined | Usage>()
  const resultTotalUsage = new DelayedPromise<undefined | Usage>()

  // output
  const [fullStream, fullCtrl] = createControlledStream<FullEvent>()
  const [textStream, textCtrl] = createControlledStream<string>()
  const [reasoningTextStream, reasoningTextCtrl] = createControlledStream<string>()
  const [eventStream, eventCtrl] = createControlledStream<Event>()

  const pushStreamingEvent = (event: FullEvent) => {
    fullCtrl.current?.enqueue(event)

    // eslint-disable-next-line ts/switch-exhaustiveness-check
    switch (event.type) {
      case 'response.output_text.delta':
      case 'response.refusal.delta':
        textCtrl.current?.enqueue(event.delta)
        break
      case 'response.reasoning.delta':
      case 'response.reasoning_summary_text.delta':
        reasoningTextCtrl.current?.enqueue(event.delta)
        break
      default:
        break
    }
  }

  const pushEvent = (event: Event) => {
    eventCtrl.current?.enqueue(event)

    void options.onEvent?.(event)
  }

  const pushEvents = (events: Event[]) => {
    for (const event of events) {
      pushEvent(event)
    }
  }

  const createReader = async () => {
    const stepOptions = await resolvePrepareStep({
      input,
      model: options.model,
      prepareStep: options.prepareStep,
      stepNumber: steps.length,
      steps,
      toolChoice: options.toolChoice,
    })
    const res = await (options.fetch ?? globalThis.fetch)(requestURL('responses', options.baseURL), {
      body: requestBody({
        ...options,
        input: stepOptions.input,
        model: stepOptions.model,
        onEvent: undefined,
        onFinish: undefined,
        onStepFinish: undefined,
        prepareStep: undefined,
        stopWhen: undefined,
        stream: true,
        streamOptions: options.streamOptions != null
          ? objCamelToSnake(options.streamOptions)
          : undefined,
        toolChoice: stepOptions.toolChoice,
        tools: options.tools?.map(toFunctionTool),
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

  const pushFunctionCallOutput = async (functionCall: FunctionCall, step: {
    events: Event[]
    toolCalls: CompletionToolCall[]
    toolResults: CompletionToolResult[]
  }) => {
    const { completionToolCall, completionToolResult, result } = await executeTool({
      abortSignal: options.abortSignal,
      messages: [],
      toolCall: toToolCall(functionCall),
      tools: options.tools,
      wrapResult: toFunctionCallOutput,
    })

    const functionCallOutput: FunctionCallOutput = {
      call_id: functionCall.call_id,
      id: crypto.randomUUID(),
      output: result,
      status: 'completed',
      type: 'function_call_output',
    }

    step.toolCalls.push(completionToolCall)
    step.toolResults.push(completionToolResult)
    input.push(normalizeOutput(functionCallOutput))
    step.events.push({
      toolCall: {
        arguments: completionToolCall.args,
        id: completionToolCall.toolCallId,
        name: completionToolCall.toolName,
      },
      type: 'tool-call.done',
    }, {
      toolResult: {
        id: completionToolResult.toolCallId,
        name: completionToolResult.toolName,
        output: completionToolResult.result,
      },
      type: 'tool-result.done',
    })
  }

  const handleOutputItemDone = async (event: Extract<FullEvent, { type: 'response.output_item.done' }>, step: {
    events: Event[]
    toolCalls: CompletionToolCall[]
    toolResults: CompletionToolResult[]
  }) => {
    if (event.item == null)
      return

    input.push(normalizeOutput(event.item))

    if (event.item.type === 'function_call') {
      await pushFunctionCallOutput(event.item, step)
    }
  }

  const doStream = async () => {
    const reader = await createReader()
    const toolCalls: CompletionToolCall[] = []
    const toolResults: CompletionToolResult[] = []

    while (true) {
      const { done, value: event } = await reader.read()

      if (done)
        return

      let shouldContinue = false
      const events = mapFullEvent(event)
      const step = { events, toolCalls, toolResults }

      // eslint-disable-next-line ts/switch-exhaustiveness-check
      switch (event.type) {
        case 'response.completed': {
          pushUsage(event.response.usage ?? undefined)

          const completionStep = createStep(event.response, {
            finishReason: getFunctionCalls(event.response).length > 0 ? 'tool-calls' : 'stop',
            toolCalls,
            toolResults,
          })

          shouldContinue = input.at(-1)?.type === 'function_call_output'
            && !shouldStop(stopWhen, {
              input,
              step: completionStep,
              steps: [...steps, completionStep],
            })

          pushStep(completionStep)

          break
        }
        case 'response.failed':
          pushResponseStep(event.response, {
            finishReason: 'error',
            toolCalls,
            toolResults,
          })
          break
        case 'response.incomplete':
          pushResponseStep(event.response, {
            finishReason: 'length',
            toolCalls,
            toolResults,
          })
          break
        case 'response.output_item.done':
          await handleOutputItemDone(event, step)
          break
        default:
          break
      }

      pushStreamingEvent(event)
      pushEvents(events)

      if (shouldContinue) {
        reader.releaseLock()
        return async () => doStream()
      }
    }
  }

  void (async () => {
    let finalError: unknown

    try {
      await trampoline(async () => doStream())
    }
    catch (err) {
      finalError = err
    }

    try {
      await options.onFinish?.(steps.at(-1))
    }
    catch (err) {
      finalError ??= err
    }

    if (finalError != null) {
      errorControllers(finalError, fullCtrl, textCtrl, reasoningTextCtrl, eventCtrl)

      resultInput.reject(finalError)
      resultSteps.reject(finalError)
      resultUsage.reject(finalError)
      resultTotalUsage.reject(finalError)
      return
    }

    closeControllers(fullCtrl, textCtrl, reasoningTextCtrl, eventCtrl)

    resultInput.resolve(input)
    resultSteps.resolve(steps)
    resultUsage.resolve(usage)
    resultTotalUsage.resolve(totalUsage)
  })()

  return {
    eventStream,
    fullStream,
    input: resultInput.promise,
    reasoningTextStream,
    steps: resultSteps.promise,
    textStream,
    totalUsage: resultTotalUsage.promise,
    usage: resultUsage.promise,
  }
}
