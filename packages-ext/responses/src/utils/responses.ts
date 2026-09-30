import type { CommonRequestOptions } from '@xsai/shared'
import type { CompletionStep, CompletionToolCall, CompletionToolResult, Event, FinishReason, PostToolCall, PrepareStep, PreToolCall, Usage } from '@xsai/shared-chat'

import type { FunctionCall, FunctionCallOutputItemParam, ItemParam, ResponseResource } from '../generated'
import type { FullEvent } from '../types/event-full'
import type { OpenResponsesOptions } from '../types/open-responses-options'
import type { StopCondition } from '../types/stop-when'

import { objCamelToSnake, postJSON, trampoline } from '@xsai/shared'
import { computeTotalUsage, executeTool, resolvePrepareStep, toCompletionToolCall } from '@xsai/shared-chat'
import { closeControllers, createControlledStream, errorControllers, EventSourceParserStream, JsonMessageTransformStream } from '@xsai/shared-stream'

import { normalizeInput } from './normalize-input'
import { toFunctionCallOutput, toFunctionTool, toToolCall } from './normalize-tool'
import { normalizeUsage } from './normalize-usage'
import { shouldStop, stepCountAtLeast } from './stop-when'

export interface ResponsesOptions extends OpenResponsesOptions {
  abortSignal?: AbortSignal
  apiKey?: string
  baseURL: string | URL
  fetch?: NonNullable<CommonRequestOptions['fetch']>
  headers?: NonNullable<CommonRequestOptions['headers']>
  onEvent?: (event: Event) => Promise<unknown> | unknown
  onFinish?: (step?: CompletionStep) => Promise<unknown> | unknown
  onStepFinish?: (step: CompletionStep) => Promise<unknown> | unknown
  postToolCall?: PostToolCall
  prepareStep?: PrepareStep<ItemParam[], NonNullable<OpenResponsesOptions['toolChoice']>>
  preToolCall?: PreToolCall
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

  const pushStep = async (step: CompletionStep) => {
    steps.push(step)

    await options.onStepFinish?.(step)
  }

  const pushUsage = (nextUsage?: NonNullable<ResponseResource['usage']>) => {
    if (nextUsage == null)
      return

    usage = normalizeUsage(nextUsage)
    totalUsage = computeTotalUsage(totalUsage, usage)
  }

  const pushResponseStep = async (response: ResponseResource, stepOptions: {
    finishReason: FinishReason
    toolCalls: CompletionToolCall[]
    toolResults: CompletionToolResult[]
  }): Promise<CompletionStep> => {
    pushUsage(response.usage ?? undefined)
    const step = createStep(response, stepOptions)
    await pushStep(step)

    return step
  }

  const mapFullEvent = (event: FullEvent): Event[] => {
    // eslint-disable-next-line ts/switch-exhaustiveness-check
    switch (event.type) {
      case 'error':
        return [{ cause: event.error, message: event.error.message, type: 'error' }]
      case 'response.completed':
      case 'response.failed':
      case 'response.incomplete':
        return [{ type: 'step.done', usage: event.response.usage != null ? normalizeUsage(event.response.usage) : undefined }]
      case 'response.content_part.added':
        return event.part.type === 'output_text' || event.part.type === 'text' || event.part.type === 'refusal'
          ? [{ type: 'text.start' }]
          : []
      case 'response.created':
        return [{ type: 'step.start' }]
      case 'response.function_call_arguments.delta':
        return [{ delta: event.delta, type: 'tool-call.delta' }]
      case 'response.function_call_arguments.done':
        return []
      case 'response.output_item.added': {
        if (event.item?.type === 'reasoning')
          return [{ type: 'reasoning.start' }]

        if (event.item?.type === 'function_call') {
          return [{
            toolCallId: event.item.call_id,
            toolName: event.item.name,
            type: 'tool-call.start',
          }]
        }

        return []
      }
      case 'response.output_text.delta':
      case 'response.refusal.delta':
        return [{ delta: event.delta, type: 'text.delta' }]
      case 'response.output_text.done':
        return [{ content: event.text, type: 'text.done' }]
      case 'response.reasoning.delta':
      case 'response.reasoning_summary_text.delta':
      case 'response.reasoning_text.delta':
        return [{ delta: event.delta, type: 'reasoning.delta' }]
      case 'response.reasoning.done':
      case 'response.reasoning_summary_text.done':
      case 'response.reasoning_text.done':
        return [{ content: event.text, type: 'reasoning.done' }]
      case 'response.refusal.done':
        return [{ content: event.refusal, type: 'text.done' }]
      default:
        return []
    }
  }

  // result state
  const resultInput = Promise.withResolvers<ItemParam[]>()
  const resultSteps = Promise.withResolvers<CompletionStep[]>()
  const resultUsage = Promise.withResolvers<undefined | Usage>()
  const resultTotalUsage = Promise.withResolvers<undefined | Usage>()

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
      case 'response.reasoning_text.delta':
        reasoningTextCtrl.current?.enqueue(event.delta)
        break
      default:
        break
    }
  }

  const pushEvent = async (event: Event) => {
    eventCtrl.current?.enqueue(event)

    await options.onEvent?.(event)
  }

  const pushEvents = async (events: Event[]) => {
    for (const event of events) {
      await pushEvent(event)
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
    const res = await postJSON('responses', {
      ...options,
      headers: options.headers instanceof Headers ? Object.fromEntries(options.headers) : options.headers,
      input: stepOptions.input,
      model: stepOptions.model,
      onEvent: undefined,
      onFinish: undefined,
      onStepFinish: undefined,
      postToolCall: undefined,
      prepareStep: undefined,
      preToolCall: undefined,
      stopWhen: undefined,
      stream: true,
      streamOptions: options.streamOptions != null
        ? objCamelToSnake(options.streamOptions)
        : undefined,
      toolChoice: stepOptions.toolChoice,
      tools: options.tools?.map(tool => tool.type === 'function' ? toFunctionTool(tool) : tool),
    })

    return res.body!
      .pipeThrough(new TextDecoderStream())
      .pipeThrough(new EventSourceParserStream())
      .pipeThrough(new JsonMessageTransformStream<FullEvent>())
      .getReader()
  }

  const executeFunctionCall = async (functionCall: FunctionCall) => {
    const { completionToolCall, completionToolResult, result } = await executeTool({
      abortSignal: options.abortSignal,
      messages: [],
      postToolCall: options.postToolCall,
      preToolCall: options.preToolCall,
      toolCall: toToolCall(functionCall),
      tools: options.tools?.filter(tool => tool.type === 'function'),
      wrapResult: toFunctionCallOutput,
    })

    const functionCallOutput: FunctionCallOutputItemParam = {
      call_id: functionCall.call_id,
      output: result,
      status: 'completed',
      type: 'function_call_output',
    }

    return { completionToolCall, completionToolResult, functionCallOutput }
  }

  const handleOutputItemDone = (event: Extract<FullEvent, { type: 'response.output_item.done' }>, step: {
    events: Event[]
    functionCalls: FunctionCall[]
    toolCalls: CompletionToolCall[]
  }) => {
    if (event.item == null)
      return

    input.push(event.item as ItemParam)

    if (event.item.type === 'function_call') {
      step.functionCalls.push(event.item)
      const toolCall = toCompletionToolCall(toToolCall(event.item))
      step.toolCalls.push(toolCall)
      step.events.push({ ...toolCall, type: 'tool-call.done' })
    }
  }

  // eslint-disable-next-line sonarjs/cognitive-complexity
  const doStream = async () => {
    const reader = await createReader()
    const functionCalls: FunctionCall[] = []
    const toolCalls: CompletionToolCall[] = []
    const toolResults: CompletionToolResult[] = []
    const cancel = () => {
      void reader.cancel(options.abortSignal?.reason).catch(() => {})
    }

    options.abortSignal?.addEventListener('abort', cancel, { once: true })

    try {
      while (true) {
        options.abortSignal?.throwIfAborted()
        const { done, value: event } = await reader.read()
        options.abortSignal?.throwIfAborted()

        if (done)
          throw new Error('Responses stream ended before a terminal event')

        let shouldContinue = false
        const events = mapFullEvent(event)
        const step = { events, functionCalls, toolCalls, toolResults }

        // eslint-disable-next-line ts/switch-exhaustiveness-check
        switch (event.type) {
          case 'response.completed': {
            pushUsage(event.response.usage ?? undefined)

            const completionStep = createStep(event.response, {
              finishReason: getFunctionCalls(event.response).length > 0 ? 'tool-calls' : 'stop',
              toolCalls,
              toolResults,
            })

            const stop = shouldStop(stopWhen, {
              input,
              step: completionStep,
              steps: [...steps, completionStep],
            })

            if (!stop && functionCalls.length > 0) {
              const stepDoneEvent = events.pop()
              const results = await Promise.all(functionCalls.map(executeFunctionCall))

              toolCalls.length = 0
              for (const { completionToolCall, completionToolResult, functionCallOutput } of results) {
                toolCalls.push(completionToolCall)
                toolResults.push(completionToolResult)
                input.push(functionCallOutput)
                events.push({ ...completionToolResult, type: 'tool-result.done' })
              }
              if (stepDoneEvent != null)
                events.push(stepDoneEvent)
            }

            shouldContinue = functionCalls.length > 0 && !stop && !options.abortSignal?.aborted

            await pushStep(completionStep)

            break
          }
          case 'response.failed':
            await pushResponseStep(event.response, {
              finishReason: 'error',
              toolCalls,
              toolResults,
            })
            break
          case 'response.incomplete':
            await pushResponseStep(event.response, {
              finishReason: 'length',
              toolCalls,
              toolResults,
            })
            break
          case 'response.output_item.done':
            handleOutputItemDone(event, step)
            break
          default:
            break
        }

        pushStreamingEvent(event)
        await pushEvents(events)
        options.abortSignal?.throwIfAborted()

        if (event.type === 'response.failed')
          throw new Error(event.response.error?.message ?? 'Responses request failed')

        if (event.type === 'response.completed')
          return shouldContinue ? async () => doStream() : undefined

        if (event.type === 'response.incomplete')
          return
      }
    }
    finally {
      options.abortSignal?.removeEventListener('abort', cancel)
      await reader.cancel().catch(() => {})
      reader.releaseLock()
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
