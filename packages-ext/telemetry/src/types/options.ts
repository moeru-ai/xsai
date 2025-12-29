import type { AttributeValue } from '@opentelemetry/api'

export interface TelemetryOptions {
  overrides?: TelemetryOverrides
  // TODO
  // tracer?: Tracer
}

export type TelemetryOverrides = Record<string, AttributeValue>

export type WithTelemetry<T> = T & {
  telemetry?: TelemetryOptions
}
