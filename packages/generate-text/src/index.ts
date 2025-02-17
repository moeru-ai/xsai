import type { AssistantMessageResponse, ChatOptions, FinishReason, Message, Tool, Usage } from '@xsai/shared-chat'

import { chat } from '@xsai/shared-chat'

export interface GenerateTextOptions extends ChatOptions {
  /** @default 1 */
  maxSteps?: number
  onStepFinish?: (step: GenerateTextStepResult) => Promise<void> | void
  /** @internal */
  steps?: GenerateTextStepResult[]
  /** if you want to enable stream, use `@xsai/stream-{text,object}` */
  stream?: never
  tools?: Tool[]
}

export interface GenerateTextResponse {
  choices: {
    finish_reason: FinishReason
    index: number
    message: AssistantMessageResponse
  }[]
  created: number
  id: string
  model: string
  object: 'chat.completion'
  system_fingerprint: string
  usage: Usage
}

export interface GenerateTextResult {
  finishReason: FinishReason
  messages: Message[]
  steps: GenerateTextStepResult[]
  text?: string
  toolCalls: GenerateTextToolCall[]
  toolResults: GenerateTextToolResult[]
  usage: Usage
}

export interface GenerateTextStepResult {
  finishReason: FinishReason
  stepType: 'continue' | 'initial' | 'tool-result'
  text?: string
  toolCalls: GenerateTextToolCall[]
  toolResults: GenerateTextToolResult[]
  usage: Usage
}

export interface GenerateTextToolCall {
  args: string
  toolCallId: string
  toolCallType: 'function'
  toolName: string
}

export interface GenerateTextToolResult {
  args: Record<string, unknown>
  result: string
  toolCallId: string
  toolName: string
}

/** @internal */
type RawGenerateText = (options: GenerateTextOptions) => RawGenerateTextTrampoline<GenerateTextResult>

/** @internal */
type RawGenerateTextTrampoline<T> = Promise<(() => RawGenerateTextTrampoline<T>) | T>

/** @internal */
const rawGenerateText: RawGenerateText = async (options: GenerateTextOptions) =>
  chat({
    ...options,
    maxSteps: undefined,
    messages: options.messages,
    steps: undefined,
    stream: false,
  })
    .then(async res => res.json() as Promise<GenerateTextResponse>)
    .then(async ({ choices, usage }) => {
      const messages: Message[] = structuredClone(options.messages)
      const steps: GenerateTextStepResult[] = options.steps ? structuredClone(options.steps) : []
      const toolCalls: GenerateTextToolCall[] = []
      const toolResults: GenerateTextToolResult[] = []

      const { finish_reason: finishReason, message } = choices[0]

      messages.push({ ...message, content: message.content! })

      const stepType = steps.length === 0
        ? 'initial'
        // eslint-disable-next-line sonarjs/no-nested-conditional
        : steps.at(-1)?.finishReason === 'tool-calls'
          ? 'tool-result'
          : 'continue'

      if ((message.content !== undefined && message.content.length > 0) || !message.tool_calls || steps.length >= (options.maxSteps ?? 1)) {
        const step: GenerateTextStepResult = {
          finishReason,
          stepType,
          text: message.content,
          toolCalls,
          toolResults,
          usage,
        }

        steps.push(step)

        if (options.onStepFinish)
          await options.onStepFinish(step)

        return {
          finishReason,
          messages,
          steps,
          text: message.content,
          toolCalls,
          toolResults,
          usage,
        }
      }

      for (const {
        function: { arguments: toolArgs, name: toolName },
        id: toolCallId,
        type: toolCallType,
      } of message.tool_calls) {
        const tool = options.tools?.find(tool => tool.function.name === toolName)

        if (!tool) {
          const availableTools = options.tools?.map(tool => tool.function.name)
          const availableToolsErrorMsg = availableTools === undefined
            ? 'No tools are available.'
            : `Available tools: ${availableTools.join(', ')}.`
          throw new Error(`Model tried to call unavailable tool '${toolName}. ${availableToolsErrorMsg}.`)
        }

        const parsedArgs = JSON.parse(toolArgs) as Record<string, unknown>
        const result = await tool.execute(parsedArgs, { abortSignal: options.abortSignal, messages, toolCallId })

        toolCalls.push({
          args: toolArgs,
          toolCallId,
          toolCallType,
          toolName,
        })

        toolResults.push({
          args: parsedArgs,
          result,
          toolCallId,
          toolName,
        })

        messages.push({
          content: result,
          role: 'tool',
          tool_call_id: toolCallId,
        })
      }

      const step: GenerateTextStepResult = {
        finishReason,
        stepType,
        text: message.content,
        toolCalls,
        toolResults,
        usage,
      }

      steps.push(step)

      if (options.onStepFinish)
        await options.onStepFinish(step)

      return async () => rawGenerateText({
        ...options,
        messages,
        steps,
      })
    })

export const generateText = async (options: GenerateTextOptions): Promise<GenerateTextResult> => {
  let result = await rawGenerateText(options)

  while (typeof result === 'function')
    result = await result()

  return result
}
