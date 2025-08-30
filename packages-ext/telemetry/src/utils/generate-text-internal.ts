import type { CompletionStep, CompletionToolCall, CompletionToolResult, GenerateTextOptions, GenerateTextResponse, Message, ToolCall } from 'xsai'

import { clean, determineStepType, executeTool } from 'xsai'

/** @internal */
export interface RunGenerateTextStepResult {
  messages: Message[]
  msgToolCalls: ToolCall[]
  reasoningText?: string
}

/** @internal */
export const extractGenerateTextStep = async (
  options: GenerateTextOptions,
  res: GenerateTextResponse,
): Promise<[Omit<CompletionStep<true>, 'toolResults'>, RunGenerateTextStepResult]> => {
  const { choices, usage } = res

  if (!choices?.length)
    throw new Error(`No choices returned, response body: ${JSON.stringify(res)}`)

  const messages: Message[] = []

  const toolCalls: CompletionToolCall[] = []

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
      toolCalls.push({
        args: toolCall.function.arguments,
        toolCallId: toolCall.id,
        toolCallType: toolCall.type,
        toolName: toolCall.function.name,
      })
    }
  }

  return [
    {
      finishReason,
      stepType,
      text: message.content,
      toolCalls,
      usage,
    },
    {
      messages,
      msgToolCalls,
      reasoningText: message.reasoning_content,
    },
  ]
}

/** @internal */
export const extractGenerateTextStepPost = async (
  options: GenerateTextOptions,
  msgToolCalls: ToolCall[],
): Promise<[CompletionStep<true>['toolResults'], Message[]]> => {
  const inputMessages: Message[] = structuredClone(options.messages)

  const outputMessages: Message[] = []

  const toolResults: CompletionToolResult[] = []
  for (const toolCall of msgToolCalls) {
    const { completionToolResult, message } = await executeTool({
      abortSignal: options.abortSignal,
      messages: inputMessages,
      toolCall,
      tools: options.tools,
    })
    toolResults.push(completionToolResult)
    outputMessages.push(message)
  }

  return [
    toolResults,
    outputMessages,
  ]
}
