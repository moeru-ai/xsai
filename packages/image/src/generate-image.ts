import type { ImageModel, ImageModelOptions, ImageModelResult } from './model'

import { XSAIError } from '@xsai/shared'

export type GenerateImageOptions = ImageModelOptions

export interface GenerateImageResult extends ImageModelResult {
  image: Blob
}

export const generateImage = async (model: ImageModel, options: GenerateImageOptions): Promise<GenerateImageResult> => {
  const result = await model(options)
  if (result.images.length === 0)
    throw new XSAIError('invalid-response', 'Image model returned no images')
  return { ...result, image: result.images[0] }
}
