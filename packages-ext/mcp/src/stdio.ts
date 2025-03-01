import type { StdioServerParameters } from '@modelcontextprotocol/sdk/client/stdio.js'
import type { Tool } from '@xsai/shared-chat'

import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'
import { stderr } from 'node:process'

import { mapTools } from './utils/map-tools'

export interface GetStdioServerToolsOptions {
  mcpServers: Record<string, StdioServerParameters>
}

export const getStdioServerTools = async ({ mcpServers }: GetStdioServerToolsOptions): Promise<Tool[]> => {
  const result: Tool[] = []

  /** @see {@link https://github.com/vercel/ai/issues/3891#issuecomment-2561348224} */
  for (const [serverName, server] of Object.entries(mcpServers)) {
    const transport = new StdioClientTransport({ ...server, stderr })
    const client = new Client({ name: serverName, version: '1.0.0' })
    await client.connect(transport)

    result.push(...await mapTools(client, serverName))
  }

  return result
}
