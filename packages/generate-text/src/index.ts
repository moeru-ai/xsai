import type { AssistantMessageResponse, ChatOptions, CompletionToolCall, CompletionToolResult, FinishReason, Message, Tool, ToolCall, ToolMessagePart, Usage } from '@xsai/shared-chat'

import { chat, wrapToolResult } from '@xsai/shared-chat'

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
  stepType: 'continue' | 'done' | 'initial' | 'tool-result'
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
function removeTextAfterLastWhitespace(text: string): string {
  const lastNonWhitespace = text.trimEnd().length
  return text.slice(0, lastNonWhitespace + 1)
}

/** @internal */
const executeToolCall = async (
  func: ToolCall['function'],
  toolCallId: string,
  options: GenerateTextOptions,
  messages: Message[],
): Promise<{ parsedArgs: Record<string, unknown>, result: string | ToolMessagePart[], toolName: string }> => {
  const tool = options.tools?.find(tool => tool.function.name === func.name)

  if (!tool) {
    const availableTools = options.tools?.map(tool => tool.function.name)
    const availableToolsErrorMsg = availableTools === undefined
      ? 'No tools are available.'
      : `Available tools: ${availableTools.join(', ')}.`
    throw new Error(`Model tried to call unavailable tool '${func.name}. ${availableToolsErrorMsg}.`)
  }

  const parsedArgs = JSON.parse(func.arguments) as Record<string, unknown>
  const result = wrapToolResult(await tool.execute(parsedArgs, {
    abortSignal: options.abortSignal,
    messages,
    toolCallId,
  }))

  return { parsedArgs, result, toolName: func.name }
}

/** @internal */
const rawGenerateText: RawGenerateText = async (options: GenerateTextOptions) =>
  chat({
    ...options,
    maxSteps: undefined,
    messages: options.messages,
    steps: undefined,
    stream: false,
  })
    .then(async res => res.json() as Promise<GenerateTextResponse>)
    .then(async ({ choices, usage }) => {
      const messages: Message[] = structuredClone(options.messages)
      const steps: GenerateTextStepResult[] = options.steps ? structuredClone(options.steps) : []
      const toolCalls: CompletionToolCall[] = []
      const toolResults: CompletionToolResult[] = []

      const { finish_reason: finishReason, message } = choices[0]
      const msgToolCalls = message?.tool_calls ?? []

      let stepType: GenerateTextStepResult['stepType'] = 'initial'

      if ((options.maxSteps ?? 1) >= steps.length) {
        if (msgToolCalls.length > 0 && finishReason === 'tool_calls') {
          stepType = 'tool-result'
        }
        else if (finishReason === 'length') {
          stepType = 'continue'
        }
        else if (finishReason === 'stop') {
          stepType = 'done'
        }
      }

      let text = message.content ?? ''
      if (steps.length > 0 && stepType === 'continue') {
        const lastStep = steps[steps.length - 1]
        const lastText = lastStep.text ?? ''

        const currentTextLeadingWhitespaceTrimmed
          = text.trimEnd() !== text
            ? text.trimStart()
            : text

        const processedLastText = removeTextAfterLastWhitespace(lastText)

        text = processedLastText + currentTextLeadingWhitespaceTrimmed

        const lastMessage = messages[messages.length - 1]
        if (lastMessage.role === 'assistant' && typeof lastMessage.content === 'string') {
          lastMessage.content = text
        }
        else {
          messages.push({ ...message, content: text })
        }
      }
      else {
        messages.push({ ...message, content: message.content! })
      }

      if (stepType === 'done') {
        const step: GenerateTextStepResult = {
          finishReason,
          stepType,
          text,
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
          text,
          toolCalls,
          toolResults,
          usage,
        }
      }

      for (const {
        function: func,
        id: toolCallId,
        type: toolCallType,
      } of msgToolCalls) {
        const { parsedArgs, result, toolName } = await executeToolCall(
          func,
          toolCallId,
          options,
          messages,
        )
        const toolInfo = { toolCallId, toolName }
        toolCalls.push({ ...toolInfo, args: func.arguments, toolCallType })
        toolResults.push({ ...toolInfo, args: parsedArgs, result })
        messages.push({
          content: result,
          role: 'tool',
          tool_call_id: toolCallId,
        })
      }

      const step: GenerateTextStepResult = {
        finishReason,
        stepType,
        text,
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
