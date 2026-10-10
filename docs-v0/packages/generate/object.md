# Generate structured data {#structured-data}

Send a prompt and a schema to collect a complete object or array.

This page describes the v0 API from `v0.5.1`.
Use v0 package builds with these examples.
Make sure that the service accepts the model ID and request protocol shown below.
Install `valibot` and `@valibot/to-json-schema` for the schema examples.

These examples use `valibot`.

This package uses `xsschema` to convert schemas. Use a schema library from its supported vendor list.

See [xsschema](/packages-top/xsschema) for more information.

```sh
npm i @xsai/generate-object@0.5.1
```

## Examples

Install the schema converter that your schema version requires before you run these examples.

Read the [schema coverage reference](/packages-top/xsschema#coverage).

### Object

```ts
const { object } = await generateObject({
  apiKey: env.OPENAI_API_KEY!,
  baseURL: 'https://api.openai.com/v1/',
  messages: [
    {
      content: 'Extract the event information.',
      role: 'system'
    },
    {
      content: 'Alice and Bob are going to a science fair on Friday.',
      role: 'user'
    }
  ],
  model: 'gpt-4o',
  schema: v.object({
    date: v.string(),
    name: v.string(),
    participants: v.array(v.string()),
  })
})
```

### Array

```ts
const { object: objects } = await generateObject({
  apiKey: env.OPENAI_API_KEY!,
  baseURL: 'https://api.openai.com/v1/',
  messages: [
    {
      content: 'Generate 3 hero descriptions for a fantasy role playing game.',
      role: 'user'
    }
  ],
  model: 'gpt-4o',
  output: 'array', // [!code highlight]
  schema: v.object({
    class: v.pipe(
      v.string(),
      v.description('Character class, e.g. warrior, mage, or thief.'),
    ),
    description: v.string(),
    name: v.string(),
  })
})

for (const object of objects) { // [!code highlight]
  console.log(object)
}
```

## Result

The examples return structured values that match the declared schemas.
