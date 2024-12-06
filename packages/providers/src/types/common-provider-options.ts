import type { CommonRequestOptions } from '@xsai/shared'

export interface CommonProviderOptions extends Omit<CommonRequestOptions, 'model'> {}
