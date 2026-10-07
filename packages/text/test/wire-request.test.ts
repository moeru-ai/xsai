import type { LanguageModel, TextEvent } from '../src'

import { describe, expect, it, vi } from 'vitest'

import { loop } from '../src'
import { wireRequest } from '../src/internal'

const options = { baseURL: 'https://example.com/v1', model: 'test-model' }
const init = { body: {}, path: 'chat/completions' }

describe('wireRequest', () => {
  it('propagates stream cancellation to the response body', async () => {
    const cancelBody = vi.fn()
    const body = new ReadableStream<Uint8Array>({ cancel: cancelBody })
    const stream = await wireRequest(
      { ...options, fetch: async () => new Response(body) },
      { input: 'hi' },
      init,
      new TransformStream<string, TextEvent>(),
    )

    const reason = new Error('stop')
    await stream.cancel(reason)
    await vi.waitFor(() => expect(cancelBody).toHaveBeenCalledWith(reason))
  })

  it('propagates loop cancellation through the model stream to the response body', async () => {
    const cancelBody = vi.fn()
    const requested = Promise.withResolvers<void>()
    const model: LanguageModel = async (modelOptions) => {
      const stream = await wireRequest(
        { ...options, fetch: async () => new Response(new ReadableStream<Uint8Array>({ cancel: cancelBody })) },
        modelOptions,
        init,
        new TransformStream<string, TextEvent>(),
      )
      requested.resolve()
      return stream
    }
    const reader = loop(model, { input: 'hi' }).getReader()
    void reader.read()

    await requested.promise
    const reason = new Error('stop')
    await reader.cancel(reason)

    await vi.waitFor(() => expect(cancelBody).toHaveBeenCalledWith(reason))
  })

  it('rejects with a typed network error when fetch rejects', async () => {
    const cause = new TypeError('fetch failed')
    const request = wireRequest(
      { ...options, fetch: async () => { throw cause } },
      { input: 'hi' },
      init,
      new TransformStream<string, TextEvent>(),
    )

    await expect(request).rejects.toMatchObject({ cause, code: 'network-error' })
  })

  it('propagates the abort reason when the signal aborts the request', async () => {
    const reason = new DOMException('user aborted', 'AbortError')
    const signal = AbortSignal.abort(reason)
    const request = wireRequest(
      {
        ...options,
        fetch: async (request) => {
          throw request.signal.reason
        },
      },
      { input: 'hi', signal },
      init,
      new TransformStream<string, TextEvent>(),
    )

    await expect(request).rejects.toBe(reason)
  })

  it('rejects with an http error carrying the response headers on non-2xx', async () => {
    const request = wireRequest(
      {
        ...options,
        fetch: async () => new Response('{"error":{"message":"bad key"}}', {
          headers: { 'retry-after': '30', 'x-request-id': 'req_abc' },
          status: 401,
        }),
      },
      { input: 'hi' },
      init,
      new TransformStream<string, TextEvent>(),
    )

    const error = await request.catch((error: unknown) => error)

    expect(error).toMatchObject({
      body: '{"error":{"message":"bad key"}}',
      code: 'http-error',
      status: 401,
    })
    expect((error as { headers: Headers }).headers.get('x-request-id')).toBe('req_abc')
    expect((error as { headers: Headers }).headers.get('retry-after')).toBe('30')
  })

  it('rejects with a typed error when the response has no body', async () => {
    const request = wireRequest(
      { ...options, fetch: async () => new Response(null) },
      { input: 'hi' },
      init,
      new TransformStream<string, TextEvent>(),
    )

    await expect(request).rejects.toMatchObject({ code: 'invalid-response' })
  })
})
