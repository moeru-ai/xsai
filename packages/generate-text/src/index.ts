import { type AssistantMessageResponse, chatCompletion, type ChatCompletionOptions, type FinishReason, type Message, type Tool } from '@xsai/shared-chat-completion'

export interface GenerateTextOptions extends ChatCompletionOptions {
  maxSteps?: number
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
  text?: string
  usage: GenerateTextResponseUsage
}

export const generateText = async (options: GenerateTextOptions): Promise<GenerateTextResult> => {
  const maxSteps = options.maxSteps ?? 10
  let step = 0

  while (step < maxSteps) {
    step++

    const res = await chatCompletion({
      ...options,
      stream: false,
    })

    if (!res.ok) {
      const error = await res.text()
      throw new Error(`Error(${res.status}): ${error}`)
    }
    else {
      const data = await res.json() as GenerateTextResponse
      const { choices, usage } = data
      const { finish_reason, message } = choices[0]

      if (!!message.content || !message.tool_calls) {
        return {
          finishReason: finish_reason,
          text: message.content,
          usage,
        }
      }

      const toolMessages = []

      for (const toolCall of message.tool_calls) {
        const tool = (options.tools as Tool[]).find(tool => tool.function.name === toolCall.function.name)!
        const toolResult = await tool.execute(JSON.parse(toolCall.function.arguments))
        const toolMessage = {
          content: toolResult,
          role: 'tool',
          tool_call_id: toolCall.id,
        } satisfies Message

        toolMessages.push(toolMessage)
      }

      options.messages.push({ ...message, content: message.content! })
      options.messages.push(...toolMessages)
    }
  }

  throw new Error('Max round trip reached')
}

export default generateText
