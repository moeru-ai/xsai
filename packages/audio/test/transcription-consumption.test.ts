import type { TranscriptionEvent, TranscriptionModel } from '../src'

import { setTimeout as delay } from 'node:timers/promises'

import { describe, expect, it } from 'vitest'

import { generateTranscription, streamTranscription, transcription, transcriptionNonStreaming } from '../src'

const audio = new Blob(['audio'], { type: 'audio/wav' })

describe('transcription consumption', () => {
  it('limits SSE reads with a slow consumer and cancels upstream on early exit', async () => {
    let produced = 0
    const cancelled = Promise.withResolvers<unknown>()
    const encoder = new TextEncoder()
    const model = transcription({
      baseURL: 'https://example.com/v1/',
      fetch: async () => new Response(new ReadableStream<Uint8Array>({
        cancel: reason => cancelled.resolve(reason),
        pull: (output) => {
          produced++
          output.enqueue(encoder.encode('data: {"type":"transcript.text.delta","delta":"hello"}\n\n'))
          if (produced === 1000)
            output.close()
        },
      }), { headers: { 'Content-Type': 'text/event-stream' } }),
      model: 'transcribe-model',
    })
    const stream = await streamTranscription(model, { audio })
    await delay(10)
    expect(produced).toBeLessThanOrEqual(8)
    for await (const event of stream) {
      if (event.type === 'transcription.text.delta') {
        expect(event.delta).toBe('hello')
        break
      }
    }
    await expect(cancelled.promise).resolves.toBeUndefined()
    expect(produced).toBeLessThanOrEqual(10)
  }, 1000)

  it.each([transcription, transcriptionNonStreaming])('propagates native abort while waiting for response bytes', async (factory) => {
    const abort = new AbortController()
    const error = new Error('Stop reading')
    const transportStopped = Promise.withResolvers<unknown>()
    const model = factory({
      baseURL: 'https://example.com/v1/',
      fetch: async (_, init) => {
        const signal = init!.signal!
        signal.throwIfAborted()
        return new Response(new ReadableStream<Uint8Array>({
          start: (output) => {
            signal.addEventListener('abort', () => {
              transportStopped.resolve(signal.reason)
              output.error(signal.reason)
            }, { once: true })
          },
        }), { headers: { 'Content-Type': factory === transcription ? 'text/event-stream' : 'application/json' } })
      },
      model: 'transcribe-model',
    })
    const stream = await streamTranscription(model, { audio, signal: abort.signal })
    const failed = expect(generateTranscription(() => stream, { audio })).rejects.toBe(error)
    abort.abort(error)
    await failed
    await expect(transportStopped.promise).resolves.toBe(error)
  }, 1000)

  it.each([transcription, transcriptionNonStreaming])('does not complete a buffered response after the caller aborts', async (factory) => {
    const abort = new AbortController()
    const error = new Error('Stop transcription')
    const model = factory({
      baseURL: 'https://example.com/v1/',
      fetch: async (_, init) => {
        init!.signal!.throwIfAborted()
        return factory === transcription
          ? new Response('data: {"type":"transcript.text.done","text":"Hello."}\n\n', { headers: { 'Content-Type': 'text/event-stream' } })
          : Response.json({ text: 'Hello.' })
      },
      model: 'transcribe-model',
    })
    const stream = await streamTranscription(model, { audio, signal: abort.signal })
    abort.abort(error)
    await expect(generateTranscription(() => stream, { audio })).rejects.toBe(error)
  })

  it('stops JSON transport when cancelled while the body is being collected', async () => {
    const readingBody = Promise.withResolvers<void>()
    const transportStopped = Promise.withResolvers<unknown>()
    const model = transcriptionNonStreaming({
      baseURL: 'https://example.com/v1/',
      fetch: async (_, init) => {
        const signal = init!.signal!
        signal?.throwIfAborted()
        return new Response(new ReadableStream<Uint8Array>({
          cancel: reason => transportStopped.resolve(reason),
          pull: () => readingBody.resolve(),
          start: (output) => {
            signal?.addEventListener('abort', () => {
              transportStopped.resolve(signal.reason)
              output.error(signal.reason)
            }, { once: true })
          },
        }, { highWaterMark: 0 }), { headers: { 'Content-Type': 'application/json' } })
      },
      model: 'transcribe-model',
    })
    const reader = (await streamTranscription(model, { audio })).getReader()
    expect((await reader.read()).value).toEqual({ type: 'transcription.start' })
    const pending = reader.read()
    await readingBody.promise
    await reader.cancel('stop transcription')
    await expect(pending).resolves.toEqual({ done: true, value: undefined })
    await expect(transportStopped.promise).resolves.toBe('stop transcription')
  }, 1000)

  it('rejects a model stream that ends without a complete result', async () => {
    const model: TranscriptionModel = () => new ReadableStream({
      start: (output) => {
        output.enqueue({ delta: 'unfinished', type: 'transcription.text.delta' })
        output.close()
      },
    })
    await expect(generateTranscription(model, { audio })).rejects.toMatchObject({ code: 'truncated-stream' })
  })

  it('collects the complete end result instead of concatenating provisional deltas', async () => {
    const events: TranscriptionEvent[] = [
      { type: 'transcription.start' },
      { delta: 'draft', type: 'transcription.text.delta' },
      {
        languages: ['english'],
        segments: [{ endSecond: 2, id: '0', speakerId: 'speaker_0', startSecond: 0, text: 'Hello.' }],
        text: 'Hello.',
        type: 'transcription.end',
      },
    ]
    const model: TranscriptionModel = () => new ReadableStream({
      start: (output) => {
        for (const event of events)
          output.enqueue(event)
        output.close()
      },
    })

    expect(await generateTranscription(model, { audio })).toEqual({
      languages: ['english'],
      segments: [{ endSecond: 2, id: '0', speakerId: 'speaker_0', startSecond: 0, text: 'Hello.' }],
      text: 'Hello.',
    })
    const stream = new ReadableStream<TranscriptionEvent>()
    await expect(streamTranscription(() => stream, { audio })).resolves.toBe(stream)
  })
  it('propagates failures after the end result instead of returning early', async () => {
    const cause = new Error('Failure after end')
    let delivered = false
    const model: TranscriptionModel = () => new ReadableStream<TranscriptionEvent>({
      pull: (output) => {
        if (delivered) {
          output.error(cause)
        }
        else {
          delivered = true
          output.enqueue({ text: 'Hello.', type: 'transcription.end' })
        }
      },
    }, { highWaterMark: 0 })
    await expect(generateTranscription(model, { audio })).rejects.toBe(cause)
  })

  it('keeps streaming a synchronous custom model behind a consistent Promise', async () => {
    const source = new ReadableStream<TranscriptionEvent>()
    const pending = streamTranscription(() => source, { audio })
    expect(pending).toBeInstanceOf(Promise)
    expect(await pending).toBe(source)
    await source.cancel()
  })
})
