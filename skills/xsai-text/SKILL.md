---
name: xsai-text
description: Generate or stream text with xsAI, call tools, request structured output, continue a conversation, read text events, or pick a wire adapter for OpenAI Responses, Chat Completions, or Anthropic Messages.
---

# xsAI text

Read the page for the task before you write code. Each URL returns Markdown.

| Task | Page |
| --- | --- |
| First request, install | https://xsai.js.org/getting-started.md |
| One reply | https://xsai.js.org/text/generating.md |
| Incremental output | https://xsai.js.org/text/streaming.md |
| Tools, the tool loop, and its hooks | https://xsai.js.org/text/tools.md |
| Structured output | https://xsai.js.org/text/structured-output.md |
| Multi-turn input, images, Parts | https://xsai.js.org/text/messages.md |
| Event types, the terminal event, event listeners | https://xsai.js.org/text/events.md |
| Adapter choice and provider options | https://xsai.js.org/text/adapters.md |
| Options, results, errors | https://xsai.js.org/text/api.md |
| Cancellation | https://xsai.js.org/text/generating.md |
| Failures | https://xsai.js.org/text/troubleshooting.md |
| Custom models, typed provider options | https://xsai.js.org/advanced/custom-models.md, https://xsai.js.org/advanced/module-augmentation.md |
| Schemas for tools without native JSON Schema support | https://xsai.js.org/xsschema.md |

Write code in this shape:

1. Create a model with an adapter factory: `responses()` from `@xsai/text-responses`, `chat()` from `@xsai/text-chat`, or `messages()` from `@xsai/text-messages`.
2. Pass the model first and the options second: `generateText(model, { input })`. Import the operations from `@xsai/text`.
3. Pick the adapter from the protocol of the endpoint. One adapter serves every provider that speaks that protocol.
4. Take `baseURL` and model IDs from the user or the project. Ask when they are unknown.
5. Parse structured output from `result.text` yourself. `generateText` returns a string.
6. Await `result` from `streamText` even when you read `stream`, because failures reject `result`.
7. Set `maxOutputTokens` for the Messages adapter. It requires the field.
8. Keep returned assistant messages unchanged when you build the next `input`.

Done when the code type-checks against the installed `@xsai/*` packages.
