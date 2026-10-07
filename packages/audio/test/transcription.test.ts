import type { TranscriptionModelProviderOptions } from '../src'

import { describe, expect, it } from 'vitest'

import { generateTranscription, streamTranscription, transcriptions, transcriptionsNonStreaming } from '../src'

const audio = new File(['audio'], 'recording.wav', { type: 'audio/wav' })

describe('transcription', () => {
  it('preserves known segment and word metadata from JSON without exposing unknown fields', async () => {
    const model = transcriptionsNonStreaming({
      baseURL: 'https://example.com/v1/',
      fetch: async () => Response.json({
        segments: [{
          avg_logprob: -0.25,
          compression_ratio: 1.2,
          end: 2,
          id: 0,
          no_speech_prob: 0,
          seek: 0,
          speaker: 'speaker_0',
          start: 0.5,
          temperature: 0,
          text: 'Hello.',
          tokens: [],
          unknown_analysis: 'ignored',
        }],
        text: 'Hello.',
        words: [{ end: 2, probability: 0, start: 0.5, unknown_analysis: 'ignored', word: 'Hello.' }],
      }),
      model: 'whisper-model',
    })
    expect(await generateTranscription(model, { audio })).toEqual({
      segments: [{
        endSecond: 2,
        id: '0',
        providerMetadata: {
          transcriptions: { avgLogprob: -0.25, compressionRatio: 1.2, noSpeechProb: 0, seek: 0, speaker: 'speaker_0', temperature: 0, tokens: [] },
        },
        startSecond: 0.5,
        text: 'Hello.',
      }],
      text: 'Hello.',
      words: [{ endSecond: 2, providerMetadata: { transcriptions: { probability: 0 } }, startSecond: 0.5, text: 'Hello.' }],
    })
  })

  it.each(['english', 'en', 'custom-language', undefined])('preserves the reported language %s without conversion or an input fallback', async (language) => {
    const model = transcriptionsNonStreaming({
      baseURL: 'https://example.com/v1/',
      fetch: async () => Response.json({ language, languages: [{ code: 'en' }, { code: 'zh' }], text: 'Hello. 你好。' }),
      model: 'transcription-model',
    })
    expect(await generateTranscription(model, { audio, language: 'zh' })).toEqual({ language, text: 'Hello. 你好。' })
  })

  it('preserves sparse segment metadata in both SSE segment events and the final result', async () => {
    const model = transcriptions({
      baseURL: 'https://example.com/v1/',
      fetch: async () => new Response(
        'data: {"type":"transcript.text.segment","id":"seg_0","speaker":"speaker_0","start":0.5,"end":2,"text":"Hello.","avg_logprob":0,"tokens":[41,42],"temperature":null,"unknown_analysis":"ignored"}\n\ndata: {"type":"transcript.text.done","text":"Hello."}\n\n',
        { headers: { 'Content-Type': 'text/event-stream' } },
      ),
      model: 'transcription-model',
    })
    const segment = {
      endSecond: 2,
      id: 'seg_0',
      providerMetadata: { transcriptions: { avgLogprob: 0, speaker: 'speaker_0', temperature: null, tokens: [41, 42] } },
      startSecond: 0.5,
      text: 'Hello.',
    }
    expect(await Array.fromAsync(await streamTranscription(model, { audio }))).toEqual([
      { type: 'transcription.start' },
      { ...segment, type: 'transcription.text.segment' },
      { segments: [segment], text: 'Hello.', type: 'transcription.end' },
    ])
  })

  describe.each([
    { factory: transcriptions, mode: 'SSE' },
    { factory: transcriptionsNonStreaming, mode: 'JSON' },
  ])('multipart filenames with $mode', ({ factory }) => {
    it.each([
      { audio, expectedName: 'recording.wav', fileName: undefined, kind: 'File' },
      { audio: new Blob(['audio'], { type: 'audio/wav' }), expectedName: 'blob', fileName: undefined, kind: 'Blob' },
      { audio, expectedName: 'override.wav', fileName: 'override.wav', kind: 'File' },
      { audio: new Blob(['audio'], { type: 'audio/wav' }), expectedName: 'override.wav', fileName: 'override.wav', kind: 'Blob' },
    ])('uploads $kind as $expectedName with fileName=$fileName', async ({ audio, expectedName, fileName }) => {
      const model = factory({
        baseURL: 'https://example.com/v1/',
        fetch: async (request) => {
          const body = await request.formData()
          expect(body.get('file')).toMatchObject({ name: expectedName, type: 'audio/wav' })
          return factory === transcriptions
            ? new Response('data: {"type":"transcript.text.done","text":"Hello."}\n\n', { headers: { 'Content-Type': 'text/event-stream' } })
            : Response.json({ text: 'Hello.' })
        },
        model: 'transcription-model',
      })
      expect(await generateTranscription(model, { audio, fileName })).toEqual({ text: 'Hello.' })
    })
  })

  it.each<{ expected: string[], options: NonNullable<TranscriptionModelProviderOptions['transcriptions']> }>([
    { expected: [], options: {} },
    { expected: [], options: { responseFormat: 'diarized_json' } },
    { expected: ['segment'], options: { responseFormat: 'verbose_json' } },
    { expected: ['word'], options: { responseFormat: 'verbose_json', timestampGranularities: ['word'] } },
    { expected: [], options: { responseFormat: 'verbose_json', timestampGranularities: [] } },
  ])('uploads timestamp granularities $expected for $options', async ({ expected, options }) => {
    const model = transcriptionsNonStreaming({
      baseURL: 'https://example.com/v1/',
      fetch: async (request) => {
        const body = await request.formData()
        expect(body.getAll('timestamp_granularities[]')).toEqual(expected)
        return Response.json({ text: 'Hello.' })
      },
      model: 'whisper-model',
    })
    expect(await generateTranscription(model, { audio, providerOptions: { transcriptions: options } })).toEqual({ text: 'Hello.' })
  })

  it.each(['', 'data: [DONE]\n\n', 'data: {"type":"transcript.text.delta","delta":"unfinished"}\n\n'])(
    'rejects SSE EOF without a transcription done event: %s',
    async (body) => {
      const model = transcriptions({
        baseURL: 'https://example.com/v1/',
        fetch: async () => new Response(body, { headers: { 'Content-Type': 'text/event-stream' } }),
        model: 'transcription-model',
      })
      await expect(generateTranscription(model, { audio })).rejects.toMatchObject({ code: 'truncated-stream' })
    },
  )

  it.each([transcriptions, transcriptionsNonStreaming])('accepts a complete silent recording without inventing metadata', async (factory) => {
    const model = factory({
      baseURL: 'https://example.com/v1/',
      fetch: async () => factory === transcriptions
        ? new Response('data: {"type":"transcript.text.done","text":""}\n\n', { headers: { 'Content-Type': 'text/event-stream' } })
        : Response.json({ text: '' }),
      model: 'transcription-model',
    })
    expect(await generateTranscription(model, { audio })).toEqual({ text: '' })
  })

  it('rejects JSON received by the SSE adapter and cancels the unexpected body', async () => {
    const cancelled = Promise.withResolvers<unknown>()
    const model = transcriptions({
      baseURL: 'https://example.com/v1/',
      fetch: async () => new Response(new ReadableStream({ cancel: reason => cancelled.resolve(reason) }), {
        headers: { 'Content-Type': 'application/json' },
      }),
      model: 'transcription-model',
    })
    await expect(streamTranscription(model, { audio })).rejects.toMatchObject({ code: 'invalid-response' })
    await expect(cancelled.promise).resolves.toMatchObject({ code: 'invalid-response' })
  })

  it('propagates a provider SSE error even if a done frame follows it', async () => {
    const model = transcriptions({
      baseURL: 'https://example.com/v1/',
      fetch: async () => new Response(
        'data: {"type":"error","error":{"message":"Transcription failed"}}\n\ndata: {"type":"transcript.text.done","text":""}\n\n',
        { headers: { 'Content-Type': 'text/event-stream' } },
      ),
      model: 'transcription-model',
    })
    await expect(generateTranscription(model, { audio })).rejects.toMatchObject({
      cause: { message: 'Transcription failed' },
      code: 'invalid-response',
    })
  })

  it.each(['JSON', 'SSE'])('rejects a %s response without valid final text', async (mode) => {
    const model = (mode === 'JSON' ? transcriptionsNonStreaming : transcriptions)({
      baseURL: 'https://example.com/v1/',
      fetch: async () => mode === 'JSON'
        ? Response.json({ text: null })
        : new Response('data: {"type":"transcript.text.done","text":null}\n\n', { headers: { 'Content-Type': 'text/event-stream' } }),
      model: 'transcription-model',
    })
    await expect(generateTranscription(model, { audio })).rejects.toMatchObject({ code: 'invalid-response' })
  })

  it('delivers SSE deltas and completed segments, then uses done text as the complete result', async () => {
    let upstream!: ReadableStreamDefaultController<Uint8Array>
    const encoder = new TextEncoder()
    const model = transcriptions({
      baseURL: 'https://example.com/v1/',
      fetch: async (request) => {
        const body = await request.formData()
        expect(body.get('stream')).toBe('true')
        expect(body.get('response_format')).toBe('diarized_json')
        return new Response(new ReadableStream<Uint8Array>({
          start: (output) => {
            upstream = output
            output.enqueue(encoder.encode(': keepalive\r\ndata: {"type":"transcript.text.delta","delta":"draft","segment_id":"seg_0"}\r\n\r\n'))
          },
        }), { headers: { 'Content-Type': 'text/event-stream; charset=utf-8' } })
      },
      model: 'diarize-model',
    })
    const stream = await streamTranscription(model, {
      audio,
      providerOptions: { transcriptions: { responseFormat: 'diarized_json' } },
    })
    const reader = stream.getReader()
    expect((await reader.read()).value).toEqual({ type: 'transcription.start' })
    expect((await reader.read()).value).toEqual({ delta: 'draft', segmentId: 'seg_0', type: 'transcription.text.delta' })
    upstream.enqueue(encoder.encode('data: {"type":"transcript.text.segment","id":"seg_0","speaker":"speaker_0","start":0.5,"end":2,"text":"Hello."}\n\n'))
    expect((await reader.read()).value).toEqual({
      endSecond: 2,
      id: 'seg_0',
      providerMetadata: { transcriptions: { speaker: 'speaker_0' } },
      startSecond: 0.5,
      text: 'Hello.',
      type: 'transcription.text.segment',
    })
    upstream.enqueue(encoder.encode('data: {"type":"transcript.text.done","text":"Hello.","languages":[{"code":"en"},{"code":"zh"}]}\n\n'))
    expect((await reader.read()).value).toEqual({
      segments: [{ endSecond: 2, id: 'seg_0', providerMetadata: { transcriptions: { speaker: 'speaker_0' } }, startSecond: 0.5, text: 'Hello.' }],
      text: 'Hello.',
      type: 'transcription.end',
    })
    expect(await reader.read()).toEqual({ done: true, value: undefined })
  }, 1000)

  it('uploads a File as multipart and emits only start/end with normalized JSON data', async () => {
    const model = transcriptionsNonStreaming({
      apiKey: 'secret',
      baseURL: 'https://example.com/v1',
      fetch: async (request) => {
        expect(request.url).toBe('https://example.com/v1/audio/transcriptions')
        expect(request.method).toBe('POST')
        expect(request.headers.get('Authorization')).toBe('Bearer secret')
        expect(request.headers.get('X-Custom')).toBe('custom')
        expect(request.headers.get('Content-Type')).toMatch(/^multipart\/form-data; boundary=/)
        const body = await request.formData()
        expect(body.get('file')).toMatchObject({ name: 'recording.wav', type: 'audio/wav' })
        expect(body.get('model')).toBe('whisper-model')
        expect(body.get('language')).toBe('en')
        expect(body.get('response_format')).toBe('verbose_json')
        expect(body.getAll('timestamp_granularities[]')).toEqual(['word', 'segment'])
        expect(body.get('prompt')).toBe('Previous sentence.')
        expect(body.get('temperature')).toBe('0')
        expect(body.get('chunking_strategy')).toBe('auto')
        expect(body.get('stream')).toBeNull()
        return Response.json({
          duration: 2.5,
          language: 'english',
          segments: [{ end: 2, id: 0, start: 0.5, text: 'Hello.' }],
          text: 'Hello.',
          words: [{ end: 2, start: 0.5, word: 'Hello.' }],
        })
      },
      headers: { 'Content-Type': 'application/json', 'X-Custom': 'custom' },
      model: 'whisper-model',
    })
    const options = {
      audio,
      language: 'en',
      providerOptions: {
        transcriptions: {
          chunkingStrategy: 'auto' as const,
          prompt: 'Previous sentence.',
          responseFormat: 'verbose_json' as const,
          temperature: 0,
          timestampGranularities: ['word', 'segment'] as ('segment' | 'word')[],
        },
      },
    }
    const events = []
    for await (const event of await streamTranscription(model, options))
      events.push(event)
    expect(events).toEqual([
      { type: 'transcription.start' },
      {
        durationInSeconds: 2.5,
        language: 'english',
        segments: [{ endSecond: 2, id: '0', startSecond: 0.5, text: 'Hello.' }],
        text: 'Hello.',
        type: 'transcription.end',
        words: [{ endSecond: 2, startSecond: 0.5, text: 'Hello.' }],
      },
    ])
  })
  it('reports truncated SSE directly to a streaming consumer', async () => {
    const model = transcriptions({
      baseURL: 'https://example.com/v1/',
      fetch: async () => new Response('data: {"type":"transcript.text.delta","delta":"unfinished"}\n\n', {
        headers: { 'Content-Type': 'text/event-stream' },
      }),
      model: 'transcription-model',
    })
    const stream = await streamTranscription(model, { audio })
    await expect(Array.fromAsync(stream)).rejects.toMatchObject({ code: 'truncated-stream' })
  })
})
