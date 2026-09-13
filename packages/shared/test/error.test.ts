import { describe, expect, it } from 'vitest'

import { HttpError, XSAIError } from '../src'

describe('xsaiError', () => {
  it('carries code, message, and name', () => {
    const error = new XSAIError('invalid-input', 'bad input')

    expect(error).toBeInstanceOf(Error)
    expect(error.code).toBe('invalid-input')
    expect(error.message).toBe('bad input')
    expect(error.name).toBe('XSAIError')
  })

  it('preserves an unknown cause through ErrorOptions', () => {
    const cause = { type: 'server_error' }
    const error = new XSAIError('model-error', 'model stream failed', { cause })

    expect(error.cause).toBe(cause)
  })

  it('narrows unknown values with isInstance', () => {
    expect(XSAIError.isInstance(new XSAIError('invalid-input', 'x'))).toBe(true)
    expect(XSAIError.isInstance(new Error('x'))).toBe(false)
    expect(XSAIError.isInstance('x')).toBe(false)
  })
})

describe('httpError', () => {
  it('carries status and body under the http-error code', () => {
    const error = new HttpError(429, '{"error":"slow down"}')

    expect(error).toBeInstanceOf(XSAIError)
    expect(error.code).toBe('http-error')
    expect(error.name).toBe('HttpError')
    expect(error.status).toBe(429)
    expect(error.body).toBe('{"error":"slow down"}')
    expect(error.message).toBe('HTTP 429: {"error":"slow down"}')
  })

  it('narrows to HttpError with isInstance', () => {
    const error: unknown = new HttpError(401, 'unauthorized')

    expect(HttpError.isInstance(error)).toBe(true)
    expect(XSAIError.isInstance(error)).toBe(true)
  })
})
