import {
  type AssistantMessageResponse,
  chatCompletion,
  type ChatCompletionOptions,
  ChatError,
  type FinishReason,
  type Message,
  type Tool,
} from '@xsai/shared-chat'

export interface GenerateTextOptions extends ChatCompletionOptions {
  /** @default 1 */
  maxSteps?: number
  /** if you want to enable stream, use `@xsai/stream-text` */
  stream?: never
}

interface GenerateTextResponse {
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

export interface GenerateTextResult {
  finishReason: FinishReason
  steps: StepResult[]
  text?: string
  usage: GenerateTextResponseUsage
}

export interface StepResult {
  text?: string
  // TODO: step type
  // type: 'continue' | 'initial' | 'tool-result'
  // TODO: toolCalls
  // TODO: toolResults
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

  while (currentStep < (options.maxSteps ?? 1)) {
    currentStep += 1

    const res = await chatCompletion({
      ...options,
      maxSteps: undefined,
      messages,
      stream: false,
    })

    if (!res.ok) {
      const error = new ChatError(`Remote sent ${res.status} response`, res)
      error.cause = new Error(await res.text())
    }

    const data: GenerateTextResponse = await res.json()
    const { finish_reason, message } = data.choices[0]

    finishReason = finish_reason
    text = message.content
    usage = data.usage

    steps.push({
      text: message.content,
      // type: 'initial',
      usage,
    })

    // TODO: fix types
    messages.push({ ...message, content: message.content! })

    if (message.tool_calls) {
      // execute tools
      for (const toolCall of message.tool_calls ?? []) {
        const tool = (options.tools as Tool[]).find(tool => tool.function.name === toolCall.function.name)!
        const toolResult = await tool.execute(JSON.parse(toolCall.function.arguments))
        const toolMessage = {
          content: toolResult,
          role: 'tool',
          tool_call_id: toolCall.id,
        } satisfies Message

        messages.push(toolMessage)
      }
    }
    else {
      return {
        finishReason: finish_reason,
        steps,
        text: message.content,
        usage,
      }
    }
  }

  return {
    finishReason,
    steps,
    text,
    usage,
  }
}

export default generateText
