import { Buffer } from 'node:buffer'

import { describe, expect, it } from 'vitest'

import { generateSpeech } from '../src'

describe('@xsai/generate-speech', () => {
  it('basic', async () => {
    const speech = await generateSpeech({
      baseURL: new URL('http://localhost:5050'),
      input: 'Hello, I am your AI assistant! Just let me know how I can help bring your ideas to life.',
      model: 'tts-1',
      voice: 'en-US-AnaNeural',
    })

    expect(Buffer.from(speech)).toMatchSnapshot()
  })
  it('chinese', async () => {
    const speech = await generateSpeech({
      baseURL: new URL('http://localhost:5050'),
      input: '我能吞下玻璃而不伤身体。',
      model: 'tts-1',
      voice: 'zh-CN-XiaoyiNeural',
    })

    expect(Buffer.from(speech)).toMatchSnapshot()
  })
})
