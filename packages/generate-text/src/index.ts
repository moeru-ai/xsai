import {
  type AssistantMessageResponse,
  chat,
  type ChatOptions,
  type FinishReason,
  type Message,
  type Tool,
  type Usage,
} from '@xsai/shared-chat'

export interface GenerateTextOptions extends ChatOptions {
  /** @default 1 */
  maxSteps?: number
  onStepFinish?: (step: StepResult) => Promise<void> | void
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
  usage: Usage
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
  usage: Usage
}

export interface StepResult {
  text?: string
  // TODO: step type
  // type: 'continue' | 'initial' | 'tool-result'
  toolCalls: ToolCall[]
  toolResults: ToolResult[]
  usage: Usage
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

        if (options.onStepFinish)
          await options.onStepFinish(step)

        return {
          finishReason,
          steps,
          ...step,
        }
      }

      messages.push({ ...message, content: message.content! })

      for (const {
        function: { arguments: toolArgs, name: toolName },
        id: toolCallId,
        type: toolCallType,
      } of message.tool_calls) {
        const tool = (options.tools as Tool[]).find(tool => tool.function.name === toolName)!
        const parsedArgs: Record<string, unknown> = JSON.parse(toolArgs)
        const result = await tool.execute(parsedArgs)

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

      const step: StepResult = {
        text: message.content,
        toolCalls,
        toolResults,
        usage,
      }

      steps.push(step)

      if (options.onStepFinish)
        await options.onStepFinish(step)

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
