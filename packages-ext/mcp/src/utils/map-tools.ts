import type { Client } from '@modelcontextprotocol/sdk/client/index.js'
import type { Tool } from '@xsai/shared-chat'

export const mapTools = async (client: Client, serverName: string): Promise<Tool[]> =>
  client
    .listTools()
    .then(({ tools }) => tools.map(({ description, inputSchema, name }) => ({
      execute: async args => client.callTool({
        arguments: args as Record<string, unknown>,
        name,
        // eslint-disable-next-line sonarjs/no-nested-functions
      }).then(res => JSON.stringify(res)),
      function: {
        description,
        name: name === serverName ? name : `${serverName}_${name}`,
        parameters: inputSchema,
        strict: true,
      },
      type: 'function',
    })))
