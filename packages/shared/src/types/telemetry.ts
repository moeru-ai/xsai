// TODO: Move this into a separate package

import type { Tracer } from '@opentelemetry/api'

export interface TelemetryOptions {
  telemetry?: {
    tracer: Tracer
  }
}
