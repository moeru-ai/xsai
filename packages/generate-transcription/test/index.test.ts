import { openAsBlob } from 'node:fs'
import { describe, expect, it } from 'vitest'

import { generateTranscription } from '../src'

describe('@xsai/generate-transcription', () => {
  it('basic', async () => {
    const { text } = await generateTranscription({
      apiKey: 'a',
      baseURL: new URL('http://localhost:8000/v1/'),
      file: await openAsBlob('./test/fixtures/basic.wav', { type: 'audio/wav' }),
      fileName: 'basic.wav',
      // language: 'en-US',
      language: 'en',
      model: 'deepdml/faster-whisper-large-v3-turbo-ct2',
    })

    expect(text).toBe('Hello, I am your AI assistant. Just let me know how I can help bring your ideas to life.')
  }, 30000)
})
