import type { AssistantMessageResponse, ChatOptions, CompletionToolCall, CompletionToolResult, FinishReason, Message, Tool, Usage } from '@xsai/shared-chat'

import { chat, wrapToolResult } from '@xsai/shared-chat'

export interface GenerateTextOptions extends ChatOptions {
  /** @default 1 */
  maxSteps?: number
  onStepFinish?: (step: GenerateTextStepResult) => Promise<unknown> | unknown
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
  toolCalls: CompletionToolCall[]
  toolResults: CompletionToolResult[]
  usage: Usage
}

export interface GenerateTextStepResult {
  finishReason: FinishReason
  stepType: 'continue' | 'done' | 'initial' | 'tool-result'
  text?: string
  toolCalls: CompletionToolCall[]
  toolResults: CompletionToolResult[]
  usage: Usage
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
      const toolCalls: CompletionToolCall[] = []
      const toolResults: CompletionToolResult[] = []

      const { finish_reason: finishReason, message } = choices[0]
      const msgToolCalls = message?.tool_calls ?? []
      messages.push({ ...message, content: message.content! })

      let stepType: GenerateTextStepResult['stepType'] = 'initial'

      if ((options.maxSteps ?? 1) >= steps.length) {
        if (msgToolCalls.length > 0 && finishReason === 'tool_calls') {
          stepType = 'tool-result'
        }
        else if (finishReason === 'length') {
          stepType = 'continue'
        }
        else if (finishReason === 'stop') {
          stepType = 'done'
        }
      }

      if (stepType === 'done') {
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
      } of msgToolCalls) {
        const tool = options.tools?.find(tool => tool.function.name === toolName)

        if (!tool) {
          const availableTools = options.tools?.map(tool => tool.function.name)
          const availableToolsErrorMsg = availableTools === undefined
            ? 'No tools are available.'
            : `Available tools: ${availableTools.join(', ')}.`
          throw new Error(`Model tried to call unavailable tool '${toolName}. ${availableToolsErrorMsg}.`)
        }

        const parsedArgs = JSON.parse(toolArgs) as Record<string, unknown>
        const result = wrapToolResult(await tool.execute(parsedArgs, { abortSignal: options.abortSignal, messages, toolCallId }))

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
