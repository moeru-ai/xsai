// TODO: Move this into a separate package

import type { Span } from '@opentelemetry/api'

import { SpanStatusCode } from '@opentelemetry/api'

import type { TelemetryOptions } from '../types'

export const instrumented = <TOptions extends TelemetryOptions, TReturn>(spanName: string, fn: (options: TOptions, span?: Span) => Promise<TReturn>): (options: TOptions) => Promise<TReturn> => {
  return async (options) => {
    if (!options.telemetry) {
      return fn(options)
    }

    return options.telemetry.tracer.startActiveSpan(spanName, async (span) => {
      try {
        return await fn(options, span)
      }
      catch (e) {
        span.setStatus({ code: SpanStatusCode.ERROR, message: e instanceof Error ? e.message : String(e) })
        span.recordException(e instanceof Error ? e : new Error(String(e)))
        throw e
      }
      finally {
        span.end()
      }
    })
  }
}
