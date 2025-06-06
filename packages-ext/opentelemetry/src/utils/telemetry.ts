import type { TelemetryOptions } from 'xsai'

import { trace } from '@opentelemetry/api'

export const createTelemetry = (): TelemetryOptions => ({
  telemetry: {
    tracer: trace.getTracer('@xsai-ext/opentelemetry'),
  },
})
