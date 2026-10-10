export interface MessagesMcpServer {
  authorization_token?: string
  name: string
  type: 'url'
  url: string
}

export interface MessagesProviderOptions {
  betas?: readonly string[]
  mcpServers?: readonly MessagesMcpServer[]
  stopSequences?: readonly string[]
  /** Thinking mode and display. Effort stays in `reasoningEffort`. */
  thinking?: MessagesThinkingConfig
  tools?: readonly MessagesProviderTool[]
}

export interface MessagesProviderTool {
  [key: string]: unknown
  type: string
}

export type MessagesThinkingConfig
  = | { budget_tokens: number, display?: 'omitted' | 'summarized', type: 'enabled' }
    | { display?: 'omitted' | 'summarized', type: 'adaptive' }
    | { type: 'between_tools' | 'disabled' }
