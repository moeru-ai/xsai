import {
  type AssistantMessageResponse,
  chat,
  type ChatOptions,
  type FinishReason,
  type Message,
  type Tool,
} from '@xsai/shared-chat'

export interface GenerateTextOptions extends ChatOptions {
  /** @default 1 */
  maxSteps?: number
  /** @internal */
  steps?: StepResult[]
  /** if you want to enable stream, use `@xsai/stream-{text,object}` */
  stream?: never
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
  usage: GenerateTextResponseUsage
}

export interface GenerateTextResponseUsage {
  completion_tokens: number
  prompt_tokens: number
  total_tokens: number
}

export interface ToolCall {
  args: string
  toolCallId: string
  toolCallType: 'function'
  toolName: string
}

export interface ToolResult {
  args: Record<string, unknown>
  result: string
  toolCallId: string
  toolName: string
}

export interface GenerateTextResult {
  finishReason: FinishReason
  steps: StepResult[]
  text?: string
  toolCalls: ToolCall[]
  toolResults: ToolResult[]
  usage: GenerateTextResponseUsage
}

export interface StepResult {
  text?: string
  // TODO: step type
  // type: 'continue' | 'initial' | 'tool-result'
  toolCalls: ToolCall[]
  toolResults: ToolResult[]
  usage: GenerateTextResponseUsage
}

/** @internal */
type RawGenerateTextTrampoline<T> = Promise<(() => RawGenerateTextTrampoline<T>) | T>

/** @internal */
type RawGenerateText = (options: GenerateTextOptions) => RawGenerateTextTrampoline<GenerateTextResult>

/** @internal */
const rawGenerateText: RawGenerateText = async (options: GenerateTextOptions) =>
  await chat({
    ...options,
    maxSteps: undefined,
    messages: options.messages,
    steps: undefined,
    stream: false,
  })
    .then(res => res.json() as Promise<GenerateTextResponse>)
    .then(async ({ choices, usage }) => {
      const messages: Message[] = options.messages
      const steps: StepResult[] = options.steps ?? []
      const toolCalls: ToolCall[] = []
      const toolResults: ToolResult[] = []

      const { finish_reason: finishReason, message } = choices[0]

      if (message.content || !message.tool_calls || steps.length >= (options.maxSteps ?? 1)) {
        const step: StepResult = {
          text: message.content,
          toolCalls,
          toolResults,
          usage,
        }

        steps.push(step)

        return {
          finishReason,
          steps,
          ...step,
        }
      }

      messages.push({ ...message, content: message.content! })

      for (const toolCall of message.tool_calls) {
        const tool = (options.tools as Tool[]).find(tool => tool.function.name === toolCall.function.name)!
        const parsedArgs: Record<string, unknown> = JSON.parse(toolCall.function.arguments)
        const toolResult = await tool.execute(parsedArgs)
        const toolMessage = {
          content: toolResult,
          role: 'tool',
          tool_call_id: toolCall.id,
        } satisfies Message

        toolCalls.push({
          args: toolCall.function.arguments,
          toolCallId: toolCall.id,
          toolCallType: toolCall.type,
          toolName: toolCall.function.name,
        })

        toolResults.push({
          args: parsedArgs,
          result: toolResult,
          toolCallId: toolCall.id,
          toolName: toolCall.function.name,
        })

        messages.push(toolMessage)
      }

      steps.push({
        text: message.content,
        toolCalls,
        toolResults,
        usage,
      })

      return async () => await rawGenerateText({
        ...options,
        messages,
        steps,
      })
    })

export const generateText = async (options: GenerateTextOptions): Promise<GenerateTextResult> => {
  let result = await rawGenerateText(options)

  while (result instanceof Function)
    result = await result()

  return result
}

export default generateText
