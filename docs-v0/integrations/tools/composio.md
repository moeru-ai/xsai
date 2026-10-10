# Connect Composio tools {#composio}

Adapt Composio actions to v0 Tool objects.

This page describes the v0 API from `v0.5.1`.
Use v0 package builds with these examples.
Make sure that the service accepts the model ID and request protocol shown below.
Save the adapter as `utils/xsai-tool-set.ts`. Configure Composio credentials and connect the GitHub account before you request its actions.

> The original integration example is untested. Make sure that it works with your service and dependency versions before you use it.

```sh
npm i composio-core zod @xsai/shared-chat@0.5.1 @xsai/tool@0.5.1
```

```ts
type Optional<T> = null | T

const ZExecuteToolCallParams = z.object({
  actions: z.array(z.string()).optional(),
  apps: z.array(z.string()).optional(),
  connectedAccountId: z.string().optional(),
  entityId: z.string().optional(),
  filterByAvailableApps: z.boolean().optional().default(false),
  params: z.record(z.any()).optional(),
  tags: z.array(z.string()).optional(),
  useCase: z.string().optional(),
  useCaseLimit: z.number().optional(),
})

export class XSAIToolSet extends ComposioToolSet {
  fileName: string = 'js/src/frameworks/xsai.ts'

  constructor(
    config: {
      allowTracing?: boolean
      apiKey?: Optional<string>
      baseUrl?: Optional<string>
      connectedAccountIds?: Record<string, string>
      entityId?: string
    } = {},
  ) {
    super({
      allowTracing: config.allowTracing || false,
      apiKey: config.apiKey ?? null,
      baseUrl: config.baseUrl ?? null,
      connectedAccountIds: config.connectedAccountIds,
      entityId: config.entityId ?? 'default',
      runtime: null,
    })
  }

  async executeToolCall(
    tool: { arguments: unknown, name: string },
    entityId: Optional<string> = null,
  ): Promise<string> {
    const toolSchema = await this.getToolsSchema({ actions: [tool.name] })
    const appName = toolSchema[0]?.appName?.toLowerCase()
    const connectedAccountId = appName && this.connectedAccountIds?.[appName]

    return JSON.stringify(
      await this.executeAction({
        action: tool.name,
        connectedAccountId,
        entityId: entityId ?? this.entityId,
        params:
          typeof tool.arguments === 'string'
            ? JSON.parse(tool.arguments) as Record<string, unknown>
            : tool.arguments as Record<string, unknown>,
      }),
    )
  }

  async getTools(
    filters: {
      actions?: Array<string>
      apps?: Array<string>
      filterByAvailableApps?: Optional<boolean>
      integrationId?: Optional<string>
      tags?: Optional<Array<string>>
      useCase?: Optional<string>
      useCaseLimit?: Optional<number>
    },
    entityId: Optional<string> = null,
  ): Promise<Tool[]> {
    const {
      actions,
      apps,
      filterByAvailableApps,
      tags,
      useCase,
      useCaseLimit,
    } = ZExecuteToolCallParams.parse(filters)

    const actionsList = await this.getToolsSchema(
      {
        actions,
        apps,
        filterByAvailableApps,
        tags,
        useCase,
        useCaseLimit,
      },
      entityId,
      filters.integrationId,
    )

    return actionsList.map(actionSchema => this.generateTool(
      actionSchema,
      entityId,
    ))
  }

  private generateTool(
    schema: RawActionData,
    entityId: Optional<string> = null,
  ) {
    return {
      execute: async params => this.executeToolCall(
        {
          arguments: JSON.stringify(params),
          name: schema.name,
        },
        entityId ?? this.entityId,
      ),
      function: {
        description: schema.description,
        name: schema.name,
        parameters: schema.parameters,
        strict: true,
      },
      type: 'function',
    } satisfies Tool
  }
}
```

## Examples

```ts
const toolset = new XSAIToolSet()

const tools = await toolset.getTools({ apps: ['github'] })

const result = await generateText({
  apiKey: env.OPENAI_API_KEY!,
  baseURL: 'https://api.openai.com/v1/',
  messages: [{
    content: 'Star the repository "moeru-ai/xsai"',
    role: 'user',
  }],
  model: 'gpt-4o-mini',
  stopWhen: stepCountAtLeast(5),
  temperature: 0,
  toolChoice: 'required',
  tools,
})

console.log(result.steps)
console.log(result.text)
```

## Result

The archived example requests a GitHub action through the tool loop.
