---
name: xsai-text
description: Generate or stream text with xsAI. Use for tool calls, structured output, conversations, or protocol adapter selection.
---

# xsAI text

Read only the pages needed for the task. The URLs below return Markdown. Make sure that the API matches the installed xsAI version.

An adapter connects a model to an HTTP protocol.

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

Use these API rules:

- Pick the adapter by endpoint protocol: `responses()` from `@xsai/text-responses`, `chat()` from `@xsai/text-chat`, or `messages()` from `@xsai/text-messages`. Use the project's endpoint and model configuration.
- Operations take the model first: `generateText(model, { input })`. Import from `@xsai/text` or the existing `xsai` package.
- `generateText` returns a result object. Before you parse `result.text`, make sure that the output is complete and contains no refusal. Then parse the JSON and make sure that it matches the schema.
- If you consume `stream`, also handle the `result` promise from `streamText`. Failures that the provider reports reject `result`. Network errors or errors in the response data can also make the stream throw.
- Messages requires `maxOutputTokens`.
- Preserve the returned assistant messages and their metadata. After a tool loop, send each step's message and tool results in the next request.

For code changes, make sure that the installed types accept the code. Test the affected behavior with existing tests or mock responses.
