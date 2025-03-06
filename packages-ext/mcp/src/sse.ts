import type { SSEClientTransportOptions } from '@modelcontextprotocol/sdk/client/sse.js'

import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js'

export type CreateSSEClientsOptions = Record<string, SSEClientTransportOptions & {
  url: URL
}>

/** @experimental */
export const createSSEClients = async (mcpServers: CreateSSEClientsOptions, version: string = '1.0.0'): Promise<Record<string, Client>> =>
  Object.fromEntries(
    await Promise.all(
      Object.entries(mcpServers)
        .map(async ([serverName, { url, ...options }]) => {
          const transport = new SSEClientTransport(url, options)
          const client = new Client({ name: serverName, version })
          await client.connect(transport)

          return [serverName, client] as const
        }),
    ),
  )
