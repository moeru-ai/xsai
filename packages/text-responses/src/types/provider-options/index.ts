import type { IncludeEnum } from '../../generated'
import type { ResponsesToolInput } from './tools'

export interface ResponsesProviderOptions {
  include?: readonly ('web_search_call.action.sources' | 'web_search_call.results' | IncludeEnum)[]
  tools?: readonly ResponsesToolInput[]
}

export type * from './tools'
