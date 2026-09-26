// OpenAI SDK Responses types, checked 2026-09-26. OpenResponses-generated types do not yet include web_search_call.
// https://github.com/openai/openai-node/blob/main/src/resources/responses/responses.ts
export type WebSearchAction
  = | { pattern: string, type: 'find_in_page', url: string }
    | { queries?: string[], query?: string, sources?: { type: 'url', url: string }[], type: 'search' }
    | { type: 'open_page', url?: null | string }

export interface WebSearchCall {
  action?: null | WebSearchAction
  id: string
  status: 'completed' | 'failed' | 'in_progress' | 'incomplete' | 'searching'
  type: 'web_search_call'
}
