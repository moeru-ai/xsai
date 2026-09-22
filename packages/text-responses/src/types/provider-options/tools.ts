export interface ResponsesApplyPatchTool {
  allowed_callers?: readonly ResponsesToolCaller[]
  type: 'apply_patch'
}

export type ResponsesCodeInterpreterContainer
  = | string
    | {
      file_ids?: readonly string[]
      memory_limit?: '1g' | '4g' | '16g' | '64g'
      network_policy?: ResponsesCodeInterpreterNetworkPolicy
      type: 'auto'
    }

export type ResponsesCodeInterpreterNetworkPolicy
  = | {
    allowed_domains: readonly string[]
    domain_secrets?: readonly {
      domain: string
      name: string
      value: string
    }[]
    type: 'allowlist'
  }
  | {
    type: 'disabled'
  }

export interface ResponsesCodeInterpreterTool {
  allowed_callers?: readonly ResponsesToolCaller[]
  container: ResponsesCodeInterpreterContainer
  type: 'code_interpreter'
}

export interface ResponsesComputerTool {
  type: 'computer'
}

export interface ResponsesComputerUseTool {
  display_height: number
  display_width: number
  environment: 'browser' | 'linux' | 'mac' | 'ubuntu' | 'windows' | (string & {})
  type: 'computer_use_preview'
}

export interface ResponsesCustomTool {
  allowed_callers?: readonly ResponsesToolCaller[]
  async?: boolean
  defer_loading?: boolean
  description?: string
  format?: ResponsesCustomToolFormat
  name: string
  type: 'custom'
}

export type ResponsesCustomToolFormat
  = | {
    definition: string
    syntax: 'lark' | 'regex'
    type: 'grammar'
  }
  | {
    type: 'text'
  }

export type ResponsesFileSearchFilter
  = | {
    filters: readonly ResponsesFileSearchFilter[]
    type: 'and' | 'or'
  }
  | {
    key: string
    type: 'eq' | 'gt' | 'gte' | 'in' | 'lt' | 'lte' | 'ne' | 'nin'
    value: boolean | number | readonly (number | string)[] | string
  }

export interface ResponsesFileSearchTool {
  filters?: ResponsesFileSearchFilter
  max_num_results?: number
  ranking_options?: {
    hybrid_search?: {
      embedding_weight: number
      text_weight: number
    }
    ranker?: string
    score_threshold?: number
  }
  type: 'file_search'
  vector_store_ids: readonly string[]
}

export interface ResponsesImageGenerationTool {
  action?: 'auto' | 'edit' | 'generate'
  background?: 'auto' | 'opaque' | 'transparent'
  input_fidelity?: 'high' | 'low'
  input_image_mask?: {
    file_id?: string
    image_url?: string
  }
  model?: string
  moderation?: 'auto' | 'low'
  output_compression?: number
  output_format?: 'jpeg' | 'png' | 'webp'
  partial_images?: number
  quality?: string
  size?: string
  type: 'image_generation'
}

export interface ResponsesLocalShellTool {
  type: 'local_shell'
}

export interface ResponsesMcpTool {
  allowed_callers?: readonly ResponsesToolCaller[]
  allowed_tools?: readonly string[] | ResponsesMcpToolFilter
  authorization?: string
  connector_id?: string
  defer_loading?: boolean
  headers?: Record<string, string>
  require_approval?: ResponsesMcpToolApproval
  server_description?: string
  server_label: string
  server_url?: string
  tunnel_id?: string
  type: 'mcp'
}

export type ResponsesMcpToolApproval
  = | 'always'
    | 'never'
    | {
      always?: ResponsesMcpToolFilter
      never?: ResponsesMcpToolFilter
    }

export interface ResponsesMcpToolFilter {
  read_only?: boolean
  tool_names?: readonly string[]
}

export interface ResponsesNamespaceTool {
  description: string
  name: string
  tools: readonly (ResponsesCustomTool | ResponsesProviderTool)[]
  type: 'namespace'
}

/** An explicit escape hatch for provider- or user-defined tool shapes. */
export interface ResponsesProviderTool {
  [key: string]: unknown
  type: string
}

export interface ResponsesShellTool {
  environment?: Record<string, unknown>
  type: 'shell'
}

/** Standard non-function tool declarations accepted by the Responses wire request. */
export type ResponsesTool
  = | ResponsesApplyPatchTool
    | ResponsesCodeInterpreterTool
    | ResponsesComputerTool
    | ResponsesComputerUseTool
    | ResponsesCustomTool
    | ResponsesFileSearchTool
    | ResponsesImageGenerationTool
    | ResponsesLocalShellTool
    | ResponsesMcpTool
    | ResponsesNamespaceTool
    | ResponsesShellTool
    | ResponsesToolSearchTool
    | ResponsesWebSearchPreviewTool
    | ResponsesWebSearchTool

export type ResponsesToolCaller = 'direct' | 'programmatic'

/** Standard non-function Responses tools plus an explicitly unmodeled provider/user tool. */
export type ResponsesToolInput = ResponsesProviderTool | ResponsesTool

export interface ResponsesToolSearchTool {
  description?: string
  execution?: 'client' | 'server'
  parameters?: unknown
  type: 'tool_search'
}

export interface ResponsesUserLocation {
  city?: string
  country?: string
  region?: string
  timezone?: string
  type: 'approximate'
}

export interface ResponsesWebSearchPreviewTool {
  search_content_types?: readonly ('image' | 'text')[]
  search_context_size?: 'high' | 'low' | 'medium'
  type: 'web_search_preview'
  user_location?: ResponsesUserLocation
}

export interface ResponsesWebSearchTool {
  external_web_access?: boolean
  filters?: {
    allowed_domains?: readonly string[]
    blocked_domains?: readonly string[]
  }
  return_token_budget?: 'default' | 'unlimited'
  search_context_size?: 'high' | 'low' | 'medium'
  type: 'web_search'
  user_location?: ResponsesUserLocation
}
