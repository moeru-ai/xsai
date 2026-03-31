import type { TrampolineFn, WithUnknown } from '@xsai/shared'
import type { AssistantMessage, ChatOptions, CompletionStep, CompletionToolCall, CompletionToolResult, FinishReason, Message, PrepareStep, StopCondition, Usage } from '@xsai/shared-chat'

import { responseJSON, trampoline } from '@xsai/shared'
import { chat, determineStepType, executeTool, resolveStepOptions, shouldStop, stepCountAtLeast } from '@xsai/shared-chat'

export interface GenerateTextOptions extends ChatOptions {
  onStepFinish?: (step: CompletionStep<true>) => Promise<unknown> | unknown
  prepareStep?: PrepareStep
  /** @internal */
  steps?: CompletionStep<true>[]
  /** @default `stepCountAtLeast(1)` */
  stopWhen?: StopCondition
  /** if you want to enable stream, use `@xsai/stream-{text,object}` */
  stream?: never
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
const rawGenerateText = async (options: WithUnknown<GenerateTextOptions>): Promise<TrampolineFn<GenerateTextResult>> => {
  const messages: Message[] = options.steps == null
    ? structuredClone(options.messages)
    : options.messages
  const steps: CompletionStep<true>[] = options.steps ?? []
  const stepOptions = await resolveStepOptions({
    messages,
    model: options.model,
    prepareStep: options.prepareStep,
    stepNumber: steps.length,
    steps,
    toolChoice: options.toolChoice,
  })

  return chat({
    ...options,
    maxSteps: undefined,
    messages: stepOptions.messages,
    model: stepOptions.model,
    steps: undefined,
    stopWhen: undefined,
    stream: false,
    toolChoice: stepOptions.toolChoice,
  })
    .then(responseJSON<GenerateTextResponse>)
    .then(async (res) => {
      const { choices, usage } = res

      if (!choices?.length)
        throw new Error(`No choices returned, response body: ${JSON.stringify(res)}`)

      const toolCalls: CompletionToolCall[] = []
      const toolResults: CompletionToolResult[] = []

      const { finish_reason: finishReason, message } = choices[0]
      const msgToolCalls = message?.tool_calls ?? []
      const stopWhen = options.stopWhen ?? stepCountAtLeast(1)

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

        for (const { completionToolCall, completionToolResult, message } of results) {
          toolCalls.push(completionToolCall)
          toolResults.push(completionToolResult)
          messages.push(message)
        }
      }

      const stopStep: Omit<CompletionStep<true>, 'stepType'> = {
        finishReason,
        text: Array.isArray(message.content)
          ? message.content.filter(m => m.type === 'text').map(m => m.text).join('\n')
          : message.content,
        toolCalls,
        toolResults,
        usage,
      }
      const stop = shouldStop(stopWhen, {
        messages,
        step: stopStep,
        steps: [...steps, stopStep],
      })
      const willContinue = toolCalls.length > 0 && !stop
      const step: CompletionStep<true> = {
        ...stopStep,
        stepType: determineStepType({
          finishReason,
          stepsLength: steps.length,
          toolCallsLength: toolCalls.length,
          willContinue,
        }),
      }

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
}

export const generateText = async (options: WithUnknown<GenerateTextOptions>): Promise<GenerateTextResult> =>
  trampoline<GenerateTextResult>(async () => rawGenerateText(options))
