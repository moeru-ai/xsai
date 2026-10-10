# Use the Responses API {#responses}

Use the experimental v0 Responses extension.

This page describes the v0 API from `v0.5.1`.
Use v0 package builds with these examples.
Make sure that the service accepts the model ID and request protocol shown below.

```sh
npm i @xsai-ext/responses@0.5.1
```

This extension targets the [Open Responses](https://openresponses.org/) protocol.

This historical extension is experimental. Minor version updates can change its API.

## Usage

Use this package when you explicitly need Responses API semantics instead of Chat Completions.

### Basic

```ts
const { reasoningTextStream, steps, textStream, totalUsage } = responses({
  apiKey: env.OPENAI_API_KEY!,
  baseURL: 'https://api.openai.com/v1/',
  input: 'Why is the sky blue?',
  instructions: 'You are a helpful assistant.',
  model: 'gpt-5.5',
  reasoning: { effort: 'low' },
})

let text = ''
for await (const chunk of textStream) {
  text += chunk
}

let reasoningText = ''
for await (const chunk of reasoningTextStream) {
  reasoningText += chunk
}

console.log(text)
console.log(reasoningText)
console.log(await steps)
console.log(await totalUsage)
```

### Input

```ts
const { textStream } = responses({
  apiKey: env.OPENAI_API_KEY!,
  baseURL: 'https://api.openai.com/v1/',
  input: [
    {
      content: [{
        text: 'Answer briefly and mention only what is clearly visible.',
        type: 'input_text',
      }],
      role: 'developer',
      type: 'message',
    },
    {
      content: [
        {
          text: 'What is in this image?',
          type: 'input_text',
        },
        {
          image_url: 'https://upload.wikimedia.org/wikipedia/commons/3/3f/Fronalpstock_big.jpg',
          type: 'input_image',
        },
      ],
      role: 'user',
      type: 'message',
    },
  ],
  model: 'gpt-5.5',
})

let text = ''
for await (const chunk of textStream) {
  text += chunk
}

console.log(text)
```

### Tool calling

`@xsai-ext/responses` can automatically execute tools and feed the tool results back into the next Responses step.

```ts
const add = await tool({
  description: 'Adds two numbers',
  execute: ({ a, b }) => (Number.parseInt(a) + Number.parseInt(b)).toString(),
  name: 'add',
  parameters: z.object({
    a: z.string().describe('First number'),
    b: z.string().describe('Second number'),
  }),
})

const { steps, textStream } = responses({
  apiKey: env.OPENAI_API_KEY!,
  baseURL: 'https://api.openai.com/v1/',
  input: 'What is 12 + 30? Use the add tool.',
  instructions: 'You are a helpful assistant.',
  model: 'gpt-5.5',
  stopWhen: stepCountAtLeast(2), // [!code highlight]
  toolChoice: 'required', // [!code highlight]
  tools: [add], // [!code highlight]
})

let text = ''
for await (const chunk of textStream) {
  text += chunk
}

console.log(text)
console.log(await steps)
```

### Event streams

This package exposes two event layers:

- `fullStream`: raw Responses API streaming events
- `eventStream`: normalized xsAI events such as `text.delta`, `reasoning.delta`, `tool-call.start`, and `step.done`

Use `fullStream` for the original Responses protocol events. Use `eventStream` for shared xsAI events.

```ts
const { eventStream, fullStream } = responses({
  apiKey: env.OPENAI_API_KEY!,
  baseURL: 'https://api.openai.com/v1/',
  input: 'Give me a one sentence answer.',
  model: 'gpt-5.5',
})

for await (const event of eventStream) {
  console.log(event.type)
}

for await (const event of fullStream) {
  console.log(event.type)
}
```

## Return value

`responses()` returns:

- `textStream`: streamed assistant text deltas
- `reasoningTextStream`: streamed reasoning deltas when the model emits them
- `eventStream`: normalized xsAI events
- `fullStream`: raw Responses API events
- `input`: normalized Responses input items
- `steps`: completed step list with text, tool calls, tool results, finish reason, and usage
- `usage`: usage for the latest completed step
- `totalUsage`: accumulated usage across all steps

## Notes

- This package only supports streaming mode. Do not pass `stream`.
- `input` accepts either a plain string or Responses API item arrays.
- `tools` uses the same `Tool` shape as the rest of xsAI.
- `stopWhen` and related helpers such as `stepCountAtLeast`, `and`, `or`, `not`, and `hasToolCall` are re-exported from this package.

## Result

The examples expose assistant text, protocol events, tool results, and usage.
