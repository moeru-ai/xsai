import { describe, expect, it } from 'vitest'

import { APICallError, InvalidResponseError, JSONParseError, responseCatch, responseJSON, XSAIError } from '../src'

describe('@xsai/shared errors', () => {
  it('aPICallError.isInstance narrows shared errors', async () => {
    const createResponse = () => new Response('upstream failed', {
      status: 503,
      statusText: 'Service Unavailable',
    })

    await expect(responseCatch(createResponse())).rejects.toBeInstanceOf(APICallError)

    try {
      await responseCatch(createResponse())
    }
    catch (error) {
      expect(APICallError.isInstance(error)).toBe(true)
      expect(XSAIError.isInstance(error)).toBe(true)

      if (!APICallError.isInstance(error))
        throw error

      expect(error.code).toBe('api_call_error')
      expect(error.statusCode).toBe(503)
      expect(error.isRetryable).toBe(true)
      expect(error.responseBody).toBe('upstream failed')
    }
  })

  it('throws InvalidResponseError when response body is missing', async () => {
    const response = {
      body: null,
      ok: true,
    } as Response

    await expect(responseCatch(response)).rejects.toMatchObject({
      code: 'invalid_response',
      reason: 'empty_body',
    })
  })

  it('throws InvalidResponseError when response body is not a stream', async () => {
    const response = {
      body: {},
      headers: new Headers({ 'Content-Type': 'application/json' }),
      ok: true,
    } as Response

    await expect(responseCatch(response)).rejects.toMatchObject({
      code: 'invalid_response',
      contentType: 'application/json',
      reason: 'invalid_body',
    })
  })

  it('stores responseBody on InvalidResponseError when no choices are returned', () => {
    const error = new InvalidResponseError('No choices returned', {
      reason: 'no_choices',
      responseBody: '{"choices":[]}',
    })

    expect(error.code).toBe('invalid_response')
    expect(error.reason).toBe('no_choices')
    expect(error.responseBody).toBe('{"choices":[]}')
  })

  it('throws JSONParseError for invalid JSON responses', async () => {
    await expect(responseJSON(new Response('not-json'))).rejects.toBeInstanceOf(JSONParseError)

    try {
      await responseJSON(new Response('not-json'))
    }
    catch (error) {
      if (!JSONParseError.isInstance(error))
        throw error

      expect(error.text).toBe('not-json')
      expect(error.cause).toBeInstanceOf(SyntaxError)
    }
  })
})
