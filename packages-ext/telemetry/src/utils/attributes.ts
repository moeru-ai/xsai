import type { Attributes } from '@opentelemetry/api'

import type { TelemetryMetadata } from '../types/options'

export const metadataAttributes = (metadata: TelemetryMetadata = {}): Attributes => Object.fromEntries(
  Object.entries(metadata)
    .map(([key, value]) => [`ai.telemetry.metadata.${key}`, value]),
)

export const idAttributes = (): Attributes => {
  const id = crypto.randomUUID()

  return {
    'ai.response.id': id,
    'ai.response.timestamp': new Date().toISOString(),
    'gen_ai.response.id': id,
  }
}

export const commonAttributes = (operationId: string, model: string): Attributes => ({
  'ai.model.id': model,
  // TODO: provider name
  'ai.model.provider': 'xsai',
  'ai.operationId': operationId,
  'ai.response.providerMetadata': '{}',
  'operation.name': operationId,
})
