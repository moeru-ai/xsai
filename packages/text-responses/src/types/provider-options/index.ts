import type { ResponsesToolInput } from './tools'

export interface ResponsesProviderOptions {
  include?: readonly string[]
  tools?: readonly ResponsesToolInput[]
}

export type * from './tools'
