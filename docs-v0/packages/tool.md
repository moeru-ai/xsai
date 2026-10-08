# Define tools {#tool-calling}

A tool connects a model request to application code.

This page describes the v0 API from `v0.5.1`.
Use v0 package builds with these examples.
Make sure that the service accepts the model ID and request protocol shown below.
Install `valibot` and `@valibot/to-json-schema` for the schema examples.

```sh
npm i @xsai/tool@0.5.1
```

## Examples

### defineTool

Use this when your schema library already supports [Standard JSON Schema](https://standardschema.dev/json-schema).

`defineTool()` is synchronous. Use it when the schema provides JSON Schema directly.

```ts
const weatherSchema = z.object({
  location: z.string().describe('The location to get the weather for'),
}).describe('Get the weather in a location')

const weather = defineTool({
  description: 'Get the weather in a location',
  execute: ({ location }) => JSON.stringify({
    location,
    temperature: 42,
  }),
  name: 'weather',
  parameters: weatherSchema,
})
```

### tool

`tool()` accepts `StandardSchemaV1` and infers its types.

`tool()` converts the schema to JSON Schema asynchronously. Use it when the schema library does not provide `StandardJSONSchemaV1`.

These examples use `valibot`.

This package uses `xsschema` to convert schemas. Use a schema library from its supported vendor list.

See [xsschema](/packages-top/xsschema) for more information.

Install the schema converter that your schema version requires before you run these examples.

Read the [schema coverage reference](/packages-top/xsschema#coverage).

```ts
const weather = await tool({
  description: 'Get the weather in a location',
  execute: ({ location }) => JSON.stringify({
    location,
    temperature: 42,
  }),
  name: 'weather',
  parameters: v.object({
    location: v.pipe(
      v.string(),
      v.description('The location to get the weather for'),
    ),
  }),
})

const { text } = await generateText({
  apiKey: env.OPENAI_API_KEY!,
  baseURL: 'https://api.openai.com/v1/',
  messages: [
    {
      content: 'You are a helpful assistant.',
      role: 'system',
    },
    {
      content: 'What is the weather in San Francisco?',
      role: 'user',
    },
  ],
  model: 'gpt-4o',
  stopWhen: stepCountAtLeast(2), // [!code highlight]
  tools: [weather], // [!code highlight]
})
```

### rawTool

`rawTool()` accepts `JsonSchema`. Declare the type of the execution input yourself.

```ts
const weather = rawTool<{ location: string }>({
  description: 'Get the weather in a location',
  execute: ({ location }) => JSON.stringify({
    location,
    temperature: 42,
  }),
  name: 'weather',
  parameters: {
    additionalProperties: false,
    properties: {
      location: {
        description: 'The location to get the weather for',
        type: 'string',
      },
    },
    required: [
      'location',
    ],
    type: 'object',
  },
})

const { text } = await generateText({
  apiKey: env.OPENAI_API_KEY!,
  baseURL: 'https://api.openai.com/v1/',
  messages: [
    {
      content: 'You are a helpful assistant.',
      role: 'system',
    },
    {
      content: 'What is the weather in San Francisco?',
      role: 'user',
    },
  ],
  model: 'gpt-4o',
  stopWhen: stepCountAtLeast(2), // [!code highlight]
  tools: [weather], // [!code highlight]
})
```

To create a tool synchronously, pass JSON Schema directly:

```ts
const weatherSchema = z.object({
  location: z
    .string()
    .describe('The location to get the weather for'),
})

const weather = rawTool<z.input<typeof weatherSchema>>({
  description: 'Get the weather in a location',
  execute: ({ location }) => JSON.stringify({
    location,
    temperature: 42,
  }),
  name: 'weather',
  parameters: z.toJSONSchema(weatherSchema) as unknown as RawToolOptions['parameters'],
})
```

### Tool

Pass a Tool object directly when you do not need a factory.

```ts
const weather = {
  execute: (({ location }) => JSON.stringify({
    location,
    temperature: 42,
  })) as Tool['execute'], // [!code highlight]
  function: {
    description: 'Get the weather in a location',
    name: 'weather',
    parameters: {
      additionalProperties: false,
      properties: {
        location: {
          description: 'The location to get the weather for',
          type: 'string',
        },
      },
      required: [
        'location',
      ],
      type: 'object',
    },
    strict: true,
  },
  type: 'function',
} satisfies Tool // [!code highlight]

const { text } = await generateText({
  apiKey: env.OPENAI_API_KEY!,
  baseURL: 'https://api.openai.com/v1/',
  messages: [
    {
      content: 'You are a helpful assistant.',
      role: 'system',
    },
    {
      content: 'What is the weather in San Francisco?',
      role: 'user',
    },
  ],
  model: 'gpt-4o',
  stopWhen: stepCountAtLeast(2), // [!code highlight]
  tools: [weather], // [!code highlight]
})
```

Zod example:

```ts
const weatherSchema = z.object({
  location: z
    .string()
    .describe('The location to get the weather for'),
})

const weather = {
  execute: input => JSON.stringify({
    location: (input as z.input<typeof weatherSchema>).location,
    temperature: 42,
  }),
  function: {
    description: 'Get the weather in a location',
    name: 'weather',
    parameters: z.toJSONSchema(weatherSchema) as unknown as Record<string, unknown>, // [!code highlight]
  },
  type: 'function',
} satisfies Tool // [!code highlight]
```

### overrides

`await tool()` and `rawTool()` return a `Tool` object. Replace its fields to customize the tool.

```ts
const parameters = v.object({
  location: v.pipe(
    v.string(),
    v.description('The location to get the weather for'),
  ),
})

const weather = await tool({
  description: 'Get the weather in a location',
  execute: ({ location }) => JSON.stringify({
    location,
    temperature: 42,
  }),
  name: 'weather',
  parameters,
})

weather.execute = input => JSON.stringify({
  location: (input as v.InferInput<typeof parameters>).location,
  temperature: 5500,
})
```

## Result

Pass the returned Tool objects to a text operation. The model can request their execution.
