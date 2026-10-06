import type { Promisable } from '@xsai/shared'

export type ImageModel = (options: ImageModelOptions) => Promisable<ImageModelResult>

export interface ImageModelOptions {
  input: string
  n?: number
  providerOptions?: ImageModelProviderOptions
  signal?: AbortSignal
  size?: `${number}x${number}`
}

export interface ImageModelProviderOptions {}

export interface ImageModelResult {
  images: Blob[]
  providerMetadata?: ImageModelResultProviderMetadata
}
export interface ImageModelResultProviderMetadata {}
