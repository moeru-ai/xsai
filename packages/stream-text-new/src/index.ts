import type { ChatOptions, Message, Tool, ToolCall, Usage } from '@xsai/shared-chat'

import { objCamelToSnake, trampoline } from '@xsai/shared'
import { chat, executeTool } from '@xsai/shared-chat'

import type { StreamTextStepEvent } from './types/step-event'

import { transformChunk } from './_transform-chunk'

export interface StreamTextOptions extends ChatOptions {
  /** @default 1 */
  maxSteps?: number
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
  tools?: Tool[]
}

export interface StreamTextResult {
  fullStream: ReadableStream<StreamTextStepEvent>
  textStream: ReadableStream<string>
}

export const streamText = async (options: StreamTextOptions): Promise<StreamTextResult> => {
  // state
  const steps = []
  const messages: Message[] = structuredClone(options.messages)

  // output
  let fullCtrl: ReadableStreamDefaultController<StreamTextStepEvent> | undefined
  let textCtrl: ReadableStreamDefaultController<string> | undefined
  const fullStream = new ReadableStream<StreamTextStepEvent>({ start: controller => fullCtrl = controller })
  const textStream = new ReadableStream<string>({ start: controller => textCtrl = controller })

  const startStream = async () => {
    let usage: undefined | Usage

    const toolCalls: ToolCall[] = []

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
          fullCtrl?.error(reason)
          textCtrl?.error(reason)
        },
        close: () => {},
        write: (chunk) => {
          if (chunk.usage)
            usage = chunk.usage

          // skip if no choices
          if (chunk.choices == null || chunk.choices.length === 0)
            return

          const choice = chunk.choices[0]

          if (choice.delta.tool_calls?.length === 0 || choice.delta.tool_calls == null) {
            if (choice.delta.content != null) {
              fullCtrl?.enqueue({ text: choice.delta.content, type: 'text-delta' })
              textCtrl?.enqueue(choice.delta.content)
            }
            else if (choice.delta.refusal != null) {
              fullCtrl?.enqueue({ error: choice.delta.refusal, type: 'error' })
            }
            else if (choice.finish_reason != null && choice.finish_reason !== 'tool-calls') {
              fullCtrl?.enqueue({ finishReason: choice.finish_reason, type: 'finish', usage })
            }
          }
          else {
            // https://platform.openai.com/docs/guides/function-calling?api-mode=chat&lang=javascript#streaming
            for (const toolCall of choice.delta.tool_calls) {
              const { index } = toolCall

              if (!toolCalls.at(index)) {
                toolCalls[index] = toolCall
                fullCtrl?.enqueue({ toolCallId: toolCall.id, toolName: toolCall.function.name, type: 'tool-call-streaming-start' })
              }
              else {
                toolCalls[index].function.arguments += toolCall.function.arguments
                fullCtrl?.enqueue({ argsTextDelta: toolCall.function.arguments, toolCallId: toolCall.id, toolName: toolCall.function.name, type: 'tool-call-delta' })
              }
            }
          }
        },
      })),
    )

    if (toolCalls.length === 0)
      return

    for (const toolCall of toolCalls) {
      fullCtrl?.enqueue({ args: toolCall.function.arguments, toolCallId: toolCall.id, toolName: toolCall.function.name, type: 'tool-call' })

      const { parsedArgs, result } = await executeTool({
        abortSignal: options.abortSignal,
        messages,
        toolCall,
        tools: options.tools,
      })

      fullCtrl?.enqueue({ args: parsedArgs, result, toolCallId: toolCall.id, toolName: toolCall.function.name, type: 'tool-result' })

      // TODO: executeTool return message
      messages.push({
        // content: result,
        content: 'success',
        role: 'tool',
        tool_call_id: toolCall.id,
      })
    }

    steps.push('TODO')

    if (steps.length < (options.maxSteps ?? 1))
      return async () => startStream()
  }

  try {
    await trampoline(async () => startStream())
  }
  finally {
    fullCtrl?.close()
    textCtrl?.close()
  }

  return { fullStream, textStream }
}
