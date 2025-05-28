import { openAsBlob } from 'node:fs'
import { describe, expect, it } from 'vitest'

import { generateTranscription } from '../src'

describe('@xsai/generate-transcription', () => {
  it('segment', async () => {
    const { duration, language, segments, text } = await generateTranscription({
      apiKey: 'a',
      baseURL: new URL('http://localhost:8000/v1/'),
      file: await openAsBlob('./test/fixtures/basic.wav', { type: 'audio/wav' }),
      fileName: 'basic.wav',
      language: 'en',
      model: 'deepdml/faster-whisper-large-v3-turbo-ct2',
    })

    expect(duration).toBe(5.472)
    expect(language).toBe('en')
    expect(text).toBe('Hello, I am your AI assistant. Just let me know how I can help bring your ideas to life.')
    expect(segments).toMatchSnapshot()
  }, 30000)

  it('word', async () => {
    const { duration, language, text, words } = await generateTranscription({
      apiKey: 'a',
      baseURL: new URL('http://localhost:8000/v1/'),
      file: await openAsBlob('./test/fixtures/basic.wav', { type: 'audio/wav' }),
      fileName: 'basic.wav',
      language: 'en',
      model: 'deepdml/faster-whisper-large-v3-turbo-ct2',
      timestampGranularities: 'word',
    })

    expect(duration).toBe(5.472)
    expect(language).toBe('en')
    expect(text).toBe('Hello, I am your AI assistant. Just let me know how I can help bring your ideas to life.')
    expect(words).toMatchSnapshot()
  }, 30000)
})
