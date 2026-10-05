import type { HttpOptions } from '@xsai/shared'

import type { SpeechModel } from './model'

import { postJSON, XSAIError } from '@xsai/shared'

declare module '@xsai/audio' {
  interface SpeechProviderOptions {
    speech?: {
      instructions?: string
      outputFormat?: 'aac' | 'flac' | 'mp3' | 'opus' | 'wav'
      speed?: number
    }
  }
}

const formats = {
  aac: ['audio/aac'],
  flac: ['audio/flac', 'audio/x-flac'],
  mp3: ['audio/mpeg', 'audio/mp3'],
  opus: ['audio/ogg'],
  wav: ['audio/wav', 'audio/x-wav', 'audio/wave', 'audio/vnd.wave'],
}

export const speech = (options: HttpOptions): SpeechModel => async (modelOptions) => {
  const format = modelOptions.providerOptions?.speech?.outputFormat ?? 'mp3'
  const response = await postJSON(options, {
    body: {
      input: modelOptions.input,
      instructions: modelOptions.providerOptions?.speech?.instructions,
      model: options.model,
      response_format: format,
      speed: modelOptions.providerOptions?.speech?.speed,
      stream_format: 'audio',
      voice: modelOptions.voice,
    },
    path: 'audio/speech',
    signal: modelOptions.signal,
  })
  const contentType = response.headers.get('Content-Type')
  const mime = contentType?.split(';', 1)[0]?.trim().toLowerCase()
  const mediaTypes = formats[format]
  if (mime == null || mime === 'application/octet-stream') {
    const headers = new Headers(response.headers)
    headers.set('Content-Type', mediaTypes[0])
    return new Response(response.body, { headers, status: response.status, statusText: response.statusText })
  }
  if (!mediaTypes.includes(mime)) {
    const error = new XSAIError('invalid-response', `Unexpected speech Content-Type: ${contentType}`)
    await response.body.cancel(error).catch(() => {})
    throw error
  }
  return response
}
