import type { Client } from '@modelcontextprotocol/sdk/client/index.js'
import type { Tool } from '@xsai/shared-chat'

/** @internal */
const getAllToolsFromClient = async (serverName: string, client: Client): Promise<Tool[]> =>
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

/** @experimental */
export const getAllTools = async (mcpServers: Record<string, Client>): Promise<Tool[]> =>
  Promise.all(
    Object.entries(mcpServers)
      .map(async ([serverName, client]) => getAllToolsFromClient(serverName, client)),
  ).then(tools => tools.flat())
