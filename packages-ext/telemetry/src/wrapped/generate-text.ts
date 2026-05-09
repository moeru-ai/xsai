import type { CompletionStep, CompletionToolCall, CompletionToolResult, GenerateTextOptions, GenerateTextResponse, GenerateTextResult, Message, TrampolineFn, WithUnknown } from 'xsai'

import type { WithTelemetry } from '../types/options'

import { chat, computeTotalUsage, executeTool, InvalidResponseError, normalizeChatCompletionUsage, resolvePrepareStep, responseJSON, shouldStop, stepCountAtLeast, trampoline } from 'xsai'

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

  const rawGenerateText = async (options: WithUnknown<WithTelemetry<GenerateTextOptions>>): Promise<TrampolineFn<GenerateTextResult>> => {
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

    return recordSpan(chatSpan({
      ...options,
      messages: stepOptions.input,
      model: stepOptions.model,
      toolChoice: stepOptions.toolChoice,
    }, tracer), async span =>
      chat({
        ...options,
        messages: stepOptions.input,
        model: stepOptions.model,
        steps: undefined,
        stream: false,
        telemetry: undefined,
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
          const stopWhen = options.stopWhen ?? stepCountAtLeast(1)

          messages.push(message)
          span.setAttribute('gen_ai.output.messages', JSON.stringify([message]))

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

          // TODO: metrics counter
          span.setAttributes({
            'gen_ai.response.finish_reasons': [step.finishReason],
            'gen_ai.usage.input_tokens': step.usage.inputTokens,
            'gen_ai.usage.output_tokens': step.usage.outputTokens,
          })

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
        }))
  }

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
  //     'gen_ai.usage.input_tokens': result.usage.inputTokens,
  //     'gen_ai.usage.output_tokens': result.usage.outputTokens,
  //   })

  //   return result
  // })
}
