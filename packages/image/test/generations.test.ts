import { describe, expect, it } from 'vitest'

import { generateImage, generations } from '../src'

const png = 'iVBORw0KGgo='

describe('generations', () => {
  // File identifiers from WHATWG MIME Sniffing and the AVIF file type brands.
  it.each([
    { base64: '/9j/', mime: 'image/jpeg' },
    { base64: 'R0lGODdh', mime: 'image/gif' },
    { base64: 'R0lGODlh', mime: 'image/gif' },
    { base64: 'UklGRgQAAABXRUJQVlA4IA==', mime: 'image/webp' },
    { base64: 'AAAAFGZ0eXBhdmlmAAAAAG1pZjE=', mime: 'image/avif' },
    { base64: 'AAAAFGZ0eXBhdmlzAAAAAG1pZjE=', mime: 'image/avif' },
    { base64: 'AAAAGGZ0eXBtaWYxAAAAAG1pZjFhdmlm', mime: 'image/avif' },
  ])('uses the bytes to recognize $mime', async ({ base64, mime }) => {
    const model = generations({
      baseURL: 'https://example.com/v1/',
      fetch: async () => Response.json({ data: [{ b64_json: base64 }], output_format: 'png' }),
      model: 'image-model',
    })
    const result = await generateImage(model, { input: 'a cat' })
    expect(result.image.type).toBe(mime)
  })

  it('posts generation options and returns decoded image bytes with their MIME', async () => {
    const requests: Request[] = []
    const model = generations({
      apiKey: 'secret',
      baseURL: 'https://example.com/v1',
      fetch: async (request) => {
        requests.push(request)
        return Response.json({ data: [{ b64_json: png }] })
      },
      headers: { 'X-Custom': 'custom' },
      model: 'image-model',
    })
    const abort = new AbortController()
    const result = await generateImage(model, {
      input: 'a cat',
      n: 2,
      providerOptions: { generations: { background: 'transparent', outputCompression: 0, outputFormat: 'webp', quality: 'high' } },
      signal: abort.signal,
      size: '1024x1536',
    })

    expect(requests).toHaveLength(1)
    expect(requests[0].url).toBe('https://example.com/v1/images/generations')
    expect(requests[0].method).toBe('POST')
    expect(Object.fromEntries(requests[0].headers)).toEqual({
      'authorization': 'Bearer secret',
      'content-type': 'application/json',
      'x-custom': 'custom',
    })
    abort.abort()
    expect(requests[0].signal.aborted).toBe(true)
    expect(await requests[0].json()).toEqual({
      background: 'transparent',
      model: 'image-model',
      n: 2,
      output_compression: 0,
      output_format: 'webp',
      prompt: 'a cat',
      quality: 'high',
      size: '1024x1536',
    })
    expect(result.images).toHaveLength(1)
    expect(result.image).toBe(result.images[0])
    expect(result.image.type).toBe('image/png')
    expect(new Uint8Array(await result.image.arrayBuffer())).toEqual(new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]))
  })

  it('preserves aligned revised prompts and discards other wire metadata', async () => {
    const model = generations({
      baseURL: 'https://example.com/v1/',
      fetch: async () => Response.json({
        background: 'opaque',
        created: 0,
        data: [{ b64_json: png }, { b64_json: '/9j/', revised_prompt: 'a revised cat' }],
        output_format: 'webp',
        quality: 'high',
        size: '1024x1536',
        unknown: 'discard',
        usage: {
          input_tokens: 0,
          input_tokens_details: { image_tokens: 0, text_tokens: 4, unknown: 'discard' },
          output_tokens: 9,
          output_tokens_details: { image_tokens: 9, text_tokens: 0 },
          total_tokens: 9,
        },
      }),
      model: 'image-model',
    })
    const result = await generateImage(model, { input: 'a cat', n: 3 })
    expect(result.images.map(image => image.type)).toEqual(['image/png', 'image/jpeg'])
    expect(result).not.toHaveProperty('usage')
    expect(result.providerMetadata).toStrictEqual({
      generations: {
        images: [{}, { revisedPrompt: 'a revised cat' }],
      },
    })
  })

  it('leaves request defaults to the service and omits absent or null result fields', async () => {
    const model = generations({
      baseURL: 'https://example.com/v1/',
      fetch: async (request) => {
        expect(JSON.parse(await request.text())).toStrictEqual({ model: 'image-model', prompt: 'a cat' })
        return Response.json({
          background: null,
          created: null,
          data: [{ b64_json: png, revised_prompt: null }],
          output_format: null,
          quality: null,
          size: null,
          usage: null,
        })
      },
      model: 'image-model',
    })
    const result = await generateImage(model, { input: 'a cat' })
    expect(result).not.toHaveProperty('usage')
    expect(result).not.toHaveProperty('providerMetadata')
  })

  it('preserves a reported empty revised prompt', async () => {
    const model = generations({
      baseURL: 'https://example.com/v1/',
      fetch: async () => Response.json({
        data: [{ b64_json: png, revised_prompt: '' }],
      }),
      model: 'image-model',
    })
    const result = await generateImage(model, { input: 'a cat' })
    expect(result.providerMetadata).toStrictEqual({ generations: { images: [{ revisedPrompt: '' }] } })
  })

  it.each(['', 'AQID', 'UklGRgQAAABXQVZF', 'AAAAFGZ0eXBtaWYxAAAAAG1pZjE='])('rejects unknown image bytes (%s) instead of guessing PNG', async (base64) => {
    const model = generations({
      baseURL: 'https://example.com/v1/',
      fetch: async () => Response.json({ data: [{ b64_json: base64 }] }),
      model: 'image-model',
    })
    await expect(generateImage(model, { input: 'a cat' })).rejects.toMatchObject({ code: 'invalid-response' })
  })

  it('rejects the whole result when one image cannot be decoded', async () => {
    const model = generations({
      baseURL: 'https://example.com/v1/',
      fetch: async () => Response.json({ data: [{ b64_json: png }, { b64_json: '%%%' }] }),
      model: 'image-model',
    })
    await expect(generateImage(model, { input: 'a cat' })).rejects.toThrow()
  })

  it('rejects an empty wire result', async () => {
    const model = generations({
      baseURL: 'https://example.com/v1/',
      fetch: async () => Response.json({ data: [] }),
      model: 'image-model',
    })
    await expect(generateImage(model, { input: 'a cat' })).rejects.toMatchObject({ code: 'invalid-response' })
  })

  it('preserves HTTP failures without retrying', async () => {
    let calls = 0
    const model = generations({
      baseURL: 'https://example.com/v1/',
      fetch: async () => {
        calls++
        return new Response('rate limited', { headers: { 'Retry-After': '10' }, status: 429 })
      },
      model: 'image-model',
    })
    await expect(generateImage(model, { input: 'a cat' })).rejects.toMatchObject({ body: 'rate limited', code: 'http-error', status: 429 })
    expect(calls).toBe(1)
  })

  it('preserves network failures and their cause', async () => {
    const cause = new Error('Connection lost')
    const model = generations({
      baseURL: 'https://example.com/v1/',
      fetch: async () => { throw cause },
      model: 'image-model',
    })
    await expect(generateImage(model, { input: 'a cat' })).rejects.toMatchObject({ cause, code: 'network-error' })
  })

  it('preserves cancellation while reading the JSON response', async () => {
    const abort = new AbortController()
    const reason = new Error('Stop generation')
    const reading = Promise.withResolvers<void>()
    const model = generations({
      baseURL: 'https://example.com/v1/',
      fetch: async (request) => {
        const signal = request.signal
        signal.throwIfAborted()
        return new Response(new ReadableStream<Uint8Array>({
          pull: () => { reading.resolve() },
          start: (output) => {
            signal.addEventListener('abort', () => output.error(signal.reason), { once: true })
          },
        }))
      },
      model: 'image-model',
    })
    const failed = expect(generateImage(model, { input: 'a cat', signal: abort.signal })).rejects.toBe(reason)
    await reading.promise
    abort.abort(reason)
    await failed
  })

  it('preserves an already cancelled request', async () => {
    const reason = new Error('Already stopped')
    const model = generations({
      baseURL: 'https://example.com/v1/',
      fetch: async (request) => {
        request.signal.throwIfAborted()
        throw new Error('Unexpected request')
      },
      model: 'image-model',
    })
    await expect(generateImage(model, { input: 'a cat', signal: AbortSignal.abort(reason) })).rejects.toBe(reason)
  })
})
