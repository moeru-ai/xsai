# Choose an adapter

A wire adapter translates one HTTP protocol into xsAI's shared text events.
Choose it by the protocol that your endpoint speaks, not by the provider name.
Many providers and gateways accept the same protocol, so one adapter often covers several of them.

| Protocol | Package | Factory | Request path |
| --- | --- | --- | --- |
| OpenAI Responses | `@xsai/text-responses` | `responses()` | `responses` |
| Chat Completions | `@xsai/text-chat` | `chat()` | `chat/completions` |
| Anthropic Messages | `@xsai/text-messages` | `messages()` | `messages` |

Each factory returns a `LanguageModel`.
Pass it to `generateText`, `streamText`, or `loop`.
Adapters always request a streamed response, and `generateText` collects it for you.

::: code-group

```ts [Responses]
import { responses } from '@xsai/text-responses'

const model = responses({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://api.openai.com/v1/',
  model: 'gpt-6-luna',
})
```

```ts [Chat Completions]
import { chat } from '@xsai/text-chat'

const model = chat({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://api.openai.com/v1/',
  model: 'gpt-6-luna',
})
```

```ts [Anthropic Messages]
import { messages } from '@xsai/text-messages'

const model = messages({
  apiKey: process.env.ANTHROPIC_API_KEY,
  baseURL: 'https://api.anthropic.com/v1/',
  model: 'claude-haiku-5.5',
})
```

:::

## HTTP options

All three factories take the same options.

| Option | Description |
| --- | --- |
| `baseURL` | Required. The API root as a string or `URL`, including its version prefix such as `/v1/`. The adapter appends its request path. |
| `model` | Required. The model ID that the service expects. |
| `apiKey` | Sent as a bearer token. Messages sends it as `x-api-key`. |
| `headers` | Extra request headers. |
| `fetch` | Replaces `fetch`. It receives a complete `Request` and returns a `Response`. |

Keep API keys out of client bundles.
For errors that the adapters throw, see [shared](/shared).

## Provider options

Fields that have no shared meaning go into `providerOptions`, under the namespace of the adapter.

| Namespace | Fields |
| --- | --- |
| `responses` | `frequencyPenalty`, `presencePenalty`, `parallelToolCalls`, `include`, `store`, and provider tools. |
| `chat` | `frequencyPenalty`, `presencePenalty`, `parallelToolCalls`, `seed`, `stopSequences`, `topK`. |
| `messages` | `betas`, `mcpServers`, `stopSequences`, and provider tools. |

```ts
import type { LanguageModel } from '@xsai/text'

declare const model: LanguageModel
// ---cut---
import { generateText } from '@xsai/text'

await generateText(model, {
  input: 'Say hello.',
  providerOptions: { responses: { store: true } },
})
```

Shared fields such as `maxOutputTokens` and `reasoningEffort` stay outside `providerOptions`.
Support by an adapter does not mean that every compatible endpoint accepts every field.

## Adapter differences

Responses sets `store` to `false` unless you change it.

Messages requires `maxOutputTokens` and throws `invalid-input` without it.
It sends `anthropic-version: 2023-06-01`.
`betas` is an array of strings, joined into the `anthropic-beta` header.
Each entry in `mcpServers` needs `name`, `type: 'url'`, and `url`, with an optional `authorization_token`.

Provider tools for Messages and Responses are plain objects with a string `type` and fields specific to the protocol.
They are separate from the executable tools that you create with `tool()`.
For their exact shapes, read the exported types of [`@xsai/text-responses`](https://github.com/moeru-ai/xsai/blob/main/packages/text-responses/src/index.ts) and [`@xsai/text-messages`](https://github.com/moeru-ai/xsai/blob/main/packages/text-messages/src/index.ts).

Some services return content that has no shared form.
Keep the assistant messages that `generateText` returns, and send them back unchanged in later turns.
