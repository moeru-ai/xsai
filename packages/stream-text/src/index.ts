import type { AssistantMessage, ChatOptions, CompletionToolCall, CompletionToolResult, FinishReason, Message, StepType, Tool, ToolCall, ToolMessagePart, Usage } from '@xsai/shared-chat'

import { objCamelToSnake, XSAIError } from '@xsai/shared'
import { chat, determineStepType, executeTool } from '@xsai/shared-chat'

import { parseChunk } from './helper'

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
     */
    includeUsage?: boolean
  }

  /**
   * List of tools to be used in the stream.
   */
  tools?: Tool[]
}

export interface StreamTextResult {
  chunkStream: ReadableStream<StreamTextChunkResult>
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
  finish_reason?: FinishReason | null
  index: number
  message: StreamTextMessage
}

/** @internal */
interface StreamTextChoiceState {
  calledToolCallIDs: Set<string>
  currentToolID: null | string
  endedToolCallIDs: Set<string>
  index: number
  toolCallErrors: { [id: string]: Error }
  toolCallResults: { [id: string]: string | ToolMessagePart[] }
}

/** @internal */
interface StreamTextMessage extends Omit<AssistantMessage, 'tool_calls'> {
  content?: string
  tool_calls?: { [id: string]: StreamTextToolCall }
}

/** @internal */
interface StreamTextToolCall extends ToolCall {
  function: ToolCall['function'] & {
    parsed_arguments: Record<string, unknown>
  }
}

export const streamText = async (options: StreamTextOptions): Promise<StreamTextResult> => {
  // output
  let chunkCtrl: ReadableStreamDefaultController<StreamTextChunkResult>
  let stepCtrl: ReadableStreamDefaultController<StreamTextStep>
  let textCtrl: ReadableStreamDefaultController<string>

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
    let shouldOutputText: boolean = true

    const endToolCall = (state: StreamTextChoiceState, id: string) => {
      if (state.endedToolCallIDs.has(id)) {
        return
      }

      state.endedToolCallIDs.add(id)
      state.currentToolID = null
    }

    await chat({
      ...options,
      stream: true,
      streamOptions: options.streamOptions != null
        ? objCamelToSnake(options.streamOptions)
        : undefined,
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
        stepCtrl.error(reason)
        textCtrl.error(reason)
      },
      // eslint-disable-next-line sonarjs/cognitive-complexity
      write: async (chunk) => {
        options.onChunk?.(chunk)
        chunkCtrl.enqueue(chunk)

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
          finish_reason,
          index,
          message: {
            role: 'assistant',
          },
        }

        if (finish_reason !== undefined) {
          step.finishReason = finish_reason
          choiceSnapshot.finish_reason = finish_reason

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
        }

        if (content !== undefined) {
          // eslint-disable-next-line ts/strict-boolean-expressions
          message.content = (message.content || '') + content
          shouldOutputText && textCtrl?.enqueue(content)
        }

        for (const { function: fn, id, type } of tool_calls || []) {
          message.tool_calls ??= {}

          const toolCall = message.tool_calls[id] ??= {
            function: {
              arguments: '',
              name: fn.name,
              parsed_arguments: {},
            },
            id,
            type,
          } satisfies StreamTextToolCall
          toolCall.function.arguments += fn.arguments
        }

        /**
         * check if tool call is ended
         */
        const state = choiceState[index] ??= {
          calledToolCallIDs: new Set(),
          currentToolID: null,
          endedToolCallIDs: new Set(),
          index,
          toolCallErrors: {},
          toolCallResults: {},
        }
        // eslint-disable-next-line ts/strict-boolean-expressions
        if (finish_reason) {
          // end choice will end the current tool call too
          if (state.currentToolID !== null) {
            endToolCall(state, state.currentToolID)
          }
        }
        for (const toolCall of delta.tool_calls || []) {
          // new tool call
          if (state.currentToolID !== null && state.currentToolID !== toolCall.id) {
            endToolCall(state, state.currentToolID)
          }

          state.calledToolCallIDs.add(toolCall.id)
          state.currentToolID = toolCall.id
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

      return Promise.allSettled([...state.endedToolCallIDs].map(async (id) => {
        const toolCall = choice.message.tool_calls![id]
        step.toolCalls.push({
          args: toolCall.function.arguments,
          toolCallId: id,
          toolCallType: 'function',
          toolName: toolCall.function.name,
        })

        // eslint-disable-next-line ts/strict-boolean-expressions
        if (state.toolCallResults[id]) {
          return
        }

        try {
          const { parsedArgs, result, toolName } = await executeTool({
            abortSignal: options.abortSignal,
            messages: options.messages,
            toolCall,
            tools: options.tools,
          })

          toolCall.function.parsed_arguments = parsedArgs

          state.toolCallResults[id] = result
          step.messages.push({
            content: result,
            role: 'tool',
            tool_call_id: id,
          })
          step.toolResults.push({
            args: parsedArgs,
            result,
            toolCallId: id,
            toolName,
          })
        }
        catch (error) {
          state.toolCallErrors[id] = error as Error
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
    stepCtrl.close()
    textCtrl.close()
  }

  void invokeFunctionCalls().catch((error) => {
    chunkCtrl.error(error)
    stepCtrl.error(error)
    textCtrl.error(error)
  })

  return Promise.resolve({
    chunkStream,
    stepStream,
    textStream,
  })
}
