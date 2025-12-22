import type { CompletionStep, GenerateTextOptions, GenerateTextResponse, GenerateTextResult, Message, TrampolineFn, WithUnknown } from 'xsai'

import { chat, responseJSON, trampoline } from 'xsai'

import type { WithTelemetry } from '../types/options'

import { metadataAttributes } from './attributes'
import { extractGenerateTextStep, extractGenerateTextStepPost } from './generate-text-internal'
import { getTracer } from './get-tracer'
import { recordSpan } from './record-span'
import { stringifyTool } from './stringify-tool'
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
        ...(options.tools != null && options.tools.length > 0
          ? {
              'ai.prompt.toolChoice': JSON.stringify(options.toolChoice ?? { type: 'auto' }),
              'ai.prompt.tools': options.tools.map(stringifyTool),
            }
          : {}),
        'gen_ai.input.messages': JSON.stringify(messages),
        'gen_ai.operation.name': 'chat',
        'gen_ai.request.choice.count': 1,
        'gen_ai.request.frequency_penalty': options.frequencyPenalty,
        'gen_ai.request.model': options.model,
        'gen_ai.request.presence_penalty': options.presencePenalty,
        'gen_ai.request.seed': options.seed,
        'gen_ai.request.stop_sequences': Array.isArray(options.stop) ? options.stop : [options.stop],
        'gen_ai.request.temperature': options.temperature,
        'gen_ai.request.top_p': options.topP, // TODO: top_k
        'gen_ai.response.id': crypto.randomUUID(),
        'gen_ai.response.model': options.model,
        'gen_ai.system': 'xsai',
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
    }, msgToolCalls)

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

  return recordSpan<GenerateTextResult>({
    attributes: metadataAttributes(options.telemetry?.metadata),
    name: 'xsai.generateText',
    tracer,
  }, async (span) => {
    const result = await trampoline<GenerateTextResult>(async () => rawGenerateText({
      ...options,
      tools: options.tools?.map(tool => wrapTool(tool, tracer)),
    }))

    span.setAttributes({
      ...(result.toolCalls.length > 0 ? { 'ai.response.toolCalls': JSON.stringify(result.toolCalls) } : {}),
      ...(result.text != null ? { 'ai.response.text': result.text } : {}),
      'ai.response.finishReason': result.finishReason,
      'ai.usage.completionTokens': result.usage.completion_tokens,
      'ai.usage.promptTokens': result.usage.prompt_tokens,
    })

    return result
  })
}
