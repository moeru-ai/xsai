import type { SpeechOptions, SpeechProviderOptions } from '../src'

import { Buffer } from 'node:buffer'

import { describe, expect, expectTypeOf, it } from 'vitest'

import { generateSpeech, speech, streamSpeech } from '../src'

describe('speech', () => {
  it('posts text to the speech endpoint and returns its audio Response', async () => {
    const requests: { init?: RequestInit, input: Request | string | URL }[] = []
    let upstream!: Response
    const fetch: typeof globalThis.fetch = async (input, init) => {
      requests.push({ init, input })
      upstream = new Response(new Uint8Array([73, 68, 51, 4]), {
        headers: { 'Content-Type': 'audio/mpeg', 'X-Request-ID': 'upstream' },
      })
      return upstream
    }
    const response = await streamSpeech(speech({
      apiKey: 'secret',
      baseURL: 'https://example.com/v1',
      fetch,
      headers: { 'X-Custom': 'custom' },
      model: 'tts-model',
    }), {
      input: 'hello',
      providerOptions: { speech: { instructions: 'Speak softly', speed: 0.8 } },
      voice: 'coral',
    })

    expect(requests).toHaveLength(1)
    expect(requests[0]?.input.toString()).toBe('https://example.com/v1/audio/speech')
    expect(requests[0]?.init).toMatchObject({
      headers: { 'Authorization': 'Bearer secret', 'Content-Type': 'application/json', 'X-Custom': 'custom' },
      method: 'POST',
    })
    expect(JSON.parse(requests[0].init!.body as string)).toEqual({
      input: 'hello',
      instructions: 'Speak softly',
      model: 'tts-model',
      response_format: 'mp3',
      speed: 0.8,
      stream_format: 'audio',
      voice: 'coral',
    })
    expect(response).toBe(upstream)
    expect(response.headers.get('Content-Type')).toBe('audio/mpeg')
    expect(response.headers.get('X-Request-ID')).toBe('upstream')
    expect(new Uint8Array(await response.arrayBuffer())).toEqual(new Uint8Array([73, 68, 51, 4]))
  })

  it('delivers audio before the upstream file is complete', async () => {
    let output!: ReadableStreamDefaultController<Uint8Array>
    const model = speech({
      baseURL: 'https://example.com/v1/',
      fetch: async () => new Response(new ReadableStream<Uint8Array>({
        start: (controller) => {
          output = controller
          controller.enqueue(new Uint8Array([73, 68]))
        },
      }), { headers: { 'Content-Type': 'audio/mpeg' } }),
      model: 'tts-model',
    })
    const response = await streamSpeech(model, { input: 'hello', voice: 'coral' })
    const reader = response.body!.getReader()
    expect(await reader.read()).toEqual({ done: false, value: new Uint8Array([73, 68]) })
    output.enqueue(new Uint8Array([51, 4]))
    output.close()
    expect(await reader.read()).toEqual({ done: false, value: new Uint8Array([51, 4]) })
    expect(await reader.read()).toEqual({ done: true, value: undefined })
  }, 1000)

  it('collects WAV bytes into a Blob without rejecting PCM inside the container', async () => {
    // A mono, 8 kHz, 16-bit PCM WAV file with two samples.
    const wav = new Uint8Array(Buffer.from('UklGRigAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YQQAAAAAAP9/', 'base64'))
    const model = speech({
      baseURL: 'https://example.com/v1/',
      fetch: async (_, init) => {
        expect(JSON.parse(init!.body as string)).toMatchObject({ response_format: 'wav' })
        return new Response(wav, { headers: { 'Content-Type': 'audio/wav' } })
      },
      model: 'tts-model',
    })
    const blob = await generateSpeech(model, { input: 'hello', providerOptions: { speech: { outputFormat: 'wav' } }, voice: 'coral' })
    expect(blob.type).toBe('audio/wav')
    expect(new Uint8Array(await blob.arrayBuffer())).toEqual(wav)
  })

  it.each<[string | undefined, NonNullable<SpeechProviderOptions['speech']>['outputFormat'], string]>([
    [undefined, 'mp3', 'audio/mpeg'],
    ['application/octet-stream', 'wav', 'audio/wav'],
    ['audio/ogg; codecs=opus', 'opus', 'audio/ogg; codecs=opus'],
  ])('uses the file format contract for Content-Type %s', async (contentType, outputFormat, expected) => {
    const model = speech({
      baseURL: 'https://example.com/v1/',
      fetch: async () => new Response(new Uint8Array([1, 2]), {
        headers: contentType == null ? {} : { 'Content-Type': contentType },
      }),
      model: 'tts-model',
    })
    const response = await streamSpeech(model, { input: 'hello', providerOptions: { speech: { outputFormat } }, voice: 'coral' })
    expect(response.headers.get('Content-Type')).toBe(expected)
    expect(new Uint8Array(await response.arrayBuffer())).toEqual(new Uint8Array([1, 2]))
  })

  it('requires voice and limits output formats through types', () => {
    expectTypeOf<SpeechOptions>().toExtend<{ voice: string }>()
    expectTypeOf<SpeechOptions['voice']>().toEqualTypeOf<string>()
    expectTypeOf<NonNullable<SpeechProviderOptions['speech']>['outputFormat']>().toEqualTypeOf<'aac' | 'flac' | 'mp3' | 'opus' | 'wav' | undefined>()
  })

  it.each(['audio/pcm', 'audio/opus', 'text/event-stream', 'application/json', 'audio/wav'])('rejects unexpected %s and cancels the body', async (contentType) => {
    const cancelled = Promise.withResolvers<unknown>()
    const model = speech({
      baseURL: 'https://example.com/v1/',
      fetch: async () => new Response(new ReadableStream<Uint8Array>({
        cancel: reason => cancelled.resolve(reason),
      }), { headers: { 'Content-Type': contentType } }),
      model: 'tts-model',
    })
    await expect(streamSpeech(model, { input: 'hello', voice: 'coral' })).rejects.toMatchObject({ code: 'invalid-response' })
    await expect(cancelled.promise).resolves.toMatchObject({ code: 'invalid-response' })
  })

  it('rejects a successful response with no body through shared HTTP validation', async () => {
    const model = speech({
      baseURL: 'https://example.com/v1/',
      fetch: async () => new Response(null),
      model: 'tts-model',
    })
    await expect(generateSpeech(model, { input: 'hello', voice: 'coral' })).rejects.toMatchObject({ code: 'invalid-response' })
  })

  it('rejects HTTP errors during initialization', async () => {
    const model = speech({
      baseURL: 'https://example.com/v1/',
      fetch: async () => new Response('rate limited', { status: 429 }),
      model: 'tts-model',
    })
    await expect(streamSpeech(model, { input: 'hello', voice: 'coral' })).rejects.toMatchObject({
      body: 'rate limited',
      code: 'http-error',
      status: 429,
    })
  })

  it('preserves the cause of connection failures', async () => {
    const cause = new Error('Connection refused')
    const model = speech({
      baseURL: 'https://example.com/v1/',
      fetch: async () => { throw cause },
      model: 'tts-model',
    })
    await expect(generateSpeech(model, { input: 'hello', voice: 'coral' })).rejects.toMatchObject({ cause, code: 'network-error' })
  })
})
