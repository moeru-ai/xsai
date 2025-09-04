import { trace } from '@opentelemetry/api'

export const getTracer = () =>
  trace.getTracer('@xsai-ext/telemetry')
