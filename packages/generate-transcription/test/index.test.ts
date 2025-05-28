import { openAsBlob } from 'node:fs'
import { describe, expect, it } from 'vitest'

import { generateTranscription } from '../src'

describe('@xsai/generate-transcription', () => {
  it('json', async () => {
    const { text } = await generateTranscription({
      apiKey: 'a',
      baseURL: new URL('http://localhost:8000/v1/'),
      file: await openAsBlob('./test/fixtures/basic.wav', { type: 'audio/wav' }),
      fileName: 'basic.wav',
      language: 'en',
      model: 'deepdml/faster-whisper-large-v3-turbo-ct2',
    })

    expect(text).toBe('Hello, I am your AI assistant. Just let me know how I can help bring your ideas to life.')
  })

  it('verbose_json + segment', async () => {
    const { duration, language, segments, text } = await generateTranscription({
      apiKey: 'a',
      baseURL: new URL('http://localhost:8000/v1/'),
      file: await openAsBlob('./test/fixtures/basic.wav', { type: 'audio/wav' }),
      fileName: 'basic.wav',
      language: 'en',
      model: 'deepdml/faster-whisper-large-v3-turbo-ct2',
      responseFormat: 'verbose_json',
    })

    expect(duration).toBe(5.472)
    expect(language).toBe('en')
    expect(text).toBe('Hello, I am your AI assistant. Just let me know how I can help bring your ideas to life.')
    expect(segments).toMatchSnapshot()
  }, 30000)

  it('verbose_json + word', async () => {
    const { duration, language, text, words } = await generateTranscription({
      apiKey: 'a',
      baseURL: new URL('http://localhost:8000/v1/'),
      file: await openAsBlob('./test/fixtures/basic.wav', { type: 'audio/wav' }),
      fileName: 'basic.wav',
      language: 'en',
      model: 'deepdml/faster-whisper-large-v3-turbo-ct2',
      responseFormat: 'verbose_json',
      timestampGranularities: 'word',
    })

    expect(duration).toBe(5.472)
    expect(language).toBe('en')
    expect(text).toBe('Hello, I am your AI assistant. Just let me know how I can help bring your ideas to life.')
    expect(words).toMatchSnapshot()
  }, 30000)
})
