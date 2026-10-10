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
  tools?: readonly MessagesProviderTool[]
}

export interface MessagesProviderTool {
  [key: string]: unknown
  type: string
}
