import {
  createChatProvider,
  createSpeechProvider,
  merge,
} from '@xsai-ext/shared-providers'

declare global {
  interface Uint8ArrayConstructor {
    // Baseline 2025
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array/fromBase64
    fromBase64: (base64: string) => Uint8Array
  }
}

/**
 * Create a Player2 Provider
 * @see {@link https://player2.game}
 */
export const createPlayer2 = (baseURL = 'http://localhost:4315/v1/', gameKey = 'xsai') => merge(
  createChatProvider({ baseURL, headers: { 'player2-game-key': gameKey } }),
  createSpeechProvider({
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
        if (reqInit) {
          reqInit.body = JSON.stringify(modified)
        }
      }
      catch (err) {
        console.warn('Could not parse body as JSON:', err)
      }
      return globalThis.fetch(newUrl, reqInit).then(async res => res.json() as Promise<{ data?: string }>).then((json: { data?: string }) => {
        const base64 = json.data ?? ''
        const bytes = Uint8Array.fromBase64(base64)
        const body = new ReadableStream({
          start: (controller) => {
            controller.enqueue(bytes)
            controller.close()
          },
        })

        return new Response(body, {
          headers: {
            'Content-Type': 'audio/mpeg', // adjust if needed
          },
          status: 200,
        })
      })
    },
    headers: { 'player2-game-key': gameKey },
  }),
)
