import type { ChatOptions, CompletionStep, CompletionToolCall, CompletionToolResult, FinishReason, Message, ToolCall, Usage } from '@xsai/shared-chat'

import { objCamelToSnake, trampoline } from '@xsai/shared'
import { chat, determineStepType, executeTool } from '@xsai/shared-chat'

import type { StreamTextEvent } from './types/event'

import { transformChunk } from './_transform-chunk'
import { DelayedPromise } from './internal/delayed-promise'

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
  steps: Promise<CompletionStep[]>
  textStream: ReadableStream<string>
  usage: Promise<undefined | Usage>
  // TODO: totalUsage
}

export const streamText = async (options: StreamTextOptions): Promise<StreamTextResult> => {
  // state
  const steps: CompletionStep[] = []
  const messages: Message[] = structuredClone(options.messages)
  const maxSteps = options.maxSteps ?? 1
  let usage: undefined | Usage

  // result state
  const resultSteps = new DelayedPromise<CompletionStep[]>()
  const resultMessages = new DelayedPromise<Message[]>()
  const resultUsage = new DelayedPromise<undefined | Usage>()

  // output
  let eventCtrl: ReadableStreamDefaultController<StreamTextEvent> | undefined
  let textCtrl: ReadableStreamDefaultController<string> | undefined
  const eventStream = new ReadableStream<StreamTextEvent>({ start: controller => eventCtrl = controller })
  const textStream = new ReadableStream<string>({ start: controller => textCtrl = controller })

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

  const startStream = async () => {
    // let stepUsage: undefined | Usage
    const pushUsage = (u: Usage) => {
      usage = u
      // stepUsage = u
    }

    let text: string = ''
    const pushText = (content?: string) => {
      textCtrl?.enqueue(content)
      text += content
    }

    const toolCalls: ToolCall[] = []
    const toolResults: CompletionToolResult[] = []
    let finishReason: FinishReason = 'other'

    await chat({
      ...options,
      maxSteps: undefined,
      messages,
      stream: true,
      streamOptions: options.streamOptions != null
        ? objCamelToSnake(options.streamOptions)
        : undefined,
    }).then(async res => res.body!
      .pipeThrough(transformChunk())
      .pipeTo(new WritableStream({
        abort: (reason) => {
          eventCtrl?.error(reason)
          textCtrl?.error(reason)
        },
        close: () => {},
        write: (chunk) => {
          if (chunk.usage)
            pushUsage(chunk.usage)

          // skip if no choices
          if (chunk.choices == null || chunk.choices.length === 0)
            return

          const choice = chunk.choices[0]

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

              if (!toolCalls.at(index)) {
                toolCalls[index] = toolCall
                pushEvent({ toolCallId: toolCall.id, toolName: toolCall.function.name, type: 'tool-call-streaming-start' })
              }
              else {
                toolCalls[index].function.arguments += toolCall.function.arguments
                pushEvent({ argsTextDelta: toolCall.function.arguments, toolCallId: toolCall.id, toolName: toolCall.function.name, type: 'tool-call-delta' })
              }
            }
          }
        },
      })),
    )

    if (toolCalls.length !== 0) {
      for (const toolCall of toolCalls) {
        pushEvent({ args: toolCall.function.arguments, toolCallId: toolCall.id, toolName: toolCall.function.name, type: 'tool-call' })

        const { parsedArgs, result } = await executeTool({
          abortSignal: options.abortSignal,
          messages,
          toolCall,
          tools: options.tools,
        })

        pushEvent({ args: parsedArgs, result, toolCallId: toolCall.id, toolName: toolCall.function.name, type: 'tool-result' })

        toolResults.push({ args: parsedArgs, result, toolCallId: toolCall.id, toolName: toolCall.function.name })

        // TODO: executeTool return message, toolCall, toolResult
        messages.push({
          content: result,
          role: 'tool',
          tool_call_id: toolCall.id,
        })
      }
    }
    else {
      messages.push({ content: text, role: 'assistant' })
    }

    pushStep({
      finishReason,
      stepType: determineStepType({ finishReason, maxSteps, stepsLength: steps.length, toolCallsLength: toolCalls.length }),
      text,
      toolCalls: toolCalls.map(toolCall => ({
        args: toolCall.function.arguments,
        toolCallId: toolCall.id,
        toolCallType: toolCall.type,
        toolName: toolCall.function.name,
      }) satisfies CompletionToolCall),
      toolResults,
      usage,
    })

    if (toolCalls.length !== 0 && steps.length < maxSteps)
      return async () => startStream()
  }

  try {
    await trampoline(async () => startStream())
  }
  catch (err) {
    eventCtrl?.error(err)
    textCtrl?.error(err)

    resultSteps.reject(err)
    resultMessages.reject(err)
    resultUsage.reject(err)
  }
  finally {
    eventCtrl?.close()
    textCtrl?.close()

    resultSteps.resolve(steps)
    resultMessages.resolve(messages)
    resultUsage.resolve(usage)

    // eslint-disable-next-line sonarjs/void-use
    void options.onFinish?.(steps.at(-1))
  }

  return {
    fullStream: eventStream,
    messages: resultMessages.promise,
    steps: resultSteps.promise,
    textStream,
    usage: resultUsage.promise,
  }
}
