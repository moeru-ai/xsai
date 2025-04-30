import type { CommonRequestOptions } from '@xsai/shared'

import { requestBody, requestHeaders, requestURL, responseJSON } from '@xsai/shared'

export interface GenerateImageOptions extends CommonRequestOptions {
  [key: string]: unknown
  /**
   * The number of images to generate.
   * @default `1`
   */
  n?: number
  /** A text description of the desired image(s). */
  prompt: string
  /**
   * Currently only `b64_json` is supported.
   * leave blank if you are using gpt-image-1.
   * If you use `dall-e-3` or `dall-e-2`, set to `b64_json`.
   */
  responseFormat?: 'b64_json'
  /**
   * The size of the generated images.
   * @default `1024x1024`
   */
  size?: `${number}x${number}`
}

export interface GenerateImageResponse {
  created: number
  data: {
    b64_json: string
    revised_prompt?: string
  }[]
}

export interface GenerateImageResult {
  image: GenerateImageResultImage
  images: GenerateImageResultImage[]
}

export interface GenerateImageResultImage {
  base64: string
  mimeType: string
}

/** @internal */
const mimeTypes = {
  '/9j/': 'image/jpg',
  'AAAAIGZ0eXBhdmlm': 'image/avif',
  'iVBORw0KGgo': 'image/png',
  'R0lGOD': 'image/gif',
  'UklGRg==': 'image/webp',
}

/** @internal */
const convertImage = (b64_json: string) => {
  const key = Object.keys(mimeTypes).find(prefix => b64_json.startsWith(prefix)) as keyof typeof mimeTypes | undefined
  const mimeType = mimeTypes[key ?? 'iVBORw0KGgo']

  return {
    // eslint-disable-next-line @masknet/string-no-data-url
    base64: `data:${mimeType};base64,${b64_json}`,
    mimeType,
  }
}

/** @experimental */
export const generateImage = async (options: GenerateImageOptions): Promise<GenerateImageResult> =>
  (options.fetch ?? globalThis.fetch)(requestURL('images/generations', options.baseURL), {
    body: requestBody(options),
    headers: requestHeaders({
      'Content-Type': 'application/json',
      ...options.headers,
    }, options.apiKey),
    method: 'POST',
    signal: options.abortSignal,
  })
    .then(responseJSON<GenerateImageResponse>)
    .then(({ data }) => {
      const images: GenerateImageResultImage[] = data.map(({ b64_json }) => convertImage(b64_json))

      return { image: images[0], images }
    })
