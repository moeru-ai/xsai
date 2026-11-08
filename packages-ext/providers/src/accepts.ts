import type { Model } from './types'

const matches = (pattern: string, mime: string) => pattern === mime
  || (pattern.endsWith('/*') && mime.startsWith(pattern.slice(0, -1)))

/** Checks whether the model accepts an input MIME type. Either side may be a wildcard such as `image/*`. */
export const accepts = (model: Model, mime: string) =>
  model.modalities.input.some(input => matches(input, mime) || matches(mime, input))
