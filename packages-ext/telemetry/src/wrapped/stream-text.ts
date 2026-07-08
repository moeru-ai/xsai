import type { AssistantMessage, CompletionStep, CompletionToolCall, CompletionToolResult, Event, FinishReason, Message, StreamTextOptions, StreamTextResult, ToolCall, Usage, WithUnknown } from 'xsai'

import type { WithTelemetry } from '../types/options'
import type { StreamTextChunkResult } from '../types/stream-text-chunk'

import { closeControllers, createControlledStream, errorControllers, EventSourceParserStream, JsonMessageTransformStream } from '@xsai/shared-stream'
import { chat, computeTotalUsage, executeTool, normalizeChatCompletionUsage, objCamelToSnake, resolvePrepareStep, shouldStop, stepCountAtLeast, trampoline } from 'xsai'

import { getTracer } from '../utils/get-tracer'
import { recordSpan } from '../utils/record-span'
import { chatSpan } from '../utils/record-span-options'
import { wrapTool } from '../utils/wrap-tool'

/**
 * @experimental
 * Streaming Text with Telemetry.
 */
export const streamText = (options: WithUnknown<WithTelemetry<StreamTextOptions>>): StreamTextResult => {
  const tracer = getTracer()

  // state
  const steps: CompletionStep[] = []
  const messages: Message[] = structuredClone(options.messages)
  const stopWhen = options.stopWhen ?? stepCountAtLeast(1)
  let usage: undefined | Usage
  let totalUsage: undefined | Usage
  let reasoningField: 'reasoning' | 'reasoning_content' | undefined

  // result state
  const resultSteps = Promise.withResolvers<CompletionStep[]>()
  const resultMessages = Promise.withResolvers<Message[]>()
  const resultUsage = Promise.withResolvers<undefined | Usage>()
  const resultTotalUsage = Promise.withResolvers<undefined | Usage>()

  // output
  const [eventStream, eventCtrl] = createControlledStream<Event>()
  const [fullStream, fullCtrl] = createControlledStream<StreamTextChunkResult>()
  const [textStream, textCtrl] = createControlledStream<string>()
  const [reasoningTextStream, reasoningTextCtrl] = createControlledStream<string>()

  const pushEvent = (event: Event) => {
    eventCtrl.current?.enqueue(event)

    void options.onEvent?.(event)
  }

  const pushStep = (step: CompletionStep) => {
    steps.push(step)

    void options.onStepFinish?.(step)
  }

  const tools = options.tools != null && options.tools.length > 0
    ? options.tools.map(tool => wrapTool(tool, tracer))
    : undefined

  const doStream = async () => {
    const stepOptions = await resolvePrepareStep({
      input: messages,
      model: options.model,
      prepareStep: options.prepareStep,
      stepNumber: steps.length,
      steps,
      toolChoice: options.toolChoice,
    })

    return recordSpan(chatSpan({
      ...options,
      messages: stepOptions.input,
      model: stepOptions.model,
      toolChoice: stepOptions.toolChoice,
    }, tracer), async (span) => {
      const { body: stream } = await chat({
        ...options,
        messages: stepOptions.input,
        model: stepOptions.model,
        stream: true,
        streamOptions: options.streamOptions != null
          ? objCamelToSnake(options.streamOptions)
          : undefined,
        telemetry: undefined,
        toolChoice: stepOptions.toolChoice,
        tools,
      })

      const pushUsage = (u: StreamTextChunkResult['usage']) => {
        if (u == null)
          return

        usage = normalizeChatCompletionUsage(u)
        totalUsage = computeTotalUsage(totalUsage, usage)
      }

      let text = ''
      let reasoningText: string | undefined
      const pushText = (content: string) => {
        textCtrl.current?.enqueue(content)
        text += content
      }
      const pushReasoningText = (reasoningContent: string) => {
        reasoningText ??= ''

        reasoningTextCtrl.current?.enqueue(reasoningContent)
        reasoningText += reasoningContent
      }

      const tool_calls: ToolCall[] = []
      const toolCalls: CompletionToolCall[] = []
      const toolResults: CompletionToolResult[] = []
      let finishReason: FinishReason = 'other'
      let reasoningStarted = false
      let textStarted = false

      pushEvent({ type: 'step.start' })

      await stream!
        .pipeThrough(new TextDecoderStream())
        .pipeThrough(new EventSourceParserStream())
        .pipeThrough(new JsonMessageTransformStream<StreamTextChunkResult>())
        .pipeTo(new WritableStream({
          abort: (reason) => {
            errorControllers(reason, eventCtrl, fullCtrl, textCtrl, reasoningTextCtrl)
          },
          close: () => {},
          // eslint-disable-next-line sonarjs/cognitive-complexity
          write: (chunk) => {
            fullCtrl.current?.enqueue(chunk)
            pushUsage(chunk.usage)

            // skip if no choices
            if (chunk.choices == null || chunk.choices.length === 0)
              return

            const choice = chunk.choices[0]

            if (choice.delta.reasoning != null) {
              if (reasoningField !== 'reasoning')
                reasoningField = 'reasoning'

              if (!reasoningStarted) {
                reasoningStarted = true
                pushEvent({ type: 'reasoning.start' })
              }
              pushEvent({ delta: choice.delta.reasoning, type: 'reasoning.delta' })
              pushReasoningText(choice.delta.reasoning)
            }
            else if (choice.delta.reasoning_content != null) {
              if (reasoningField !== 'reasoning_content')
                reasoningField = 'reasoning_content'

              if (!reasoningStarted) {
                reasoningStarted = true
                pushEvent({ type: 'reasoning.start' })
              }
              pushEvent({ delta: choice.delta.reasoning_content, type: 'reasoning.delta' })
              pushReasoningText(choice.delta.reasoning_content)
            }

            if (choice.finish_reason != null)
              finishReason = choice.finish_reason

            if (choice.delta.tool_calls?.length === 0 || choice.delta.tool_calls == null) {
              if (choice.delta.content != null) {
                if (!textStarted) {
                  textStarted = true
                  pushEvent({ type: 'text.start' })
                }
                pushEvent({ delta: choice.delta.content, type: 'text.delta' })
                pushText(choice.delta.content)
              }
              else if (choice.delta.refusal != null) {
                if (!textStarted) {
                  textStarted = true
                  pushEvent({ type: 'text.start' })
                }
                pushEvent({ delta: choice.delta.refusal, type: 'text.delta' })
                pushText(choice.delta.refusal)
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
                    type: 'tool-call.start',
                  })
                  if (toolCall.function.arguments != null && toolCall.function.arguments.length > 0)
                    pushEvent({ delta: toolCall.function.arguments, type: 'tool-call.delta' })
                }
                else {
                  tool_calls[index].function.arguments! += toolCall.function.arguments
                  pushEvent({ delta: toolCall.function.arguments!, type: 'tool-call.delta' })
                }
              }
            }
          },
        }))

      if (reasoningStarted)
        pushEvent({ content: reasoningText ?? '', type: 'reasoning.done' })
      if (textStarted)
        pushEvent({ content: text, type: 'text.done' })

      const message: AssistantMessage = {
        ...(reasoningField != null ? { [reasoningField]: reasoningText } : {}),
        content: text,
        role: 'assistant',
        tool_calls: tool_calls.length > 0 ? tool_calls : undefined,
      }
      messages.push(message)
      span.setAttribute('gen_ai.output.messages', JSON.stringify([message]))

      if (tool_calls.length !== 0) {
        const validToolCalls = tool_calls.filter((tc): tc is ToolCall => tc != null)

        const results = await Promise.all(
          validToolCalls.map(async toolCall => executeTool({
            abortSignal: options.abortSignal,
            messages,
            toolCall,
            tools,
          })),
        )

        for (const { completionToolCall, completionToolResult, result } of results) {
          toolCalls.push(completionToolCall)
          toolResults.push(completionToolResult)
          messages.push({
            content: result,
            role: 'tool',
            tool_call_id: completionToolCall.toolCallId,
          })

          pushEvent({ ...completionToolCall, type: 'tool-call.done' })
          pushEvent({ ...completionToolResult, type: 'tool-result.done' })
        }
      }

      const step: CompletionStep = {
        finishReason,
        text,
        toolCalls,
        toolResults,
        usage,
      }
      const stop = shouldStop(stopWhen, {
        input: messages,
        step,
        steps: [...steps, step],
      })
      const willContinue = toolCalls.length > 0 && !stop
      pushStep(step)
      pushEvent({ type: 'step.done', usage })

      // Telemetry
      span.setAttributes({
        'gen_ai.response.finish_reasons': [step.finishReason],
        ...step.usage && {
          'gen_ai.usage.input_tokens': step.usage.inputTokens,
          'gen_ai.usage.output_tokens': step.usage.outputTokens,
        },
      })

      if (willContinue)
        return async () => doStream()
    })
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
      errorControllers(finalError, eventCtrl, fullCtrl, textCtrl, reasoningTextCtrl)

      resultSteps.reject(finalError)
      resultMessages.reject(finalError)
      resultUsage.reject(finalError)
      resultTotalUsage.reject(finalError)
      return
    }

    closeControllers(eventCtrl, fullCtrl, textCtrl, reasoningTextCtrl)

    resultSteps.resolve(steps)
    resultMessages.resolve(messages)
    resultUsage.resolve(usage)
    resultTotalUsage.resolve(totalUsage)
  })()

  return {
    eventStream,
    fullStream,
    messages: resultMessages.promise,
    reasoningTextStream,
    steps: resultSteps.promise,
    textStream,
    totalUsage: resultTotalUsage.promise,
    usage: resultUsage.promise,
  }
}
