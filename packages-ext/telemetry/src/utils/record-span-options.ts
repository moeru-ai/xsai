import type { Attributes, Tracer } from '@opentelemetry/api'
import type { ChatOptions, EmbedManyOptions, EmbedOptions } from 'xsai'

import type { WithTelemetry } from '../types/options'
import type { RecordSpanOptions } from './record-span'

const serverAddressAndPort = (baseURL: string | URL): Attributes => {
  const url = new URL(baseURL)

  return {
    'server.address': url.hostname,
    'server.port': url.port ? Number.parseInt(url.port) : url.protocol === 'https:' ? 443 : 80,
  }
}

export const chatSpan = (options: WithTelemetry<ChatOptions>, tracer: Tracer): RecordSpanOptions => ({
  attributes: {
    'gen_ai.input.messages': JSON.stringify(options.messages),
    'gen_ai.operation.name': 'chat',
    'gen_ai.provider.name': 'openai',
    'gen_ai.request.choice.count': 1,
    'gen_ai.request.frequency_penalty': options.frequencyPenalty,
    'gen_ai.request.model': options.model,
    'gen_ai.request.presence_penalty': options.presencePenalty,
    'gen_ai.request.seed': options.seed,
    'gen_ai.request.stop_sequences': options.stop == null ? undefined : Array.isArray(options.stop) ? options.stop : [options.stop],
    'gen_ai.request.temperature': options.temperature,
    'gen_ai.request.top_k': options.topK,
    'gen_ai.request.top_p': options.topP,
    'gen_ai.response.id': crypto.randomUUID(),
    'gen_ai.response.model': options.model,
    'gen_ai.tool.definitions': JSON.stringify(options.tools?.map(tool => ({ function: tool.function, type: tool.type }))),
    ...serverAddressAndPort(options.baseURL),
    ...options.telemetry?.attributes,
    // TODO: gen_ai.output.type
  },
  name: `chat ${options.model}`,
  tracer,
})

export const embedSpan = (options: WithTelemetry<EmbedManyOptions | EmbedOptions>, tracer: Tracer): RecordSpanOptions => ({
  attributes: {
    'gen_ai.embeddings.dimension.count': options.dimensions,
    'gen_ai.operation.name': 'embeddings',
    'gen_ai.request.encoding_formats': 'float',
    'gen_ai.request.model': options.model,
    ...serverAddressAndPort(options.baseURL),
    ...options.telemetry?.attributes,
  },
  name: `embeddings ${options.model}`,
  tracer,
})
