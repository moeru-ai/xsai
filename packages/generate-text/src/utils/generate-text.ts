import { clean, type CommonRequestOptions, objCamelToSnake, requestUrl } from '@xsai/shared'

import type { AssistantMessage, FinishReason, Message, TextGenerationModel, ToolChoice } from '../types'
import type { Tool } from '../types/internal/tool'

export interface GenerateTextOptions extends CommonRequestOptions<'chat/completions'> {
  [key: string]: unknown
  messages: Message[]
  model: TextGenerationModel
  toolChoice?: ToolChoice
  // tools?: Tool[]
}

interface GenerateTextResponse {
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
  text: string
  usage: GenerateTextResponseUsage
}

export const generateText = async (options: GenerateTextOptions): Promise<GenerateTextResult> =>
  await fetch(requestUrl(options.path ?? 'chat/completions', options.base), {
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
    signal: options.abortSignal,
  })
    .then(async (res) => {
      if (!res.ok) {
        const error = await res.text()
        throw new Error(`Error(${res.status}): ${error}`)
      }
      else {
        return res.json() as Promise<GenerateTextResponse>
      }
    })
    .then(async ({ choices, usage }) => {
      const { finish_reason, message } = choices[0]

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
      else {
        return {
          finishReason: finish_reason,
          text: message.content,
          usage,
        }
      }
    })
