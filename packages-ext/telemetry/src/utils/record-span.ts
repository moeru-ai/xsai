import type { Attributes, Span, Tracer } from '@opentelemetry/api'

import { SpanStatusCode } from '@opentelemetry/api'

/**
 * Record an error on a span. If the error is an instance of Error, an exception event will be recorded on the span, otherwise
 * the span will be set to an error status.
 *
 * @param span - The span to record the error on.
 * @param error - The error to record on the span.
 */
export const recordErrorOnSpan = (span: Span, error: unknown) => {
  if (error instanceof Error) {
    span.recordException({
      message: error.message,
      name: error.name,
      stack: error.stack,
    })
    span.setStatus({
      code: SpanStatusCode.ERROR,
      message: error.message,
    })
  }
  else {
    span.setStatus({ code: SpanStatusCode.ERROR })
  }
}

export interface RecordSpanOptions {
  attributes: Attributes
  endWhenDone?: boolean
  name: string
  tracer: Tracer
}

export const recordSpan = async <T>({
  attributes,
  endWhenDone = true,
  name,
  tracer,
}: RecordSpanOptions, fn: (span: Span) => Promise<T>) =>
  tracer.startActiveSpan(name, { attributes }, async (span) => {
    try {
      const result = await fn(span)

      if (endWhenDone)
        span.end()

      return result
    }
    catch (error) {
      try {
        recordErrorOnSpan(span, error)
      }
      finally {
      // always stop the span when there is an error:
        span.end()
      }

      throw error
    }
  })
