---
name: xsai-text
description: Generate or stream text with xsAI, select a chat, messages, or responses wire adapter, add tools or structured output, and handle text events. Use for current xsAI text tasks.
---

# xsAI text

Use the xsAI v1 API with a language model as the first argument.
A wire adapter translates a provider protocol into the shared text contract.
Choose the adapter that matches the endpoint, rather than the provider name.

For a first request, read [quick-start.md](references/quick-start.md).
For Anthropic Messages, read [messages-quick-start.md](references/messages-quick-start.md).
For OpenAI Responses, read [responses-quick-start.md](references/responses-quick-start.md).
For the `xsai` umbrella import, read [umbrella-quick-start.md](references/umbrella-quick-start.md).

For inputs, results, loop controls, or schemas, read [api.md](references/api.md).
For incremental output, read [streaming.md](references/streaming.md).
For event fields and terminal status, read [events.md](references/events.md).
For executable tools, read [tools.md](references/tools.md).
For structured output, read [structured-output.md](references/structured-output.md).
For cancellation, read [cancellation.md](references/cancellation.md).
For step overrides and tool hooks, read [loop-control.md](references/loop-control.md).
For typed event listeners, read [event-target.md](references/event-target.md).
For a custom model, read [custom-models.md](references/custom-models.md).
For adapter selection and provider configuration, read [adapters.md](references/adapters.md).
For request failures or incomplete streams, read [troubleshooting.md](references/troubleshooting.md).

Use the imports and call signatures in these references.
State required service access before a runnable example.
