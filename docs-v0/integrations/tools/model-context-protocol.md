# Connect Model Context Protocol tools {#model-context-protocol}

Adapt tools from a connected MCP client to v0 Tool objects.

This page describes the v0 API from `v0.5.1`.
Use v0 package builds with these examples.
Save the adapter as `utils/get-tools.ts`. Supply an MCP server at `server.js` for the example transport.

> The original integration example is untested. Make sure that it works with your service and dependency versions before you use it.

```sh
npm i @modelcontextprotocol/sdk @xsai/tool@0.5.1
```

```ts
export const getTools = (mcpServers: Record<string, Client>): Promise<Tool[]> =>
  Promise.all(
    Object.entries(mcpServers)
      .map(([serverName, client]) =>
        client
          .listTools()
          .then(({ tools }) =>
            tools.map(({ description, inputSchema, name }) => ({
              execute: (args: unknown) =>
                client.callTool({
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
            } satisfies Tool))
          )
      ),
  ).then(tools => tools.flat())
```

## Examples

```ts
const transport = new StdioClientTransport({ args: ['server.js'], command: 'node' })
const client = new Client({ name: 'example-client', version: '1.0.0' })

await client.connect(transport)

const tools = await getTools({ example: client })
```

## Result

The example connects a local MCP server and returns its tools.
