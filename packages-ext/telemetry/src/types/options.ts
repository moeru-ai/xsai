import type { Attributes } from '@opentelemetry/api'

export interface TelemetryOptions {
  attributes?: Attributes
  // TODO
  // tracer?: Tracer
}

export type WithTelemetry<T> = T & {
  telemetry?: TelemetryOptions
}
