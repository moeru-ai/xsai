import type { StdioServerParameters } from '@modelcontextprotocol/sdk/client/stdio.js'

import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'
import { stderr } from 'node:process'

export type CreateStdioClientsOptions = Record<string, StdioServerParameters>

/** @experimental */
export const createStdioClients = async (mcpServers: CreateStdioClientsOptions, version: string = '1.0.0'): Promise<Record<string, Client>> =>
  Object.fromEntries(
    await Promise.all(
      Object.entries(mcpServers)
        .map(async ([serverName, server]) => {
          const transport = new StdioClientTransport({ ...server, stderr })
          const client = new Client({ name: serverName, version })
          await client.connect(transport)

          return [serverName, client] as const
        }),
    ),
  )
