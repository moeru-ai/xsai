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

export const generateText = async (options: GenerateTextOptions): Promise<GenerateTextResult> => {
  let currentStep = 0

  let finishReason: FinishReason = 'error'
  let text
  let usage: GenerateTextResponseUsage = {
    completion_tokens: 0,
    prompt_tokens: 0,
    total_tokens: 0,
  }

  const steps: StepResult[] = []
  const messages: Message[] = options.messages
  const toolCalls: ToolCall[] = []
  const toolResults: ToolResult[] = []
  while (currentStep < (options.maxSteps ?? 1)) {
    currentStep += 1

    const data: GenerateTextResponse = await chat({
      ...options,
      maxSteps: undefined,
      messages,
      stream: false,
    }).then(res => res.json())

    const { finish_reason, message } = data.choices[0]

    finishReason = finish_reason
    text = message.content
    usage = data.usage

    const stepResult: StepResult = {
      text: message.content,
      toolCalls: [],
      toolResults: [],
      // type: 'initial',
      usage,
    }

    // TODO: fix types
    messages.push({ ...message, content: message.content! })

    if (message.tool_calls) {
      // execute tools
      for (const toolCall of message.tool_calls ?? []) {
        const tool = (options.tools as Tool[]).find(tool => tool.function.name === toolCall.function.name)!
        const parsedArgs: Record<string, any> = JSON.parse(toolCall.function.arguments)
        const toolResult = await tool.execute(parsedArgs)
        const toolMessage = {
          content: toolResult,
          role: 'tool',
          tool_call_id: toolCall.id,
        } satisfies Message

        messages.push(toolMessage)

        const toolCallData = {
          args: toolCall.function.arguments,
          toolCallId: toolCall.id,
          toolCallType: toolCall.type,
          toolName: toolCall.function.name,
        }
        toolCalls.push(toolCallData)
        stepResult.toolCalls.push(toolCallData)
        const toolResultData = {
          args: parsedArgs,
          result: toolResult,
          toolCallId: toolCall.id,
          toolName: toolCall.function.name,
        }
        toolResults.push(toolResultData)
        stepResult.toolResults.push(toolResultData)
      }
      steps.push(stepResult)
    }
    else {
      steps.push(stepResult)
      return {
        finishReason: finish_reason,
        steps,
        text: message.content,
        toolCalls,
        toolResults,
        usage,
      }
    }
  }

  return {
    finishReason,
    steps,
    text,
    toolCalls,
    toolResults,
    usage,
  }
}

export default generateText
