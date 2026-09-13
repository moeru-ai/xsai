import type { Event } from '../src'

import { describe, expect, it } from 'vitest'

import { wireRequest } from '../src'

const options = { baseURL: 'https://example.com/v1', model: 'test-model' }
const init = { body: {}, path: 'chat/completions' }

describe('wireRequest', () => {
  it('rejects with a typed network error when fetch rejects', async () => {
    const cause = new TypeError('fetch failed')
    const request = wireRequest(
      { ...options, fetch: async () => { throw cause } },
      undefined,
      init,
      new TransformStream<string, Event>(),
    )

    await expect(request).rejects.toMatchObject({ cause, code: 'network-error' })
  })

  it('propagates the abort reason when the signal aborts the request', async () => {
    const reason = new DOMException('user aborted', 'AbortError')
    const signal = AbortSignal.abort(reason)
    const request = wireRequest(
      {
        ...options,
        fetch: async (_input, requestInit) => {
          throw requestInit?.signal?.reason
        },
      },
      { signal },
      init,
      new TransformStream<string, Event>(),
    )

    await expect(request).rejects.toBe(reason)
  })

  it('rejects with a typed error when the response has no body', async () => {
    const request = wireRequest(
      { ...options, fetch: async () => new Response(null) },
      undefined,
      init,
      new TransformStream<string, Event>(),
    )

    await expect(request).rejects.toMatchObject({ code: 'invalid-response' })
  })
})
