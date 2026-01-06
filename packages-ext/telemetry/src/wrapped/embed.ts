import type { EmbedManyOptions, EmbedManyResult, EmbedOptions, EmbedResult } from 'xsai'

import type { WithTelemetry } from '../types/options'

import { clean, embed as originalEmbed, embedMany as originalEmbedMany } from 'xsai'

import { getTracer } from '../utils/get-tracer'
import { recordSpan } from '../utils/record-span'
import { embedSpan } from '../utils/record-span-options'

/**
 * @experimental
 * Embeddings with Telemetry.
 */
export const embed = async (options: WithTelemetry<EmbedOptions>): Promise<EmbedResult> => {
  const tracer = getTracer()

  // https://opentelemetry.io/docs/specs/semconv/gen-ai/gen-ai-spans/#embeddings
  return recordSpan<EmbedResult>(embedSpan(options, tracer), async (span) => {
    const result = await originalEmbed(clean({ ...options, telemetry: undefined }))
    span.setAttribute('gen_ai.usage.input_tokens', result.usage.prompt_tokens)
    return result
  })
}

/**
 * @experimental
 * Embeddings with Telemetry.
 */
export const embedMany = async (options: WithTelemetry<EmbedManyOptions>): Promise<EmbedManyResult> => {
  const tracer = getTracer()

  // https://opentelemetry.io/docs/specs/semconv/gen-ai/gen-ai-spans/#embeddings
  return recordSpan<EmbedManyResult>(embedSpan(options, tracer), async (span) => {
    const result = await originalEmbedMany(clean({ ...options, telemetry: undefined }))
    span.setAttribute('gen_ai.usage.input_tokens', result.usage.prompt_tokens)
    return result
  })
}
