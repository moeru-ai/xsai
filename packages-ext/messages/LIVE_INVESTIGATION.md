# Anthropic Messages Live Investigation

Date: 2026-03-15

## xsAI changes made during investigation

- Ignore trailing `data: [DONE]` sentinels in the streaming event parser.
- Stop defaulting Anthropic tool definitions to `strict: true`.
- Add a live verification script at `scripts/live.ts`.

## Live results against current gateway

Environment:

- `ANTHROPIC_BASE_URL=https://copilot.api.menci.xyz`
- `ANTHROPIC_MODEL=claude-opus-4.6-1m`

Actual API base used by the live script:

- `https://copilot.api.menci.xyz/v1/`

Results:

- `countTokens`: failed.
  - Gateway response: `{"error":{"type":"invalid_request_error","message":"Failed to count tokens: malloc is not a function"}}`
- `messages` basic stream: passed.
- `messages` thinking stream: passed.
- `messages` tool loop: passed when `tool_choice` was omitted and the prompt strongly required tool use.

Additional manual verification:

- Raw streaming output from the gateway ends with `data: [DONE]` after `event: message_stop`.
- `tool_choice: { type: 'tool', name: 'add' }` and `tool_choice: { type: 'any' }` both failed through the gateway with:
  - `Thinking may not be enabled when tool_choice forces tool use.`

## What this means for xsAI

- Ignoring `[DONE]` is required for real proxy compatibility.
- Defaulting Anthropic tools to `strict: true` is too aggressive for compatibility layers.
- The remaining `countTokens` failure is not explained by xsAI request shape.

## copilot-deno findings

### Endpoint shape

- The app only exposes `POST /v1/messages` and `POST /v1/messages/count_tokens`.
- It does not expose `/messages` or `/messages/count_tokens`.

### Native messages proxy behavior

- Native `/v1/messages` requests are forwarded through `proxySSE(...)` without filtering `[DONE]`.
- This is why xsAI must tolerate a terminal `[DONE]` line even though Anthropic-native streams do not require it.

### Request rewriting

- `web_search` tools are stripped before forwarding.
- The reserved keyword `x-anthropic-billing-header` is stripped from prompts.
- Invalid thinking blocks are removed before native forwarding.
- If the selected model advertises `adaptive_thinking`, the route overwrites the request with `payload.thinking = { type: 'adaptive' }` and also injects `output_config.effort = 'high'` when missing.

### Tool schema shape

- `copilot-deno`'s local Anthropic type for tools is:
  - `name`
  - `description?`
  - `input_schema`
- It does not include `strict` in its local Anthropic route types.

### Why `countTokens` fails on the deployed gateway

- The route tries to use `@anthropic-ai/tokenizer` for Claude models.
- It only falls back to estimation if loading the tokenizer fails.
- It does not fall back if calling the tokenizer function throws.
- The deployed error `malloc is not a function` strongly suggests the tokenizer function is being loaded but then crashing at runtime in the deployed environment.

## Suggested follow-up in copilot-deno

- Add a second fallback around `countFn(extractPayloadText(payload))` so tokenizer invocation failures downgrade to estimation instead of returning 400.
- Decide whether native `/v1/messages` should strip trailing `[DONE]` when proxying Anthropic-compatible streams.
- Decide whether forced `tool_choice` should disable adaptive thinking rather than returning an upstream validation error.
