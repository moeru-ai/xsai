import { openAsBlob } from 'node:fs'
import { describe, expect, it } from 'vitest'

import { generateTranscription } from '../src'

describe('@xsai/generate-transcription', () => {
  it('basic', async () => {
    const { text } = await generateTranscription({
      apiKey: 'a',
      baseURL: new URL('http://localhost:9010'),
      file: await openAsBlob('./test/fixtures/basic.wav', { type: 'audio/wav' }),
      fileName: 'basic.wav',
      language: 'en-US',
      model: 'ggml-large-v3-turbo-q5_0.bin',
    })

    expect(text).toBe('Hello, I am your AI assistant. Just let me know how I can help bring your ideas to life.')
  })
})
