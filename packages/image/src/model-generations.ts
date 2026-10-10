import type { HttpOptions } from '@xsai/shared'

import type { ImageModel, ImageModelResult } from './model'

import { sendRequest, XSAIError } from '@xsai/shared'

declare module '@xsai/image' {
  interface ImageModelProviderOptions {
    generations?: {
      background?: 'auto' | 'opaque' | 'transparent'
      outputCompression?: number
      outputFormat?: 'jpeg' | 'png' | 'webp'
      quality?: 'auto' | 'high' | 'low' | 'max' | 'medium' | 'xhigh'
    }
  }

  interface ImageModelResultProviderMetadata {
    generations?: {
      images?: { revisedPrompt?: string }[]
    }
  }
}

interface OpenAIGenerationsResponse {
  data: { b64_json: string, revised_prompt?: null | string }[]
}

const imageBlob = (base64: string): Blob => {
  const bytes = Uint8Array.fromBase64(base64)
  const matches = (pattern: string, offset = 0) => {
    for (let index = 0; index < pattern.length; index++) {
      if (bytes[offset + index] !== pattern.charCodeAt(index))
        return false
    }
    return true
  }
  let type: string | undefined
  if (matches('\x89PNG\r\n\x1A\n')) {
    type = 'image/png'
  }
  else if (matches('\xFF\xD8\xFF')) {
    type = 'image/jpeg'
  }
  else if (matches('GIF87a') || matches('GIF89a')) {
    type = 'image/gif'
  }
  else if (matches('RIFF') && matches('WEBPVP', 8)) {
    type = 'image/webp'
  }
  else if (matches('ftyp', 4)) {
    const end = Math.min(bytes.length, new DataView(bytes.buffer).getUint32(0))
    // Inspect the major and compatible brands, skipping the minor version.
    for (let offset = 8; offset + 4 <= end; offset += 4) {
      if (offset !== 12 && (matches('avif', offset) || matches('avis', offset))) {
        type = 'image/avif'
        break
      }
    }
  }
  if (type == null)
    throw new XSAIError('invalid-response', 'Unrecognized image format')
  return new Blob([bytes], { type })
}

export const generations = (options: HttpOptions): ImageModel => async (modelOptions) => {
  const wireOptions = modelOptions.providerOptions?.generations
  const response = await sendRequest({
    body: {
      background: wireOptions?.background,
      model: options.model,
      n: modelOptions.n,
      output_compression: wireOptions?.outputCompression,
      output_format: wireOptions?.outputFormat,
      prompt: modelOptions.input,
      quality: wireOptions?.quality,
      size: modelOptions.size,
    },
    path: 'images/generations',
    signal: modelOptions.signal,
  }, options)
  const json = await response.json() as OpenAIGenerationsResponse
  const result: ImageModelResult = { images: json.data.map(image => imageBlob(image.b64_json)) }
  if (json.data.some(image => image.revised_prompt != null)) {
    result.providerMetadata = {
      generations: {
        images: json.data.map(image => image.revised_prompt == null ? {} : { revisedPrompt: image.revised_prompt }),
      },
    }
  }
  return result
}
