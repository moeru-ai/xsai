import type { MessagesToolInput } from './tools'

export interface MessagesMcpServer {
  authorization_token?: string
  name: string
  type: 'url'
  url: string
}

export interface MessagesProviderOptions {
  betas?: readonly string[]
  mcpServers?: readonly MessagesMcpServer[]
  tools?: readonly MessagesToolInput[]
}

export type * from './tools'
