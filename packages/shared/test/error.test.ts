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

  it('narrows unknown values with isInstance', () => {
    expect(XSAIError.isInstance(new XSAIError('invalid-input', 'x'))).toBe(true)
    expect(XSAIError.isInstance(new Error('x'))).toBe(false)
    expect(XSAIError.isInstance('x')).toBe(false)
  })

  it('requires a cause for codes that always wrap an underlying failure', () => {
    const cause = new TypeError('fetch failed')
    const error = new XSAIError('network-error', 'request failed', { cause })

    expect(error.cause).toBe(cause)
    // @ts-expect-error network-error requires a cause
    expect(() => new XSAIError('network-error', 'request failed')).not.toThrow()
  })

  it('forbids a cause for codes that are their own evidence', () => {
    // @ts-expect-error http-error carries the response itself, not a cause
    expect(() => new HttpError({ body: '', headers: new Headers(), status: 500 }, { cause: new Error('x') })).not.toThrow()
  })
})

describe('httpError', () => {
  it('carries status and body under the http-error code', () => {
    const error = new HttpError({ body: '{"error":"slow down"}', headers: new Headers(), status: 429 })

    expect(error).toBeInstanceOf(XSAIError)
    expect(error.code).toBe('http-error')
    expect(error.name).toBe('HttpError')
    expect(error.status).toBe(429)
    expect(error.body).toBe('{"error":"slow down"}')
    expect(error.message).toBe('HTTP 429: {"error":"slow down"}')
  })

  it('narrows to HttpError with isInstance', () => {
    const error: unknown = new HttpError({ body: 'unauthorized', headers: new Headers(), status: 401 })

    expect(HttpError.isInstance(error)).toBe(true)
    expect(XSAIError.isInstance(error)).toBe(true)
  })
})
