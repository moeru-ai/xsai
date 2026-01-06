import type { CompletionStep, CompletionToolCall, CompletionToolResult, GenerateTextOptions, GenerateTextResponse, GenerateTextResult, Message, TrampolineFn, WithUnknown } from 'xsai'

import type { WithTelemetry } from '../types/options'

import { chat, determineStepType, executeTool, responseJSON, trampoline } from 'xsai'

import { getTracer } from '../utils/get-tracer'
import { recordSpan } from '../utils/record-span'
import { chatSpan } from '../utils/record-span-options'
import { wrapTool } from '../utils/wrap-tool'

/**
 * @experimental
 * Generating Text with Telemetry.
 */
export const generateText = async (options: WithUnknown<WithTelemetry<GenerateTextOptions>>) => {
  const tracer = getTracer()

  const rawGenerateText = async (options: WithUnknown<WithTelemetry<GenerateTextOptions>>): Promise<TrampolineFn<GenerateTextResult>> =>
    recordSpan(chatSpan(options, tracer), async span =>
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
          span.setAttribute('gen_ai.output.messages', JSON.stringify([message]))

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
            text: Array.isArray(message.content)

              ? message.content.filter(m => m.type === 'text').map(m => m.text).join('\n')
              : message.content,
            toolCalls,
            toolResults,
            usage,
          }

          steps.push(step)

          // TODO: metrics counter
          span.setAttributes({
            'gen_ai.response.finish_reasons': [step.finishReason],
            'gen_ai.usage.input_tokens': step.usage.prompt_tokens,
            'gen_ai.usage.output_tokens': step.usage.completion_tokens,
          })

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
        }))

  return trampoline<GenerateTextResult>(async () => rawGenerateText({
    ...options,
    tools: options.tools?.map(tool => wrapTool(tool, tracer)),
  }))
  // return recordSpan<GenerateTextResult>({
  //   attributes: {
  //     ...metadataAttributes(options.telemetry?.metadata),
  //     ...chatAttributes(options),
  //   },
  //   name: `chat ${options.model}`,
  //   tracer,
  // }, async (span) => {
  //   const result = await trampoline<GenerateTextResult>(async () => rawGenerateText({
  //     ...options,
  //     tools: options.tools?.map(tool => wrapTool(tool, tracer)),
  //   }))

  //   span.setAttributes({
  //     'gen_ai.output.messages': JSON.stringify(result.messages),
  //     'gen_ai.response.finish_reasons': [result.finishReason],
  //     'gen_ai.usage.input_tokens': result.usage.prompt_tokens,
  //     'gen_ai.usage.output_tokens': result.usage.completion_tokens,
  //   })

  //   return result
  // })
}
