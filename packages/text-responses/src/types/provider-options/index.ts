import type { IncludeEnum } from '../../generated'
import type { ResponsesToolInput } from './tools'

export interface ResponsesProviderOptions {
  include?: readonly (IncludeEnum | (string & {}))[]
  tools?: readonly ResponsesToolInput[]
}

export type * from './tools'
