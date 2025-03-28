import type { AssistantMessageResponse, ChatOptions, CompletionToolCall, CompletionToolResult, FinishReason, Message, StepType, Tool, Usage } from '@xsai/shared-chat'

import { XSAIError } from '@xsai/shared'
import { chat, determineStepType, executeTool } from '@xsai/shared-chat'

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
  stepType: StepType
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
    .then(async (res): Promise<GenerateTextResponse> => {
      const text = await res.text()

      try {
        return JSON.parse(text) as GenerateTextResponse
      }
      catch {
        const error = new XSAIError('Failed to parse response', res)
        error.cause = text
        throw error
      }
    })
    .then(async (res) => {
      const { choices, usage } = res

      if (!choices?.length) {
        const error = new XSAIError('No choices returned')

        if ('error' in res) {
          error.cause = res.error
          throw error
        }

        error.cause = res
        throw error
      }

      const messages: Message[] = structuredClone(options.messages)
      const steps: GenerateTextStepResult[] = options.steps ? structuredClone(options.steps) : []
      const toolCalls: CompletionToolCall[] = []
      const toolResults: CompletionToolResult[] = []

      const { finish_reason: finishReason, message } = choices[0]
      const msgToolCalls = message?.tool_calls ?? []

      const stepType = determineStepType({
        finishReason,
        maxSteps: options.maxSteps ?? 1,
        stepsLength: steps.length,
        toolCallsLength: msgToolCalls.length,
      })

      messages.push({ ...message, content: message.content })

      if (finishReason === 'stop' || stepType === 'done') {
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

      for (const toolCall of msgToolCalls) {
        const { parsedArgs, result, toolName } = await executeTool({
          abortSignal: options.abortSignal,
          messages,
          toolCall,
          tools: options.tools,
        })
        const toolInfo = { toolCallId: toolCall.id, toolName }
        toolCalls.push({ ...toolInfo, args: toolCall.function.arguments, toolCallType: toolCall.type })
        toolResults.push({ ...toolInfo, args: parsedArgs, result })
        messages.push({
          content: result,
          role: 'tool',
          tool_call_id: toolCall.id,
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
