import type { ResponsesToolInput } from './tools'

export interface ResponsesProviderOptions {
  include?: readonly ('message.output_text.logprobs' | 'reasoning.encrypted_content' | 'web_search_call.action.sources')[]
  tools?: readonly ResponsesToolInput[]
}

export type * from './tools'
