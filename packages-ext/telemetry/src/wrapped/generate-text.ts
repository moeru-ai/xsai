import type { CompletionStep, CompletionToolCall, CompletionToolResult, GenerateTextOptions, GenerateTextResponse, GenerateTextResult, Message, TrampolineFn, WithUnknown } from 'xsai'

import type { WithTelemetry } from '../types/options'

import { chat, determineStepType, executeTool, NoChoicesReturnedError, resolveStepOptions, responseJSON, shouldStop, stepCountAtLeast, trampoline } from 'xsai'

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
    const stepOptions = await resolveStepOptions({
      messages,
      model: options.model,
      prepareStep: options.prepareStep,
      stepNumber: steps.length,
      steps,
      toolChoice: options.toolChoice,
    })

    return recordSpan(chatSpan({
      ...options,
      messages: stepOptions.messages,
      model: stepOptions.model,
      toolChoice: stepOptions.toolChoice,
    }, tracer), async span =>
      chat({
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

          if (!choices?.length) {
            const responseBody = JSON.stringify(res)
            throw new NoChoicesReturnedError(`No choices returned, response body: ${responseBody}`, {
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

          // TODO: metrics counter
          span.setAttributes({
            'gen_ai.response.finish_reasons': [step.finishReason],
            'gen_ai.usage.input_tokens': step.usage.prompt_tokens,
            'gen_ai.usage.output_tokens': step.usage.completion_tokens,
          })

          if (options.onStepFinish)
            await options.onStepFinish(step)

          if (!willContinue) {
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
  //     'gen_ai.usage.input_tokens': result.usage.prompt_tokens,
  //     'gen_ai.usage.output_tokens': result.usage.completion_tokens,
  //   })

  //   return result
  // })
}
