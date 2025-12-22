import type { CompletionStep, CompletionToolCall, CompletionToolResult, FinishReason, Message, StreamTextEvent, StreamTextOptions, StreamTextResult, ToolCall, Usage, WithUnknown } from 'xsai'

import { chat, DelayedPromise, determineStepType, executeTool, objCamelToSnake, trampoline } from 'xsai'

import type { WithTelemetry } from '../types/options'

import { commonAttributes, idAttributes, metadataAttributes } from './attributes'
import { getTracer } from './get-tracer'
import { now } from './now'
import { recordSpan, recordSpanSync } from './record-span'
import { transformChunk } from './stream-text-internal'
import { stringifyTool } from './stringify-tool'
import { wrapTool } from './wrap-tool'

/**
 * @experimental
 * Streaming Text with Telemetry.
 */
export const streamText = (options: WithUnknown<WithTelemetry<StreamTextOptions>>) => {
  const tracer = getTracer()

  // state
  const steps: CompletionStep[] = []
  const messages: Message[] = structuredClone(options.messages)
  const maxSteps = options.maxSteps ?? 1
  let usage: undefined | Usage
  let totalUsage: undefined | Usage

  // result state
  const resultSteps = new DelayedPromise<CompletionStep[]>()
  const resultMessages = new DelayedPromise<Message[]>()
  const resultUsage = new DelayedPromise<undefined | Usage>()
  const resultTotalUsage = new DelayedPromise<undefined | Usage>()

  // output
  let eventCtrl: ReadableStreamDefaultController<StreamTextEvent> | undefined
  let textCtrl: ReadableStreamDefaultController<string> | undefined
  let reasoningTextCtrl: ReadableStreamDefaultController<string> | undefined
  const eventStream = new ReadableStream<StreamTextEvent>({ start: controller => eventCtrl = controller })
  const textStream = new ReadableStream<string>({ start: controller => textCtrl = controller })
  const reasoningTextStream = new ReadableStream<string>({ start: controller => reasoningTextCtrl = controller })

  const pushEvent = (stepEvent: StreamTextEvent) => {
    eventCtrl?.enqueue(stepEvent)
    // eslint-disable-next-line sonarjs/void-use
    void options.onEvent?.(stepEvent)
  }

  const pushStep = (step: CompletionStep) => {
    steps.push(step)
    // eslint-disable-next-line sonarjs/void-use
    void options.onStepFinish?.(step)
  }

  const tools = options.tools != null && options.tools.length > 0
    ? options.tools.map(tool => wrapTool(tool, tracer))
    : undefined

  const doStream = async () => recordSpan({
    attributes: {
      ...idAttributes(),
      ...commonAttributes('ai.streamText.doStream', options.model),
      ...metadataAttributes(options.telemetry?.metadata),
      ...(tools != null && tools.length > 0 && {
        'ai.prompt.toolChoice': JSON.stringify(options.toolChoice ?? { type: 'auto' }),
        'ai.prompt.tools': tools.map(stringifyTool),
      }),
      'ai.prompt.messages': JSON.stringify(options.messages),
      'ai.response.model': options.model,
      'gen_ai.request.model': options.model,
      'gen_ai.response.id': crypto.randomUUID(),
      'gen_ai.response.model': options.model,
      'gen_ai.system': 'xsai',
    },
    name: 'ai.streamText.doStream',
    tracer,
  }, async (span) => {
    const startMs = now()

    const { body: stream } = await chat({
      ...options,
      maxSteps: undefined,
      messages,
      stream: true,
      streamOptions: options.streamOptions != null
        ? objCamelToSnake(options.streamOptions)
        : undefined,
      tools,
    })

    // let stepUsage: undefined | Usage
    const pushUsage = (u: Usage) => {
      usage = u
      totalUsage = totalUsage
        ? {
            completion_tokens: totalUsage.completion_tokens + u.completion_tokens,
            prompt_tokens: totalUsage.prompt_tokens + u.prompt_tokens,
            total_tokens: totalUsage.total_tokens + u.total_tokens,
          }
        : { ...u }
      // stepUsage = u
    }

    let text: string = ''
    let reasoningText: string | undefined
    const pushText = (content: string) => {
      textCtrl?.enqueue(content)
      text += content
    }
    const pushReasoningText = (reasoningContent: string) => {
      if (reasoningText == null)
        reasoningText = ''

      reasoningTextCtrl?.enqueue(reasoningContent)
      reasoningText += reasoningContent
    }

    const tool_calls: ToolCall[] = []
    const toolCalls: CompletionToolCall[] = []
    const toolResults: CompletionToolResult[] = []
    let finishReason: FinishReason = 'other'
    let firstChunk = true

    await stream!
      .pipeThrough(transformChunk())
      .pipeTo(new WritableStream({
        abort: (reason) => {
          eventCtrl?.error(reason)
          textCtrl?.error(reason)
        },
        close: () => {},
        // eslint-disable-next-line sonarjs/cognitive-complexity
        write: (chunk) => {
          // Telemetry
          if (firstChunk) {
            const msToFirstChunk = now() - startMs
            span.addEvent('ai.stream.firstChunk', {
              'ai.response.msToFirstChunk': msToFirstChunk,
            })
            span.setAttributes({
              'ai.response.msToFirstChunk': msToFirstChunk,
            })
            firstChunk = false
          }

          if (chunk.usage)
            pushUsage(chunk.usage)

          // skip if no choices
          if (chunk.choices == null || chunk.choices.length === 0)
            return

          const choice = chunk.choices[0]

          if (choice.delta.reasoning_content != null) {
            pushEvent({ text: choice.delta.reasoning_content, type: 'reasoning-delta' })
            pushReasoningText(choice.delta.reasoning_content)
          }

          if (choice.finish_reason != null)
            finishReason = choice.finish_reason

          if (choice.delta.tool_calls?.length === 0 || choice.delta.tool_calls == null) {
            if (choice.delta.content != null) {
              pushEvent({ text: choice.delta.content, type: 'text-delta' })
              pushText(choice.delta.content)
            }
            else if (choice.delta.refusal != null) {
              pushEvent({ error: choice.delta.refusal, type: 'error' })
            }
            else if (choice.finish_reason != null) {
              pushEvent({ finishReason: choice.finish_reason, type: 'finish', usage })
            }
          }
          else {
            // https://platform.openai.com/docs/guides/function-calling?api-mode=chat&lang=javascript#streaming
            for (const toolCall of choice.delta.tool_calls) {
              const { index } = toolCall

              if (!tool_calls.at(index)) {
                tool_calls[index] = {
                  ...toolCall,
                  function: {
                    ...toolCall.function,
                    arguments: toolCall.function.arguments ?? '',
                  },
                }
                pushEvent({
                  toolCallId: toolCall.id,
                  toolName: toolCall.function.name!,
                  type: 'tool-call-streaming-start',
                })
              }
              else {
                tool_calls[index].function.arguments! += toolCall.function.arguments
                pushEvent({
                  argsTextDelta: toolCall.function.arguments!,
                  toolCallId: toolCall.id,
                  toolName: toolCall.function.name ?? tool_calls[index].function.name!,
                  type: 'tool-call-delta',
                })
              }
            }
          }
        },
      }))

    messages.push({
      content: text,
      reasoning_content: reasoningText,
      role: 'assistant',
      tool_calls: tool_calls.length > 0 ? tool_calls : undefined,
    })

    if (tool_calls.length !== 0) {
      for (const toolCall of tool_calls) {
        if (toolCall == null)
          continue
        const { completionToolCall, completionToolResult, message } = await executeTool({
          abortSignal: options.abortSignal,
          messages,
          toolCall,
          tools,
        })

        toolCalls.push(completionToolCall)
        toolResults.push(completionToolResult)
        messages.push(message)

        pushEvent({ ...completionToolCall, type: 'tool-call' })
        pushEvent({ ...completionToolResult, type: 'tool-result' })
      }
    }
    else {
      // TODO: should we add this on tool calls finish?
      pushEvent({
        finishReason,
        type: 'finish',
        usage,
      })
    }

    const step = {
      finishReason,
      stepType: determineStepType({ finishReason, maxSteps, stepsLength: steps.length, toolCallsLength: toolCalls.length }),
      text,
      toolCalls,
      toolResults,
      usage,
    }
    pushStep(step)

    // Telemetry
    const msToFinish = now() - startMs
    span.addEvent('ai.stream.finish')
    span.setAttributes({
      'ai.response.msToFinish': msToFinish,
      ...(step.toolCalls.length > 0 && { 'ai.response.toolCalls': JSON.stringify(step.toolCalls) }),
      'ai.response.finishReason': step.finishReason,
      'ai.response.text': step.text != null ? step.text : '',
      'gen_ai.response.finish_reasons': [step.finishReason],
      ...step.usage && {
        'ai.response.avgOutputTokensPerSecond': (1000 * (step.usage.completion_tokens ?? 0)) / msToFinish,
        'ai.usage.inputTokens': step.usage.prompt_tokens,
        'ai.usage.outputTokens': step.usage.completion_tokens,
        'ai.usage.totalTokens': step.usage.total_tokens,
        'gen_ai.usage.input_tokens': step.usage.prompt_tokens,
        'gen_ai.usage.output_tokens': step.usage.completion_tokens,
      },
    })

    if (toolCalls.length !== 0 && steps.length < maxSteps)
      return async () => doStream()
  })

  return recordSpanSync<StreamTextResult>({
    attributes: {
      ...commonAttributes('ai.streamText', options.model),
      ...metadataAttributes(options.telemetry?.metadata),
      'ai.prompt': JSON.stringify({ messages: options.messages }),
    },
    endWhenDone: false,
    name: 'ai.streamText',
    tracer,
  }, (rootSpan) => {
    void (async () => {
      try {
        await trampoline(async () => doStream())

        eventCtrl?.close()
        textCtrl?.close()
        reasoningTextCtrl?.close()
      }
      catch (err) {
        eventCtrl?.error(err)
        textCtrl?.error(err)
        reasoningTextCtrl?.error(err)

        resultSteps.reject(err)
        resultMessages.reject(err)
        resultUsage.reject(err)
        resultTotalUsage.reject(err)
      }
      finally {
        resultSteps.resolve(steps)
        resultMessages.resolve(messages)
        resultUsage.resolve(usage)
        resultTotalUsage.resolve(totalUsage)

        const finishStep = steps.at(-1)

        if (finishStep) {
          rootSpan.setAttributes({
            ...(finishStep.toolCalls.length > 0 && { 'ai.response.toolCalls': JSON.stringify(finishStep.toolCalls) }),
            'ai.response.finishReason': finishStep.finishReason,
            'ai.response.text': finishStep.text != null ? finishStep.text : '',
          })
        }

        if (totalUsage) {
          rootSpan.setAttributes({
            'ai.usage.inputTokens': totalUsage.prompt_tokens,
            'ai.usage.outputTokens': totalUsage.completion_tokens,
            'ai.usage.totalTokens': totalUsage.total_tokens,
          })
        }

        // eslint-disable-next-line sonarjs/void-use
        void options.onFinish?.(finishStep)

        rootSpan.end()
      }
    })()

    return {
      fullStream: eventStream,
      messages: resultMessages.promise,
      reasoningTextStream,
      steps: resultSteps.promise,
      textStream,
      totalUsage: resultTotalUsage.promise,
      usage: resultUsage.promise,
    }
  })
}
