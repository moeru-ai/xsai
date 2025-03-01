import type { Client } from '@modelcontextprotocol/sdk/client/index.js'
import type { Tool } from '@xsai/shared-chat'

export const mapTools = async (client: Client, serverName: string): Promise<Tool[]> => {
  const result: Tool[] = []

  const { tools } = await client.listTools()

  for (const { description, inputSchema, name } of tools) {
    result.push({
      execute: async args => client.callTool({
        arguments: args as Record<string, unknown>,
        name,
      }).then(res => JSON.stringify(res)),
      function: {
        description,
        name: name === serverName ? name : `${serverName}_${name}`,
        parameters: inputSchema,
        strict: true,
      },
      type: 'function',
    })
  }

  return result
}
