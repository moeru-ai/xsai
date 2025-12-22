import type { CompletionStep, GenerateTextOptions, GenerateTextResponse, GenerateTextResult, Message, TrampolineFn, WithUnknown } from 'xsai'

import { chat, responseJSON, trampoline } from 'xsai'

import type { WithTelemetry } from '../types/options'

import { chatAttributes, metadataAttributes } from './attributes'
import { extractGenerateTextStep, extractGenerateTextStepPost } from './generate-text-internal'
import { getTracer } from './get-tracer'
import { recordSpan } from './record-span'
import { wrapTool } from './wrap-tool'

/**
 * @experimental
 * Generating Text with Telemetry.
 */
export const generateText = async (options: WithUnknown<WithTelemetry<GenerateTextOptions>>) => {
  const tracer = getTracer()

  const rawGenerateText = async (options: WithUnknown<WithTelemetry<GenerateTextOptions>>): Promise<TrampolineFn<GenerateTextResult>> => {
    const messages: Message[] = structuredClone(options.messages)
    const steps: CompletionStep<true>[] = options.steps ? structuredClone(options.steps) : []

    const [stepWithoutToolCalls, { messages: msgs1, msgToolCalls, reasoningText }] = await recordSpan({
      attributes: {
        ...metadataAttributes(options.telemetry?.metadata),
        ...chatAttributes(options),
      },
      name: 'xsai.generateText.doGenerate',
      tracer,
    }, async (span) => {
      const res = await chat({
        ...options,
        maxSteps: undefined,
        steps: undefined,
        stream: false,
        telemetry: undefined,
      })
        .then(responseJSON<GenerateTextResponse>)

      const [step, { messages: msgs, msgToolCalls, reasoningText }] = await extractGenerateTextStep({
        ...options,
        messages,
        steps,
      }, res)

      // TODO: metrics counter
      span.setAttributes({
        'gen_ai.output.messages': JSON.stringify(msgs),
        'gen_ai.response.finish_reasons': [step.finishReason],
        'gen_ai.usage.input_tokens': step.usage.prompt_tokens,
        'gen_ai.usage.output_tokens': step.usage.completion_tokens,
      })

      return [step, { messages: msgs, msgToolCalls, reasoningText }]
    })

    const [toolResults, msgs2] = await extractGenerateTextStepPost({
      ...options,
      messages,
      steps,
    }, msgToolCalls, tracer)

    const step = { ...stepWithoutToolCalls, toolResults }

    steps.push(step)
    messages.push(...msgs1, ...msgs2)

    if (options.onStepFinish)
      await options.onStepFinish(step)

    if (step.finishReason === 'stop' || step.stepType === 'done') {
      return {
        finishReason: step.finishReason,
        messages,
        reasoningText,
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
  }

  return trampoline<GenerateTextResult>(async () => rawGenerateText({
    ...options,
    tools: options.tools?.map(tool => wrapTool(tool, tracer)),
  }))
}
