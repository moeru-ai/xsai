import type { CommonRequestOptions } from '@xsai/shared'

export interface CommonProviderOptions extends Pick<CommonRequestOptions, 'apiKey' | 'headers'> {
  baseURL?: URL
}
