import type { TrampolineFn, WithUnknown } from '@xsai/shared'
import type { AssistantMessage, ChatCompletionUsage, ChatOptions, CompletionStep, CompletionToolCall, CompletionToolResult, FinishReason, Message, PrepareStep, StopCondition, Usage } from '@xsai/shared-chat'

import { InvalidResponseError, responseJSON, trampoline } from '@xsai/shared'
import { chat, computeTotalUsage, executeTool, normalizeChatCompletionUsage, resolvePrepareStep, shouldStop, stepCountAtLeast } from '@xsai/shared-chat'

export interface GenerateTextOptions extends ChatOptions {
  onStepFinish?: (step: CompletionStep<true>) => Promise<unknown> | unknown
  prepareStep?: PrepareStep
  /** @internal */
  steps?: CompletionStep<true>[]
  /** @default `stepCountAtLeast(1)` */
  stopWhen?: StopCondition<Message>
  /** if you want to enable stream, use `@xsai/stream-{text,object}` */
  stream?: never
  /** @internal */
  totalUsage?: Usage
}

export interface GenerateTextResponse {
  choices: {
    finish_reason: FinishReason
    index: number
    message: Omit<AssistantMessage, 'name'>
    refusal?: string
  }[]
  created: number
  id: string
  model: string
  object: 'chat.completion'
  system_fingerprint: string
  usage: ChatCompletionUsage
}

export interface GenerateTextResult {
  finishReason: FinishReason
  messages: Message[]
  reasoningText?: string
  steps: CompletionStep<true>[]
  text?: string
  toolCalls: CompletionToolCall[]
  toolResults: CompletionToolResult[]
  totalUsage: Usage
  usage: Usage
}

/** @internal */
const rawGenerateText = async (options: WithUnknown<GenerateTextOptions>): Promise<TrampolineFn<GenerateTextResult>> => {
  const messages: Message[] = options.steps == null
    ? structuredClone(options.messages)
    : options.messages
  const steps: CompletionStep<true>[] = options.steps ?? []
  const stepOptions = await resolvePrepareStep({
    input: messages,
    model: options.model,
    prepareStep: options.prepareStep,
    stepNumber: steps.length,
    steps,
    toolChoice: options.toolChoice,
  })

  return chat({
    ...options,
    messages: stepOptions.input,
    model: stepOptions.model,
    steps: undefined,
    stream: false,
    toolChoice: stepOptions.toolChoice,
    totalUsage: undefined,
  })
    .then(responseJSON<GenerateTextResponse>)
    .then(async (res) => {
      const { choices } = res
      const usage = normalizeChatCompletionUsage(res.usage)
      const totalUsage = computeTotalUsage(options.totalUsage, usage)

      if (!choices?.length) {
        const responseBody = JSON.stringify(res)
        throw new InvalidResponseError(`No choices returned, response body: ${responseBody}`, {
          reason: 'no_choices',
          responseBody,
        })
      }

      const toolCalls: CompletionToolCall[] = []
      const toolResults: CompletionToolResult[] = []

      const { finish_reason: finishReason, message } = choices[0]
      const msgToolCalls = message?.tool_calls ?? []
      const stopWhen: StopCondition<Message> = options.stopWhen ?? stepCountAtLeast(1)

      messages.push(message)

      if (msgToolCalls.length > 0) {
        const results = await Promise.all(
          msgToolCalls.map(async toolCall => executeTool({
            abortSignal: options.abortSignal,
            messages,
            toolCall,
            tools: options.tools,
          })),
        )

        for (const { completionToolCall, completionToolResult, result } of results) {
          toolCalls.push(completionToolCall)
          toolResults.push(completionToolResult)
          messages.push({
            content: result,
            role: 'tool',
            tool_call_id: completionToolCall.toolCallId,
          })
        }
      }

      const step: CompletionStep<true> = {
        finishReason,
        text: Array.isArray(message.content)
          ? message.content.filter(m => m.type === 'text').map(m => m.text).join('\n')
          : message.content,
        toolCalls,
        toolResults,
        usage,
      }
      const stop = shouldStop(stopWhen, {
        input: messages,
        step,
        steps: [...steps, step],
      })
      const willContinue = toolCalls.length > 0 && !stop

      steps.push(step)

      if (options.onStepFinish)
        await options.onStepFinish(step)

      if (!willContinue) {
        return {
          finishReason: step.finishReason,
          messages,
          reasoningText: message.reasoning ?? message.reasoning_content,
          steps,
          text: step.text,
          toolCalls: step.toolCalls,
          toolResults: step.toolResults,
          totalUsage,
          usage: step.usage,
        }
      }
      else {
        return async () => rawGenerateText({
          ...options,
          messages,
          steps,
          totalUsage,
        })
      }
    })
}

export const generateText = async (options: WithUnknown<GenerateTextOptions>): Promise<GenerateTextResult> =>
  trampoline<GenerateTextResult>(async () => rawGenerateText(options))
