# xsAI

Glossary for the text-generation packages (`@xsai/text-*`): normalized streaming over the three dominant LLM wire protocols.

## Language

**Wire adapter**:
A package that adapts one provider *wire protocol* — `text-chat` (Chat Completions), `text-messages` (Anthropic Messages), `text-responses` (OpenAI Responses). One wire can serve many providers and gateways; the adapter owns only wire-shaped concerns.
_Avoid_: provider, API client

**Language model**:
The `LanguageModel` function every wire adapter satisfies: `(options) => Promise<ReadableStream<Event>>`. Its required `LanguageModelOptions` object carries input, instructions, tools, and wire options. The universal seam callers program against.
_Avoid_: model instance, provider object

**Part**:
One entry of an assistant message's `content` array (`text`, `reasoning`, `refusal`, `tool-call`). Events address parts by `index`, their position in the finished message.
_Avoid_: block, chunk, content item

**Event**:
The normalized stream vocabulary: `content.start`, `text.delta`, `reasoning.delta`, `refusal.delta`, `tool-call.delta`, `content.end`, `finish`. Wire adapters translate their frames into it.
_Avoid_: chunk, SSE event

**Event builder**:
The internal `eventBuilder` in `text-primitives` that owns part bookkeeping — index assignment, delta accumulation, tool-call identity fallback — and the termination invariant. Adapters feed it part-level facts; wire semantics (finish-reason mapping, usage shape) stay in the adapter.

**Terminal event**:
A wire that delivers a terminal signal ends with exactly one `finish` event, emitted when the stream closes; an `error` finish carries the terminating error on its `error` field. A wire stream that ends without a terminal signal is truncated — the stream rejects instead of finishing.
_Avoid_: end-of-stream sentinel

**Collect**:
The consumer-side helper `collect(model, options)` that resolves the `finish` payload and rejects on `reason: 'error'` or a stream rejection. In-progress rendering consumes the `Event` stream directly.
_Avoid_: complete, runSync

## Conventions

- Mechanics are shared, semantics are wire-native: index bookkeeping and termination live in the event builder; finish reasons, usage fields, and error payloads keep their wire's shape.
- `tool-call.delta` identifies its part by `index`; its `id` is always the tool **call id**, never a provider item id.
- `finish` separates two identities: `message.id` is the replayable assistant message id; `responseId` is the response-scoped generation id (e.g. `chatcmpl-*`, `resp_*`). A wire may carry both, either, or neither.
- `reason` is normalized; `responseStatus` is the wire's reported response status verbatim (e.g. Responses `completed`/`incomplete`/`failed`/`cancelled`) — never collapse an unmodelled status into `stop`.
- A refusal is its own part (`refusal` + `refusal.delta`), never folded into `text`; a wire whose refusal is only a stop condition (Anthropic `stop_reason`) maps it to `reason: 'refusal'` instead.
- `format` is the structured-output request schema (raw JSON Schema or `StandardJSONSchemaV1`), always sent strict; `resolveSchema` (shared with `tool()`) resolves and stricts it in place once per call and each adapter maps the strict schema to its format field (`response_format` / `text.format` / `output_config.format`).
