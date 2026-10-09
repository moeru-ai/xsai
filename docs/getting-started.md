# Getting started

xsAI is a set of small TypeScript packages for AI services.
Each package does one job: text, audio, decisions, images, embeddings, or model lists.
You create a model once, then pass it to an operation such as `generateText`.

The packages run on any runtime that provides `fetch` and web streams.
A model belongs to a protocol, not to a provider.
Pick the tab for the protocol that your service speaks.
[Choose an adapter](/text/adapters) lists the options for each one.

## Generate text

::: code-group

```sh [Chat]
pnpm add @xsai/text @xsai/text-chat
```

```sh [Responses]
pnpm add @xsai/text @xsai/text-responses
```

```sh [Messages]
pnpm add @xsai/text @xsai/text-messages
```

:::

::: code-group

```ts [Chat]
import { generateText } from '@xsai/text'
import { chat } from '@xsai/text-chat'

const model = chat({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://api.openai.com/v1/',
  model: 'gpt-6-luna',
})

const { text } = await generateText(model, { input: 'Say hello.' })
console.log(text)
```

```ts [Responses]
import { generateText } from '@xsai/text'
import { responses } from '@xsai/text-responses'

const model = responses({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://api.openai.com/v1/',
  model: 'gpt-6-luna',
})

const { text } = await generateText(model, { input: 'Say hello.' })
console.log(text)
```

```ts [Messages]
import { generateText } from '@xsai/text'
import { messages } from '@xsai/text-messages'

const model = messages({
  apiKey: process.env.ANTHROPIC_API_KEY,
  baseURL: 'https://api.anthropic.com/v1/',
  model: 'claude-haiku-5.5',
})

const { text } = await generateText(model, {
  input: 'Say hello.',
  maxOutputTokens: 128,
})
console.log(text)
```

:::

The Chat and Responses examples read an OpenAI API key from `OPENAI_API_KEY`.
The Messages example reads an Anthropic API key from `ANTHROPIC_API_KEY`.
Each example works with any service that implements the same protocol.

`chat()`, `responses()`, and `messages()` create a language model that speaks one protocol.
`generateText` sends one request, waits for the complete reply, and returns a result.
Every xsAI operation has the same shape: the model comes first, and the request options come second.

## Next steps

- [Stream text](/text/streaming) to show output while it arrives.
- [Call tools](/text/tools) to let the model run your functions.
- [Choose packages](/packages) to install only what you use.
