import type { Tracer } from '@opentelemetry/api'
import type { ChatOptions } from 'xsai'

import type { WithTelemetry } from '../types/options'
import type { RecordSpanOptions } from './record-span'

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
    // eslint-disable-next-line sonarjs/no-nested-conditional
    'gen_ai.request.stop_sequences': options.stop == null ? undefined : Array.isArray(options.stop) ? options.stop : [options.stop],
    'gen_ai.request.temperature': options.temperature,
    'gen_ai.request.top_p': options.topP, // TODO: top_k
    'gen_ai.response.id': crypto.randomUUID(),
    'gen_ai.response.model': options.model,
    'gen_ai.tool.definitions': JSON.stringify(options.tools?.map(tool => ({ function: tool.function, type: tool.type }))),
    'server.address': new URL(options.baseURL).host,
    ...options.telemetry?.attributes,
    // TODO: gen_ai.output.type
  },
  name: `chat ${options.model}`,
  tracer,
})
