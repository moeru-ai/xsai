import { describe, expect, it } from 'vitest'

import { sendRequest } from '../src'

describe('sendRequest authorization', () => {
  it.each([
    { apiKey: '', expected: null },
    { apiKey: undefined, expected: null },
    { apiKey: 'secret', expected: 'Bearer secret' },
  ])('uses the API key only when it is present: $apiKey', async ({ apiKey, expected }) => {
    let authorization: null | string | undefined
    await sendRequest({ path: 'models' }, {
      apiKey,
      baseURL: 'https://example.com/',
      fetch: async (request) => {
        authorization = request.headers.get('Authorization')
        return new Response('ok')
      },
    })
    expect(authorization).toBe(expected)
  })

  it('preserves a custom authorization header when the API key is empty', async () => {
    let authorization: null | string | undefined
    await sendRequest({ path: 'models' }, {
      apiKey: '',
      baseURL: 'https://example.com/',
      fetch: async (request) => {
        authorization = request.headers.get('Authorization')
        return new Response('ok')
      },
      headers: { Authorization: 'Basic custom' },
    })
    expect(authorization).toBe('Basic custom')
  })
})

describe('sendRequest path', () => {
  it.each([
    { baseURL: 'https://example.com/v1', expected: 'https://example.com/v1/chat/completions', path: undefined },
    { baseURL: 'https://example.com/v1', expected: 'https://example.com/v1/decisions', path: 'decisions' },
    { baseURL: 'https://example.com/v1/', expected: 'https://example.com/v1/decisions', path: 'decisions' },
    { baseURL: 'https://example.com/v1', expected: 'https://example.com/decisions', path: '/decisions' },
    { baseURL: 'https://example.com/v1', expected: 'https://other.test/run', path: 'https://other.test/run' },
  ])('resolves $path against $baseURL', async ({ baseURL, expected, path }) => {
    let url: string | undefined
    await sendRequest({ path: 'chat/completions' }, {
      baseURL,
      fetch: async (request) => {
        url = request.url
        return new Response('ok')
      },
      path,
    })
    expect(url).toBe(expected)
  })
})

describe('sendRequest extraBody', () => {
  const send = async (body: FormData | Record<string, unknown> | undefined, extraBody: Record<string, unknown>) => {
    let sent: Request | undefined
    await sendRequest({ body, method: body == null ? 'GET' : 'POST', path: 'chat/completions' }, {
      baseURL: 'https://example.com/',
      extraBody,
      fetch: async (request) => {
        sent = request
        return new Response('ok')
      },
    })
    return sent!
  }

  it('adds fields to a JSON body as they are', async () => {
    const request = await send({ model: 'm1' }, { chat_template_kwargs: { enable_thinking: false } })

    expect(await request.json()).toEqual({ chat_template_kwargs: { enable_thinking: false }, model: 'm1' })
  })

  it('replaces an existing field and removes one set to undefined', async () => {
    const request = await send({ model: 'm1', top_p: 1 }, { model: 'm2', top_p: undefined })

    expect(await request.json()).toEqual({ model: 'm2' })
  })

  it('does not create a body for a request without one', async () => {
    const request = await send(undefined, { thinking: { type: 'enabled' } })

    expect(request.body).toBeNull()
  })

  it('leaves FormData unchanged', async () => {
    const body = new FormData()
    body.set('model', 'm1')
    const request = await send(body, { language: 'en' })
    const sent = await request.formData()

    expect([...sent.keys()]).toEqual(['model'])
  })
})
