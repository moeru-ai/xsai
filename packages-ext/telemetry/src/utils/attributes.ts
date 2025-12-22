import type { Attributes } from '@opentelemetry/api'

import type { TelemetryMetadata } from '../types/options'

export const metadataAttributes = (metadata: TelemetryMetadata = {}): Attributes => Object.fromEntries(
  Object.entries(metadata)
    .map(([key, value]) => [key, value]),
)
