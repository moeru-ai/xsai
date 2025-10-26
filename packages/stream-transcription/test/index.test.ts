import { openAsBlob } from 'node:fs'
import { describe, expect, it } from 'vitest'

import { streamTranscription } from '../src'

describe('@xsai/stream-transcription', () => {
  const expectText = 'Hello, I am your AI assistant. Just let me know how I can help bring your ideas to life.'

  it('basic', async () => {
    const { fullText } = streamTranscription({
      apiKey: 'a',
      baseURL: 'https://api.openai.com/v1/',
      file: await openAsBlob('./test/fixtures/basic.wav', { type: 'audio/wav' }),
      fileName: 'basic.wav',
      model: 'gpt-4o-transcribe',
    })

    const text = await fullText
    expect(text).toBe(expectText)
  })
})
