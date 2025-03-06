import type { SSEClientTransportOptions } from '@modelcontextprotocol/sdk/client/sse.js'
import type { Tool } from '@xsai/shared-chat'

import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js'

import { mapTools } from './utils/map-tools'

export type GetSSEServerToolsOptions = Record<string, SSEClientTransportOptions & {
  url: URL
}>

/** @experimental */
export const getSSEServerTools = async (mcpServers: GetSSEServerToolsOptions): Promise<Tool[]> => {
  const result: Tool[] = []

  for (const [serverName, { url, ...options }] of Object.entries(mcpServers)) {
    const transport = new SSEClientTransport(url, options)
    const client = new Client({ name: serverName, version: '1.0.0' })
    await client.connect(transport)

    result.push(...await mapTools(client, serverName))
  }

  return result
}
