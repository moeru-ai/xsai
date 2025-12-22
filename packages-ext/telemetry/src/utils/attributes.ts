import type { Attributes } from '@opentelemetry/api'
import type { ChatOptions } from 'xsai'

import type { TelemetryMetadata } from '../types/options'

export const metadataAttributes = (metadata: TelemetryMetadata = {}): Attributes => Object.fromEntries(
  Object.entries(metadata)
    .map(([key, value]) => [key, value]),
)

export const chatAttributes = (options: ChatOptions) => ({
  'gen_ai.input.messages': JSON.stringify(options.messages),
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
})
