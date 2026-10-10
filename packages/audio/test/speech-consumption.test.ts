import type { SpeechModel } from '../src'

import { setTimeout as delay } from 'node:timers/promises'

import { describe, expect, it } from 'vitest'

import { generateSpeech, speech, streamSpeech } from '../src'

describe('speech consumption', () => {
  it('returns a Promise even when the model supplies a Response synchronously', async () => {
    const response = new Response(new Uint8Array([1]), { headers: { 'Content-Type': 'audio/mpeg' } })
    const model: SpeechModel = () => response
    await expect(streamSpeech(model, { input: 'hello', voice: 'coral' })).resolves.toBe(response)
  })

  it('consumes a wire-independent Response model and preserves byte order', async () => {
    const model: SpeechModel = () => new Response(new ReadableStream<Uint8Array>({
      start: (output) => {
        output.enqueue(new Uint8Array([1, 2]))
        output.enqueue(new Uint8Array([3, 4]))
        output.close()
      },
    }), { headers: { 'Content-Type': 'audio/webm;codecs=opus' } })
    const blob = await generateSpeech(model, { input: 'hello', voice: 'coral' })
    expect(blob.type).toBe('audio/webm;codecs=opus')
    expect(new Uint8Array(await blob.arrayBuffer())).toEqual(new Uint8Array([1, 2, 3, 4]))
  })

  it('limits upstream reads while the audio body is not consumed', async () => {
    let produced = 0
    const cancelled = Promise.withResolvers<unknown>()
    const model = speech({
      baseURL: 'https://example.com/v1/',
      fetch: async () => new Response(new ReadableStream<Uint8Array>({
        cancel: reason => cancelled.resolve(reason),
        pull: (output) => {
          output.enqueue(new Uint8Array([produced++ % 256]))
          if (produced === 1000)
            output.close()
        },
      }), { headers: { 'Content-Type': 'audio/mpeg' } }),
      model: 'tts-model',
    })
    const response = await streamSpeech(model, { input: 'hello', voice: 'coral' })
    await delay(10)
    expect(produced).toBeLessThanOrEqual(1)
    const reader = response.body!.getReader()
    expect((await reader.read()).value).toEqual(new Uint8Array([0]))
    await delay(10)
    expect(produced).toBeLessThanOrEqual(2)
    await reader.cancel('stop playback')
    await expect(cancelled.promise).resolves.toBe('stop playback')
  }, 1000)

  it('propagates upstream read failure instead of returning a successful Blob', async () => {
    const error = new Error('Connection lost')
    let output!: ReadableStreamDefaultController<Uint8Array>
    const model = speech({
      baseURL: 'https://example.com/v1/',
      fetch: async () => new Response(new ReadableStream<Uint8Array>({
        start: (controller) => {
          output = controller
          controller.enqueue(new Uint8Array([1]))
        },
      }), { headers: { 'Content-Type': 'audio/mpeg' } }),
      model: 'tts-model',
    })
    const response = await streamSpeech(model, { input: 'hello', voice: 'coral' })
    const failed = expect(response.blob()).rejects.toBe(error)
    output.error(error)
    await failed
  })

  it('forwards abort to fetch and propagates the aborted response body', async () => {
    const abort = new AbortController()
    const error = new Error('Stop generation')
    const transportStopped = Promise.withResolvers<unknown>()
    const model = speech({
      baseURL: 'https://example.com/v1/',
      fetch: async (request) => {
        // Fake fetch follows native fetch: abort stops transport and errors its body.
        const signal = request.signal
        signal.throwIfAborted()
        return new Response(new ReadableStream<Uint8Array>({
          start: (output) => {
            signal.addEventListener('abort', () => {
              transportStopped.resolve(signal.reason)
              output.error(signal.reason)
            }, { once: true })
          },
        }), { headers: { 'Content-Type': 'audio/mpeg' } })
      },
      model: 'tts-model',
    })
    const response = await streamSpeech(model, { input: 'hello', signal: abort.signal, voice: 'coral' })
    const failed = expect(response.blob()).rejects.toBe(error)
    abort.abort(error)
    await failed
    await expect(transportStopped.promise).resolves.toBe(error)
  }, 1000)

  it('preserves an abort while fetch is still pending', async () => {
    const abort = new AbortController()
    const error = new Error('Stop initialization')
    const model = speech({
      baseURL: 'https://example.com/v1/',
      fetch: async request => new Promise((_, reject) => {
        request.signal.addEventListener('abort', () => reject(request.signal.reason), { once: true })
      }),
      model: 'tts-model',
    })
    const failed = expect(streamSpeech(model, { input: 'hello', signal: abort.signal, voice: 'coral' })).rejects.toBe(error)
    abort.abort(error)
    await failed
  }, 1000)

  it('preserves fetch rejection for an already aborted signal', async () => {
    const abort = new AbortController()
    const error = new Error('Already stopped')
    abort.abort(error)
    const model = speech({
      baseURL: 'https://example.com/v1/',
      fetch: async (request) => {
        request.signal.throwIfAborted()
        throw new Error('Unexpected request')
      },
      model: 'tts-model',
    })
    await expect(generateSpeech(model, { input: 'hello', signal: abort.signal, voice: 'coral' })).rejects.toBe(error)
  })

  it('cancels the upstream when audio iteration exits early', async () => {
    const cancelled = Promise.withResolvers<unknown>()
    const model = speech({
      baseURL: 'https://example.com/v1/',
      fetch: async () => new Response(new ReadableStream<Uint8Array>({
        cancel: reason => cancelled.resolve(reason),
        start: output => output.enqueue(new Uint8Array([1])),
      }), { headers: { 'Content-Type': 'audio/mpeg' } }),
      model: 'tts-model',
    })
    const response = await streamSpeech(model, { input: 'hello', voice: 'coral' })
    for await (const bytes of response.body!) {
      expect(bytes).toEqual(new Uint8Array([1]))
      if (bytes.byteLength > 0)
        break
    }
    await expect(cancelled.promise).resolves.toBeUndefined()
  }, 1000)
})
