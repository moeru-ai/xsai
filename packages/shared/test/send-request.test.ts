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
