import type { AssistantMessage, ChatOptions, CompletionToolCall, CompletionToolResult, FinishReason, Message, StepType, StreamTextDataChunk, Tool, ToolCall, ToolMessagePart, Usage } from '@xsai/shared-chat'

import { XSAIError } from '@xsai/shared'
import { chat, determineStepType, executeTool } from '@xsai/shared-chat'

import { parseChunk } from './helper'

/**
 * practically the same structure as response from openai api
 */
export interface StreamTextChunkResult {
  choices: {
    delta: {
      content?: string
      refusal?: string
      role: 'assistant'
      tool_calls?: ToolCall[]
    }
    finish_reason?: FinishReason
    index: number
  }[]
  created: number
  id: string
  model: string
  object: 'chat.completion.chunk'
  system_fingerprint: string
  usage?: Usage
}

/**
 * Options for configuring the StreamText functionality.
 */
export interface StreamTextOptions extends ChatOptions {

  /** @default 1 */
  maxSteps?: number

  /**
   * Callback function that is called with each chunk of the stream.
   * @param chunk - The current chunk of the stream.
   */
  onChunk?: (chunk: StreamTextChunkResult) => Promise<unknown> | unknown

  onDataChunk?: (chunk: StreamTextDataChunk) => Promise<unknown> | unknown

  /**
   * Callback function that is called when an error occurs.
   * @param error - The error that occurred.
   */
  onError?: (error: Error) => Promise<unknown> | unknown

  /**
   * Callback function that is called when the stream is finished.
   * @param result - The final result of the stream.
   */
  onFinish?: (steps: StreamTextStep[]) => Promise<unknown> | unknown

  /**
   * Callback function that is called when a step in the stream is finished.
   * @param step - The result of the finished step.
   */
  onStepFinish?: (step: StreamTextStep) => Promise<unknown> | unknown

  /**
   * If you want to disable stream, use `@xsai/generate-{text,object}`.
   */
  stream?: never

  /**
   * Options for configuring the stream.
   */
  streamOptions?: {
    /**
     * Return usage.
     * @default `undefined`
     * @remarks Ollama doesn't support this, see {@link https://github.com/ollama/ollama/issues/5200}
     */
    usage?: boolean
  }

  /**
   * List of tools to be used in the stream.
   */
  tools?: Tool[]
}

export interface StreamTextResult {
  chunkStream: ReadableStream<StreamTextChunkResult>
  dataChunkStream: ReadableStream<StreamTextDataChunk>
  stepStream: ReadableStream<StreamTextStep>
  textStream: ReadableStream<string>
}

export interface StreamTextStep {
  choices: StreamTextChoice[]
  finishReason: FinishReason
  messages: Message[]
  stepType: StepType
  toolCalls: CompletionToolCall[]
  toolResults: CompletionToolResult[]
  usage?: Usage
}

/** @internal */
type RecursivePromise<T> = Promise<(() => RecursivePromise<T>) | T>

/** @internal */
interface StreamTextChoice {
  finishReason?: FinishReason | null
  index: number
  message: StreamTextMessage
}

/** @internal */
interface StreamTextChoiceState {
  calledToolCallIndex: Set<number>
  currentToolIndex: null | number
  endedToolCallIndex: Set<number>
  index: number
  toolCallErrors: { [id: string]: Error }
  toolCallResults: { [id: string]: string | ToolMessagePart[] }
}

/** @internal */
interface StreamTextMessage extends Omit<AssistantMessage, 'tool_calls'> {
  content?: string
  toolCallIndexMap?: { [id: number]: StreamTextToolCall }
}

/** @internal */
interface StreamTextToolCall extends ToolCall {
  function: ToolCall['function'] & {
    parsedArguments: Record<string, unknown>
  }
  index: number
}

export const streamText = async (options: StreamTextOptions): Promise<StreamTextResult> => {
  // output
  let chunkCtrl: ReadableStreamDefaultController<StreamTextChunkResult>
  let stepCtrl: ReadableStreamDefaultController<StreamTextStep>
  let textCtrl: ReadableStreamDefaultController<string>
  let dataChunkCtrl: ReadableStreamDefaultController<StreamTextDataChunk>

  const chunkStream = new ReadableStream<StreamTextChunkResult>({
    start(controller) {
      chunkCtrl = controller
    },
  })
  const stepStream = new ReadableStream<StreamTextStep>({
    start(controller) {
      stepCtrl = controller
    },
  })
  const textStream = new ReadableStream<string>({
    start(controller) {
      textCtrl = controller
    },
  })
  const dataChunkStream = new ReadableStream<StreamTextDataChunk>({
    start(controller) {
      dataChunkCtrl = controller
    },
  })

  // constraints
  const maxSteps = options.maxSteps ?? 1

  // utils
  const decoder = new TextDecoder()

  // state
  const steps: StreamTextStep[] = []
  const stepOne = async (options: StreamTextOptions): RecursivePromise<void> => {
    const step: StreamTextStep = {
      choices: [],
      finishReason: 'error',
      messages: structuredClone(options.messages),
      stepType: 'initial',
      toolCalls: [],
      toolResults: [],
    }
    const choiceState: Record<string, StreamTextChoiceState> = {}

    let buffer = ''

    let finishReason: FinishReason | undefined
    let usage: undefined | Usage

    let shouldOutputText: boolean = true

    const endToolCallByIndex = (state: StreamTextChoiceState, idx: number) => {
      if (state.endedToolCallIndex.has(idx)) {
        return
      }

      state.endedToolCallIndex.add(idx)
      state.currentToolIndex = null
    }

    await chat({
      ...options,
      stream: true,
    }).then(async res => res.body!.pipeThrough(new TransformStream({
      transform: async (chunk, controller: TransformStreamDefaultController<StreamTextChunkResult>) => {
        const text = decoder.decode(chunk, { stream: true })
        buffer += text
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''

        // Process complete lines
        for (const line of lines) {
          try {
            const [chunk, isEnd] = parseChunk(line)
            if (isEnd)
              break

            if (chunk) {
              controller.enqueue(chunk)
            }
          }
          catch (error) {
            controller.error(error)
          }
        }
      },
    })).pipeTo(new WritableStream({
      abort: (reason) => {
        chunkCtrl.error(reason)
        dataChunkCtrl.error(reason)
        stepCtrl.error(reason)
        textCtrl.error(reason)
      },
      close: () => {
        dataChunkCtrl.enqueue({
          finishReason,
          type: 'finish',
          usage,
        })
        options.onDataChunk?.({
          finishReason,
          type: 'finish',
          usage,
        })
      },
      // eslint-disable-next-line sonarjs/cognitive-complexity
      write: async (chunk) => {
        options.onChunk?.(chunk)
        chunkCtrl.enqueue(chunk)

        usage = chunk.usage

        const choice = chunk.choices[0]

        // not likely to happen, but just in case
        // eslint-disable-next-line ts/strict-boolean-expressions
        if (!choice)
          throw new XSAIError('no choice found')

        // mark this time as non-text output if is has tool calls
        if (choice.delta.tool_calls) {
          shouldOutputText = false
        }

        const { delta, finish_reason, index, ...rest } = choice
        const choiceSnapshot: StreamTextChoice = step.choices[index] ??= {
          finishReason: finish_reason,
          index,
          message: {
            role: 'assistant',
          },
        }

        if (finish_reason !== undefined) {
          step.finishReason = finish_reason
          choiceSnapshot.finishReason = finish_reason
          finishReason = finish_reason

          if (finish_reason === 'length') {
            throw new XSAIError('length exceeded')
          }

          if (finish_reason === 'content_filter') {
            throw new XSAIError('content filter')
          }
        }

        Object.assign(choiceSnapshot, rest)

        const { content, refusal, tool_calls, ...rests } = delta
        const message = choiceSnapshot.message
        Object.assign(message, rests)

        if (refusal !== undefined) {
          // eslint-disable-next-line ts/strict-boolean-expressions
          message.refusal = (message.refusal || '') + refusal

          dataChunkCtrl.enqueue({
            refusal,
            type: 'refusal',
          })
          options.onDataChunk?.({
            refusal,
            type: 'refusal',
          })
        }

        if (content !== undefined) {
          // eslint-disable-next-line ts/strict-boolean-expressions
          message.content = (message.content || '') + content
          shouldOutputText && textCtrl?.enqueue(content)

          dataChunkCtrl.enqueue({
            text: content,
            type: 'text-delta',
          })
          options.onDataChunk?.({
            text: content,
            type: 'text-delta',
          })
        }

        for (const tool_call of tool_calls || []) {
          dataChunkCtrl.enqueue({
            toolCall: tool_call,
            type: 'tool-call-delta',
          })
          options.onDataChunk?.({
            toolCall: tool_call,
            type: 'tool-call-delta',
          })

          message.toolCallIndexMap ??= {}

          const toolCall = message.toolCallIndexMap[tool_call.index] ??= {
            function: {
              arguments: '',
              name: tool_call.function.name,
              parsedArguments: {},
            },
            id: tool_call.id, // it should always have a id when appears for the first time
            index: tool_call.index,
            type: tool_call.type,
          }

          toolCall.function.arguments += tool_call.function.arguments
        }

        /**
         * check if tool call is ended
         */
        const state = choiceState[index] ??= {
          calledToolCallIndex: new Set(),
          currentToolIndex: null,
          endedToolCallIndex: new Set(),
          index,
          toolCallErrors: {},
          toolCallResults: {},
        }
        // eslint-disable-next-line ts/strict-boolean-expressions
        if (finish_reason) {
          // end choice will end the current tool call too
          if (state.currentToolIndex !== null) {
            endToolCallByIndex(state, state.currentToolIndex)
          }
        }
        for (const toolCall of delta.tool_calls || []) {
          // new tool call
          if (state.currentToolIndex !== toolCall.index && state.currentToolIndex !== null) {
            endToolCallByIndex(state, state.currentToolIndex)
          }

          state.calledToolCallIndex.add(toolCall.index)
          state.currentToolIndex = toolCall.index
        }
      },
    })),
    )

    // if the chat has tool calls, then content probably will be empty
    // but we still push it anyway
    step.messages.push({
      content: step.choices[0]?.message.content ?? '',
      refusal: step.choices[0]?.message.refusal,
      role: 'assistant',
    } satisfies StreamTextMessage)

    // make actual tool call and wait
    await Promise.allSettled(step.choices.map(async (choice) => {
      const state = choiceState[choice.index]

      return Promise.allSettled([...state.endedToolCallIndex].map(async (idx) => {
        const toolCall = choice.message.toolCallIndexMap![idx]
        step.toolCalls.push({
          args: toolCall.function.arguments,
          toolCallId: toolCall.id,
          toolCallType: 'function',
          toolName: toolCall.function.name,
        })

        // eslint-disable-next-line ts/strict-boolean-expressions
        if (state.toolCallResults[toolCall.id]) {
          return
        }

        dataChunkCtrl.enqueue({
          toolCall,
          type: 'tool-call',
        })
        options.onDataChunk?.({
          toolCall,
          type: 'tool-call',
        })

        try {
          const { parsedArgs, result, toolName } = await executeTool({
            abortSignal: options.abortSignal,
            messages: options.messages,
            toolCall,
            tools: options.tools,
          })

          toolCall.function.parsedArguments = parsedArgs

          state.toolCallResults[toolCall.id] = result
          step.messages.push({
            content: result,
            role: 'tool',
            tool_call_id: toolCall.id,
          })
          step.toolResults.push({
            args: parsedArgs,
            result,
            toolCallId: toolCall.id,
            toolName,
          })

          dataChunkCtrl.enqueue({
            id: toolCall.id,
            result,
            type: 'tool-call-result',
          })
          options.onDataChunk?.({
            id: toolCall.id,
            result,
            type: 'tool-call-result',
          })
        }
        catch (error) {
          state.toolCallErrors[idx] = error as Error
          dataChunkCtrl.enqueue({
            error,
            id: toolCall.id,
            type: 'tool-call-result',
          })
          options.onDataChunk?.({
            error,
            id: toolCall.id,
            type: 'tool-call-result',
          })
        }
      }))
    }))

    step.stepType = determineStepType({
      finishReason: step.finishReason,
      maxSteps,
      stepsLength: steps.length,
      toolCallsLength: step.toolCalls.length,
    })

    steps.push(step)
    stepCtrl.enqueue(step)

    options.onStepFinish?.(step)

    if (shouldOutputText) {
      return
    }

    return async () => stepOne({ ...options, messages: step.messages })
  }

  const invokeFunctionCalls = async () => {
    let ret = await stepOne(options)

    while (typeof ret === 'function' && steps.length < maxSteps)
      ret = await ret()

    options.onFinish?.(steps)
    chunkCtrl.close()
    dataChunkCtrl.close()
    stepCtrl.close()
    textCtrl.close()
  }

  void invokeFunctionCalls().catch((error) => {
    const actualError = error instanceof Error ? error : new Error(String(error))
    options.onError?.(actualError)
    chunkCtrl.error(error)
    dataChunkCtrl.error(error)
    stepCtrl.error(error)
    textCtrl.error(error)
  })

  return Promise.resolve({
    chunkStream,
    dataChunkStream,
    stepStream,
    textStream,
  })
}
