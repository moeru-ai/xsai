# xsAI

Glossary for the text-generation packages (`@xsai/text-*`): normalized streaming over the three dominant LLM wire protocols.

## Language

**Wire adapter**:
A package that adapts one provider *wire protocol* — `text-chat` (Chat Completions), `text-messages` (Anthropic Messages), `text-responses` (OpenAI Responses). One wire can serve many providers and gateways; the adapter owns only wire-shaped concerns.
_Avoid_: provider, API client

**Language model**:
The `LanguageModel` function every wire adapter satisfies: `(context, options?) => Promise<ReadableStream<Event>>`. The universal seam callers program against.
_Avoid_: model instance, provider object

**Part**:
One entry of an assistant message's `content` array (`text`, `reasoning`, `tool-call`). Events address parts by `index`, their position in the finished message.
_Avoid_: block, chunk, content item

**Event**:
The normalized stream vocabulary: `content.start`, `text.delta`, `reasoning.delta`, `tool-call.delta`, `content.end`, `finish`. Wire adapters translate their frames into it.
_Avoid_: chunk, SSE event

**Assembler**:
The internal module (`partAssembler` in `text-primitives`) that owns part bookkeeping — index assignment, delta accumulation, tool-call identity fallback — and the termination invariant. Adapters feed it part-level facts; wire semantics (finish-reason mapping, usage shape) stay in the adapter.

**Terminal event**:
A wire that delivers a terminal signal ends with exactly one `finish` event, emitted when the stream closes; an `error` finish carries the terminating error on its `error` field. A wire stream that ends without a terminal signal is truncated — the stream rejects instead of finishing.
_Avoid_: end-of-stream sentinel

**Collect**:
The consumer-side fold of an event stream: `EventCollectStream` emits the accumulated result per event; `collect(model, context, options?)` resolves the finished result and rejects on `reason: 'error'` or a stream rejection.
_Avoid_: complete, runSync

## Conventions

- Mechanics are shared, semantics are wire-native: index bookkeeping and termination live in the assembler; finish reasons, usage fields, and error payloads keep their wire's shape.
- `tool-call.delta` identifies its part by `index`; its `id` is always the tool **call id**, never a provider item id.
