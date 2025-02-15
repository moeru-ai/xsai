import type { ChatOptions, Tool } from '@xsai/shared-chat'

import { chat } from '@xsai/shared-chat'

import type { ChoiceState, Step, StreamTextChunkResult } from './const'

import { parseChunk } from './helper'

export * from './const'

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
  onChunk?: (chunk: StreamTextChunkResult) => Promise<void> | void

  /**
   * Callback function that is called when the stream is finished.
   * @param result - The final result of the stream.
   */
  onFinish?: (steps: Step[]) => Promise<void> | void

  /**
   * Callback function that is called when a step in the stream is finished.
   * @param step - The result of the finished step.
   */
  onStepFinish?: (step: Step) => Promise<void> | void

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
  stepStream: ReadableStream<Step>
  textStream: ReadableStream<string>
}

export const streamText = (options: StreamTextOptions): StreamTextResult => {
  // output
  let chunkCtrl: ReadableStreamDefaultController<StreamTextChunkResult> | undefined
  let stepCtrl: ReadableStreamDefaultController<Step> | undefined
  let textCtrl: ReadableStreamDefaultController<string> | undefined

  // constraints
  const maxSteps = options.maxSteps ?? 1

  // utils
  const decoder = new TextDecoder()

  // state
  const steps: Step[] = []

  void (async () => {
    const stepOne = async (options: StreamTextOptions): Promise<(() => Promise<void>) | void> => {
      const step: Step = {
        choices: [],
        messages: structuredClone(options.messages),
      }
      const choiceState: Record<string, ChoiceState> = {}
      let buffer = ''
      let shouldOutputText: boolean = true

      const endToolCall = (state: ChoiceState, id: string) => {
        if (state.endedToolCallIDs.has(id)) {
          return
        }

        const toolCall = step.choices[state.index].message.tool_calls![id]
        try {
          toolCall.function.parsed_arguments = JSON.parse(toolCall.function.arguments) as Record<string, unknown>
        }
        catch (error) {
          state.toolCallErrors[id] = error as Error
        }

        state.endedToolCallIDs.add(id)
        state.currentToolID = null
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
                chunkCtrl?.enqueue(chunk)
              }
            }
            catch (error) {
              controller.error(error)
              chunkCtrl?.error(error)
            }
          }
        },
      })).pipeTo(new WritableStream({
        write: async (chunk) => {
          // eslint-disable-next-line ts/no-floating-promises
          options.onChunk?.(chunk)

          const choice = chunk.choices[0]

          // mark this time as non-text output if is has toolcalls
          if (choice.delta.tool_calls) {
            shouldOutputText = false
          }

          const { delta, finish_reason, index, ...rest } = choice
          const choiceSnapshot: Step.Choice = step.choices[index] ??= {
            finish_reason,
            index,
            message: {
              content: null,
              refusal: null,
              role: 'assistant',
            },
          }

          if (finish_reason !== undefined) {
            choiceSnapshot.finish_reason = finish_reason

            if (finish_reason === 'length') {
              throw new Error('length exceeded')
            }

            if (finish_reason === 'content_filter') {
              throw new Error('content filter')
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
              },
            } as Step.Choice.Message.ToolCall
            toolCall.id = id
            toolCall.type = type
            toolCall.function.arguments += fn.arguments
          }

          /**
           * check if toolcall is ended
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
            // end choice will end the current toolcall too
            if (state.currentToolID !== null) {
              endToolCall(state, state.currentToolID)
            }
          }
          for (const toolCall of delta.tool_calls || []) {
            // new toolcall
            if (state.currentToolID !== null && state.currentToolID !== toolCall.id) {
              endToolCall(state, state.currentToolID)
            }

            state.calledToolCallIDs.add(toolCall.id)
            state.currentToolID = toolCall.id
          }
        },
      })),
      )

      shouldOutputText && step.messages.push({
        content: step.choices[0].message.content ?? '',
        refusal: step.choices[0].message.refusal,
        role: 'assistant',
      })

      // make actual toolcall and wait
      await Promise.allSettled(step.choices.map(async (choice) => {
        const state = choiceState[choice.index]

        return Promise.allSettled([...state.endedToolCallIDs].map(async (id) => {
          // eslint-disable-next-line ts/strict-boolean-expressions
          if (state.toolCallErrors[id]) {
            return
          }

          const toolCall = choice.message.tool_calls![id]
          const tool = options.tools?.find(tool => tool.function.name === toolCall.function.name)
          if (tool) {
            try {
              const ret = await tool.execute(toolCall.function.parsed_arguments, {
                abortSignal: options.abortSignal,
                messages: options.messages,
                toolCallId: id,
              })
              state.toolCallResults[id] = ret
              step.messages.push({
                content: ret,
                role: 'tool',
                tool_call_id: id,
              })
            }
            catch (error) {
              state.toolCallErrors[id] = error as Error
            }
          }
          else {
            state.toolCallErrors[id] = new Error(`tool ${toolCall.function.name} not found`)
          }
        }))
      }))

      steps.push(step)
      stepCtrl?.enqueue(step)
      // eslint-disable-next-line ts/no-floating-promises
      options.onStepFinish?.(step)

      if (shouldOutputText) {
        return
      }

      return stepOne({ ...options, messages: step.messages })
    }

    for (
      let i = 1, ret = await stepOne(options);
      typeof ret === 'function' && i < maxSteps;
      ret = await ret(), i += 1
    ) {
      void 0
    }

    // eslint-disable-next-line ts/no-floating-promises
    options.onFinish?.(steps)
    chunkCtrl?.close()
    stepCtrl?.close()
    textCtrl?.close()
  })()

  return new Proxy(new Object(null) as StreamTextResult, {
    get: (_, prop) => {
      if (prop === 'chunkStream') {
        return new ReadableStream<StreamTextChunkResult>({
          start(controller) {
            chunkCtrl = controller
          },
        })
      }
      if (prop === 'stepStream') {
        return new ReadableStream<Step>({
          start(controller) {
            stepCtrl = controller
          },
        })
      }
      if (prop === 'textStream') {
        return new ReadableStream<string>({
          start(controller) {
            textCtrl = controller
          },
        })
      }
    },
  })
}
