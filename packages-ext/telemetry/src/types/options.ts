import type { AttributeValue } from '@opentelemetry/api'

export type TelemetryMetadata = Record<string, AttributeValue>

export interface TelemetryOptions {
  metadata?: TelemetryMetadata
  // TODO
  // tracer?: Tracer
}

export type WithTelemetry<T> = T & {
  telemetry?: TelemetryOptions
}
