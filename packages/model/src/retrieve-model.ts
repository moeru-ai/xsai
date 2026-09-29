import type { HttpOptions } from '@xsai/shared'

import type { Model } from './model'

import { postJSON } from '@xsai/shared'

export interface RetrieveModelOptions extends HttpOptions {
  signal?: AbortSignal
}

export const retrieveModel = async (options: RetrieveModelOptions): Promise<Model> => {
  const response = await postJSON(options, { method: 'GET', path: `models/${options.model}`, signal: options.signal })
  return response.json() as Promise<Model>
}
