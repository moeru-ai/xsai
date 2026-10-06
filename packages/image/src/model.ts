import type { Promisable } from '@xsai/shared'

export type ImageModel = (options: ImageModelOptions) => Promisable<ImageModelResult>

export interface ImageModelOptions {
  input: string
  n?: number
  providerOptions?: ImageProviderOptions
  signal?: AbortSignal
  size?: `${number}x${number}`
}

export interface ImageModelResult {
  images: Blob[]
  providerMetadata?: ImageProviderMetadata
}

export interface ImageProviderMetadata {}
export interface ImageProviderOptions {}
