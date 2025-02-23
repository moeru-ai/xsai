import type { DefineProvider } from '../types/provider'

import { merge } from './merge'

export const defineProvider: DefineProvider = (metadata, ...features) => ({
  ...merge(...features),
  metadata,
})
