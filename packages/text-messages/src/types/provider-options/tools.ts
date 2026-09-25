export interface MessagesAdvisorTool extends MessagesServerToolOptions {
  max_tokens?: number
  max_uses?: number
  model: string
  name: 'advisor'
  type: 'advisor_20260301'
}

export interface MessagesCodeExecutionTool extends MessagesServerToolOptions {
  name: 'code_execution'
  type: 'code_execution_20260521' | (string & {})
}

export interface MessagesMcpToolset {
  cache_control?: { ttl?: '1h' | '5m', type: 'ephemeral' }
  configs?: Record<string, { defer_loading?: boolean, enabled?: boolean }>
  default_config?: { defer_loading?: boolean, enabled?: boolean }
  mcp_server_name: string
  type: 'mcp_toolset'
}

export interface MessagesProviderTool {
  [key: string]: unknown
  type: string
}

export interface MessagesServerToolOptions {
  allowed_callers?: readonly MessagesToolCaller[]
  cache_control?: { ttl?: '1h' | '5m', type: 'ephemeral' }
  defer_loading?: boolean
  strict?: boolean
}

export type MessagesTool
  = | MessagesAdvisorTool
    | MessagesCodeExecutionTool
    | MessagesMcpToolset
    | MessagesToolSearchTool
    | MessagesWebFetchTool
    | MessagesWebSearchTool

export type MessagesToolCaller
  = | 'code_execution_20260521'
    | 'direct'
    | (string & {})

export type MessagesToolInput = MessagesProviderTool | MessagesTool

export interface MessagesToolSearchTool extends MessagesServerToolOptions {
  name: 'tool_search_tool_bm25' | 'tool_search_tool_regex'
  type: 'tool_search_tool_bm25_20251119' | 'tool_search_tool_regex_20251119' | (string & {})
}

export interface MessagesUserLocation {
  city?: string
  country?: string
  region?: string
  timezone?: string
  type: 'approximate'
}

export interface MessagesWebFetchTool extends MessagesServerToolOptions {
  allowed_domains?: readonly string[]
  blocked_domains?: readonly string[]
  citations?: { enabled: boolean }
  max_content_tokens?: number
  max_uses?: number
  name: 'web_fetch'
  type: 'web_fetch_20260318' | (string & {})
}

export interface MessagesWebSearchTool extends MessagesServerToolOptions {
  allowed_domains?: readonly string[]
  blocked_domains?: readonly string[]
  max_uses?: number
  name: 'web_search'
  type: 'web_search_20260318' | (string & {})
  user_location?: MessagesUserLocation
}
