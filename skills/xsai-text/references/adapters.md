# Choose a text wire adapter

A wire adapter translates one HTTP protocol into the shared text contract.
Select it from the endpoint protocol.
A compatible provider can use the same adapter as another provider.

| Protocol | Package | Factory | Request path |
| --- | --- | --- | --- |
| Chat Completions | `@xsai/text-chat` | `chat(httpOptions)` | `chat/completions` |
| Anthropic Messages | `@xsai/text-messages` | `messages(httpOptions)` | `messages` |
| OpenAI Responses | `@xsai/text-responses` | `responses(httpOptions)` | `responses` |

Each factory returns a `LanguageModel`.
Pass that model to `generateText`, `streamText`, or `loop`.
The adapters request streaming responses from their endpoints.
`generateText` collects the stream for you.

## HTTP configuration

`baseURL` and `model` are required.
`baseURL` is a string or URL for the API root.
The adapter appends its request path to that root.
`model` is the provider model ID.
`apiKey` is optional and supplies authentication when present.
`headers` adds request headers.
`fetch` replaces the HTTP function with `(request: Request) => Promise<Response>`.

For a server with an API root at `https://example.com/v1/`, use that full root as `baseURL`.
Do not include `chat/completions` in the root.
Store credentials outside client bundles.
For shared HTTP errors, read the [shared API reference](https://xsai.js.org/shared/api).

## Provider configuration

Use `providerOptions` for fields that have no shared model meaning.
Each adapter owns a namespace:

| Namespace | Fields |
| --- | --- |
| `chat` | `frequencyPenalty`, `presencePenalty`, `parallelToolCalls`, `seed`, `stopSequences`, `topK`. |
| `messages` | `betas`, `mcpServers`, `stopSequences`, and provider `tools`. |
| `responses` | `frequencyPenalty`, `presencePenalty`, `parallelToolCalls`, `include`, `store`, and provider tools. |

Messages requires `maxOutputTokens` and throws `invalid-input` when it is absent.
It sends `anthropic-version: 2023-06-01` and uses `x-api-key` authentication.
`betas` is an array of strings joined into the `anthropic-beta` header.
Each MCP server requires `name`, `type: 'url'`, and `url`, with optional `authorization_token`.
Messages and Responses provider tools have a required string `type` and protocol-specific fields.
Provider tool arrays are separate from the shared executable tool declarations.
Responses defaults `store` to `false`.
Shared fields such as `maxOutputTokens` and `reasoningEffort` stay outside `providerOptions`.
Adapter support does not establish that every compatible endpoint accepts every field.
For opaque provider content, preserve returned messages and their metadata between turns.

Read the exported adapter contracts for the exact provider tool and metadata shapes:

- [Chat contract](https://github.com/moeru-ai/xsai/blob/main/packages/text-chat/src/index.ts).
- [Messages contract](https://github.com/moeru-ai/xsai/blob/main/packages/text-messages/src/index.ts).
- [Responses contract](https://github.com/moeru-ai/xsai/blob/main/packages/text-responses/src/index.ts).
