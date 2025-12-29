import type { WithUnknown } from '@xsai/shared'
import type { ChatOptions, CompletionStep, CompletionToolCall, CompletionToolResult, FinishReason, Message, ToolCall, Usage } from '@xsai/shared-chat'

import type { StreamTextEvent } from './types/event'

import { DelayedPromise, objCamelToSnake, trampoline } from '@xsai/shared'
import { chat, determineStepType, executeTool } from '@xsai/shared-chat'

import { transformChunk } from './internal/_transform-chunk'

export type * from './types/event'

export interface StreamTextOptions extends ChatOptions {
  /** @default 1 */
  maxSteps?: number
  onEvent?: (event: StreamTextEvent) => Promise<unknown> | unknown
  onFinish?: (step?: CompletionStep) => Promise<unknown> | unknown
  onStepFinish?: (step: CompletionStep) => Promise<unknown> | unknown
  /**
   * If you want to disable stream, use `@xsai/generate-{text,object}`.
   */
  stream?: never
  streamOptions?: {
    /**
     * Return usage.
     * @default `undefined`
     */
    includeUsage?: boolean
  }
}

export interface StreamTextResult {
  fullStream: ReadableStream<StreamTextEvent>
  messages: Promise<Message[]>
  reasoningTextStream: ReadableStream<string>
  steps: Promise<CompletionStep[]>
  textStream: ReadableStream<string>
  totalUsage: Promise<undefined | Usage>
  usage: Promise<undefined | Usage>
}

export const streamText = (options: WithUnknown<StreamTextOptions>): StreamTextResult => {
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

    void options.onEvent?.(stepEvent)
  }

  const pushStep = (step: CompletionStep) => {
    steps.push(step)

    void options.onStepFinish?.(step)
  }

  const doStream = async () => {
    const { body: stream } = await chat({
      ...options,
      maxSteps: undefined,
      messages,
      stream: true,
      streamOptions: options.streamOptions != null
        ? objCamelToSnake(options.streamOptions)
        : undefined,
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
                pushEvent({ toolCallId: toolCall.id, toolName: toolCall.function.name!, type: 'tool-call-streaming-start' })
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
          tools: options.tools,
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

    pushStep({
      finishReason,
      stepType: determineStepType({ finishReason, maxSteps, stepsLength: steps.length, toolCallsLength: toolCalls.length }),
      text,
      toolCalls,
      toolResults,
      usage,
    })

    if (toolCalls.length !== 0 && steps.length < maxSteps)
      return async () => doStream()
  }

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

      void options.onFinish?.(steps.at(-1))
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
}
