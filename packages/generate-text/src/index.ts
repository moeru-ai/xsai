import type { TrampolineFn, WithUnknown } from '@xsai/shared'
import type { AssistantMessage, ChatOptions, CompletionStep, CompletionToolCall, CompletionToolResult, FinishReason, Message, Usage } from '@xsai/shared-chat'

import { responseJSON, trampoline } from '@xsai/shared'
import { chat, determineStepType, executeTool } from '@xsai/shared-chat'

export interface GenerateTextOptions extends ChatOptions {
  /** @default 1 */
  maxSteps?: number
  onStepFinish?: (step: CompletionStep<true>) => Promise<unknown> | unknown
  /** @internal */
  steps?: CompletionStep<true>[]
  /** if you want to enable stream, use `@xsai/stream-{text,object}` */
  stream?: never
}

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

export interface GenerateTextResult {
  finishReason: FinishReason
  messages: Message[]
  reasoningText?: string
  steps: CompletionStep<true>[]
  text?: string
  toolCalls: CompletionToolCall[]
  toolResults: CompletionToolResult[]
  usage: Usage
}

/** @internal */
const rawGenerateText = async (options: WithUnknown<GenerateTextOptions>): Promise<TrampolineFn<GenerateTextResult>> =>
  chat({
    ...options,
    maxSteps: undefined,
    steps: undefined,
    stream: false,
  })
    .then(responseJSON<GenerateTextResponse>)
    .then(async (res) => {
      const { choices, usage } = res

      if (!choices?.length)
        throw new Error(`No choices returned, response body: ${JSON.stringify(res)}`)

      const messages: Message[] = structuredClone(options.messages)
      const steps: CompletionStep<true>[] = options.steps ? structuredClone(options.steps) : []

      const toolCalls: CompletionToolCall[] = []
      const toolResults: CompletionToolResult[] = []

      const { finish_reason: finishReason, message } = choices[0]
      const msgToolCalls = message?.tool_calls ?? []

      const stepType = determineStepType({
        finishReason,
        maxSteps: options.maxSteps ?? 1,
        stepsLength: steps.length,
        toolCallsLength: msgToolCalls.length,
      })

      messages.push(message)

      if (finishReason !== 'stop' && stepType !== 'done') {
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

      const step: CompletionStep<true> = {
        finishReason,
        stepType,
        text: message.content,
        toolCalls,
        toolResults,
        usage,
      }

      steps.push(step)

      if (options.onStepFinish)
        await options.onStepFinish(step)

      if (step.finishReason === 'stop' || step.stepType === 'done') {
        return {
          finishReason: step.finishReason,
          messages,
          reasoningText: message.reasoning_content,
          steps,
          text: step.text,
          toolCalls: step.toolCalls,
          toolResults: step.toolResults,
          usage: step.usage,
        }
      }
      else {
        return async () => rawGenerateText({
          ...options,
          messages,
          steps,
        })
      }
    })

export const generateText = async (options: WithUnknown<GenerateTextOptions>): Promise<GenerateTextResult> =>
  trampoline<GenerateTextResult>(async () => rawGenerateText(options))
