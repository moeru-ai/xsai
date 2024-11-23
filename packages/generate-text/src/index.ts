import { clean, type CommonRequestOptions, objCamelToSnake, requestUrl } from '@xsai/shared'

import type { AssistantMessage, FinishReason, Message, TextGenerationModel, Tool, ToolChoice } from './types'

export interface GenerateTextOptions extends CommonRequestOptions<'chat/completions'> {
  [key: string]: unknown
  messages: Message[]
  model: TextGenerationModel
  toolChoice?: ToolChoice
  // tools?: Tool[]
}

export interface GenerateTextResponse {
  choices: {
    finish_reason: FinishReason
    index: number
    message: AssistantMessage
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
  request: Request
  response: Response
  text: string
  usage: GenerateTextResponseUsage
}

export const generateText = async (options: GenerateTextOptions): Promise<GenerateTextResult> => {
  const request = new Request(requestUrl(options.path ?? 'chat/completions', options.base), {
    body: JSON.stringify(clean({
      ...objCamelToSnake(options),
      abortSignal: undefined,
      base: undefined,
      headers: undefined,
      path: undefined,
      stream: false,
      tools: (options.tools as Tool[] | undefined)?.map(tool => ({
        function: tool.function,
        type: 'function',
      })),
    })),
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    method: 'POST',
    signal: options.abortSingal,
  })

  const response = await fetch(request)

  const json = await response.json() as GenerateTextResponse

  const { finish_reason, message } = json.choices[0]

  if (message.tool_calls) {
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

    return await generateText({
      ...options,
      messages: [
        ...options.messages,
        message,
        ...toolMessages,
      ],
    })
  }

  return {
    finishReason: finish_reason,
    request,
    response,
    text: message.content,
    usage: json.usage,
  }
}

export default generateText
