import type { CommonRequestOptions } from '@xsai/shared'

import { requestBody, requestHeaders, requestURL, responseCatch, responseJSON } from '@xsai/shared'

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
   * The format in which generated images with `dall-e-2` and `dall-e-3` are returned from the API.
   * `gpt-image-1` only supports `b64_json`, and `url` will be ignored.
   *
   * Images will always be Base64-encoded in the result. If `url` is used, the images will be
   * fetched upon receiving the response.
   */
  responseFormat?: 'b64_json' | 'url'
  /**
   * The size of the generated images.
   * @default `1024x1024`
   */
  size?: `${number}x${number}`
}

export interface GenerateImageResponse {
  created: number
  data: {
    /**
     * The Bse64-encoded JSON of the generated image. Default value for `gpt-image-1`, and only
     * present if `response_format` is set to `b64_json` for `dall-e-2` and `dall-e-3`.
     */
    b64_json?: string
    /**
     * For `dall-e-3` only, the revised prompt that was used to generate the image.
     */
    revised_prompt?: string
    /**
     * When using `dall-e-2` or `dall-e-3`, the URL of the generated image if `response_format` is
     * set to `url` (default value). Unsupported for `gpt-image-1`.
     */
    url?: string
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

/** @internal */
const responseBlobAsDataURL = async (res: Response): Promise<string> =>
  responseCatch(res)
    .then(async (res) => {
      const blob = await res.blob()

      try {
        return await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsDataURL(blob)
        })
      }
      catch {
        throw new Error(`Failed to parse response blob, response URL: ${res.url}`)
      }
    })

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
    .then(async ({ data }) =>
      Promise.all(
        data.map(async (img, i) => {
          if (typeof img.b64_json === 'string') {
            return convertImage(img.b64_json)
          }

          if (typeof img.url === 'string') {
            return (options.fetch ?? globalThis.fetch)(new URL(img.url), {
              signal: options.abortSignal,
            })
              .then(responseBlobAsDataURL)
              .then((dataURL) => {
                const sepIndex = dataURL.indexOf(';')
                const mimeType = dataURL.substring(5, sepIndex) // `data:(...);...`
                return {
                  base64: dataURL,
                  mimeType,
                }
              })
          }

          throw new Error(`Unrecognized image at index ${i}: ${JSON.stringify(img)}`)
        }),
      ),
    )
    .then(images => ({ image: images[0], images }))
