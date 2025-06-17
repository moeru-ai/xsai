import {
  createChatProvider,
  createMetadataProvider,
  createSpeechProvider,
  merge,
} from '@xsai-ext/shared-providers'
import { Buffer } from 'node:buffer'

export const createPlayer2 = (baseURL = 'http://localhost:4315/v1/') => merge(createMetadataProvider('player2'), createChatProvider({ baseURL }), createSpeechProvider({
  baseURL,
  fetch: async (input: Parameters<typeof globalThis.fetch>[0], reqInit: Parameters<typeof globalThis.fetch>[1]) => {
    const newUrl = `${input.toString().slice(0, -'audio/speech'.length)}tts/speak`
    try {
      const { input, response_format, speed, voice, ...rest } = JSON.parse(reqInit?.body as string) as {
        input?: string
        response_format?: 'aac' | 'flac' | 'mp3' | 'opus' | 'pcm' | 'wav'
        rest: object
        speed?: number
        voice?: string
      }
      const modified = {
        audio_format: response_format,
        play_in_app: false,
        speed: speed ?? 1.0,
        text: input,
        voice_ids: voice != null
          ? [voice]
          : [],
        ...rest,
      }
      if (reqInit)
        reqInit.body = JSON.stringify(modified)
    }
    catch (err) {
      console.warn('Could not parse body as JSON:', err)
    }
    return globalThis.fetch(newUrl, reqInit).then(async res => res.json() as Promise<{ data?: string }>).then((json: { data?: string }) => {
      const base64 = json.data ?? ''
      const binary = Buffer.from(base64, 'base64').toString('binary') // base64 to binary string

      const bytes = Uint8Array.from(
        Array.from(binary, char => char.charCodeAt(0)),
      )
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i)
      }

      return new Response(bytes.buffer, {
        headers: {
          'Content-Type': 'audio/mpeg', // adjust if needed
        },
        status: 200,
      })
    })
  },
}))
