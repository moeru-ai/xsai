import type { ResponsesToolInput } from './tools'

export interface ResponsesProviderOptions {
  tools?: readonly ResponsesToolInput[]
}

export type * from './tools'
