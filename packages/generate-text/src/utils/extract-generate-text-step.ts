import type { AssistantMessage, CompletionStep, CompletionToolCall, CompletionToolResult, FinishReason, Message, Usage } from '@xsai/shared-chat'

import { clean } from '@xsai/shared'
import { determineStepType, executeTool } from '@xsai/shared-chat'

import type { GenerateTextOptions } from '..'

export interface GenerateTextResponse {
  choices: {
    finish_reason: FinishReason
    index: number
    message: Omit<AssistantMessage, 'content' | 'name'> & {
      content?: string
      /** @remarks OpenAI does not support this, but LiteLLM / DeepSeek does. */
      reasoning_content?: string
    }
    refusal?: string
  }[]
  created: number
  id: string
  model: string
  object: 'chat.completion'
  system_fingerprint: string
  usage: Usage
}

/** @internal */
export interface RunGenerateTextStepResult {
  messages: Message[]
  reasoningText?: string
}

/** @internal */
export const extractGenerateTextStep = async (
  options: GenerateTextOptions,
  res: GenerateTextResponse,
): Promise<[CompletionStep<true>, RunGenerateTextStepResult]> => {
  const { choices, usage } = res

  if (!choices?.length)
    throw new Error(`No choices returned, response body: ${JSON.stringify(res)}`)

  const messages: Message[] = []

  const toolCalls: CompletionToolCall[] = []
  const toolResults: CompletionToolResult[] = []

  const { finish_reason: finishReason, message } = choices[0]
  const msgToolCalls = message?.tool_calls ?? []

  const stepType = determineStepType({
    finishReason,
    maxSteps: options.maxSteps ?? 1,
    stepsLength: options.steps?.length ?? 0,
    toolCallsLength: msgToolCalls.length,
  })

  messages.push(clean({
    ...message,
    reasoning_content: undefined,
  }))

  if (finishReason !== 'stop' || stepType !== 'done') {
    for (const toolCall of msgToolCalls) {
      const { completionToolCall, completionToolResult, message } = await executeTool({
        abortSignal: options.abortSignal,
        messages,
        toolCall,
        tools: options.tools,
      })
      toolCalls.push(completionToolCall)
      toolResults.push(completionToolResult)
      messages.push(message)
    }
  }

  return [
    {
      finishReason,
      stepType,
      text: message.content,
      toolCalls,
      toolResults,
      usage,
    } satisfies CompletionStep<true>,
    {
      messages,
      reasoningText: message.reasoning_content,
    },
  ]
}
