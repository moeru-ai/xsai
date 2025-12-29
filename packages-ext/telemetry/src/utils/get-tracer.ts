import { trace } from '@opentelemetry/api'

import pkg from '../../package.json'

export const getTracer = () =>
  trace.getTracer('@xsai-ext/telemetry', pkg.version)
