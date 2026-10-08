# Text API reference

Import the operations from `@xsai/text`.
Create a language model with a [wire adapter](https://xsai.js.org/text/adapters).
A language model maps input configuration to a stream of `TextEvent` values.

## Operations

`generateText(model, options)` returns `Promise<CollectResult>`.
It consumes `loop(model, options)` and collects its result.

`streamText(model, options)` returns `{ stream, result }` immediately.
`stream` is a `ReadableStream<TextEvent>`.
`result` is a `Promise<CollectResult>`.
The operation consumes the model stream even if you do not read `stream`.
Handle rejection of `result` when you consume the stream.

`loop(model, options)` returns a `ReadableStream<TextEvent>`.
It runs model requests and executable tools until a stop condition applies.

`collect(stream)` consumes a stream and returns `Promise<CollectResult>`.
It rejects when a step fails or the stream contains no `step.end` event.

## Model configuration

All four operations use the same `LanguageModelOptions` contract.
`loop`, `generateText`, and `streamText` also accept the loop configuration below.

| Field | Contract |
| --- | --- |
| `input` | Required. A string or a mutable `Message[]`. A string becomes one user message in the loop. |
| `instructions` | Optional system instructions for the adapter. |
| `maxOutputTokens` | Optional output token limit. The provider defines its range. |
| `temperature`, `topP` | Optional sampling controls. The provider defines their range and support. |
| `reasoningEffort` | Optional effort string. Common values include `none`, `low`, `medium`, `high`, `xhigh`, and `max`. |
| `tools` | Optional array of tool declarations or executable tools. |
| `toolChoice` | Optional `auto`, `none`, `required`, or `{ name: string }`. |
| `outputFormat` | Optional strict structured-output schema. |
| `includeRawEvents` | Optional boolean. Set `true` to emit provider events as `raw` events. |
| `providerOptions` | Optional adapter-specific configuration. |
| `signal` | Optional `AbortSignal` for cancellation. |

Omitted fields have no shared sampling or token default.
The adapter or provider supplies those defaults.
Schemas accept JSON Schema or a value with native Standard JSON Schema support.
The native schema must expose `~standard.jsonSchema.input`.
If it also exposes `~standard.validate`, the tool loop uses that validator.
A Standard Schema without native JSON Schema support needs conversion before you pass it to this API.
`ResolvedSchema` stores the resolved `schema` and an optional `validate` function.
A raw JSON Schema has no runtime validator.

## Messages and Parts

A Part is one typed item of message content.
A message has a `role` and `content`.

| Role | Content |
| --- | --- |
| `user` | A string or an array of text, image, file, and tool-result Parts. |
| `assistant` | A string or an array of text, reasoning, refusal, tool-call, and provider Parts. |
| `system`, `developer` | A string or an array of text Parts. |

Text Parts use `{ type: 'text', text }`.
Image and file Parts use `data: string | URL`.
Image Parts also accept optional `detail: 'auto' | 'high' | 'low'`.
Tool-call Parts require `arguments: string`, `callId`, `id`, and `name`.
Tool-result Parts require `callId` and `output`, with optional `isError`.
`output` is a string or an array of text and image Parts.
Reasoning Parts contain an array of `{ type, text }` items.
Their item types are `text`, `summary`, `encrypted`, and `redacted`.
Reasoning Parts also accept `id` and `providerMetadata`.
Refusal Parts contain `refusal: string`.
Provider Parts contain `source: string` and `value: unknown`.
Provider Parts preserve content that has no shared representation.
The adapter defines which Parts the endpoint accepts.
Reuse returned assistant messages when you need provider metadata in later turns.

## Loop configuration

| Field | Contract |
| --- | --- |
| `stopWhen` | A predicate over completed steps. The default is `maxSteps(10)`. |
| `prepareStep` | Optional callback before a request. It can replace the model, input, and request configuration. |
| `preToolCall` | Optional hook before local tool execution. |
| `postToolCall` | Optional hook after local tool execution. |

`maxSteps(n)` stops after at least `n` steps.
`hasToolCall(name?)` stops when the latest step contains a matching tool call.
Without a name, it matches any tool call.
`and(...conditions)`, `or(...conditions)`, and `not(condition)` combine predicates.
`stepCountAtLeast` is a deprecated alias of `maxSteps`.

A step is one model request.
The loop stops on a failed or cancelled step.
It also stops when the stop predicate matches.
Without tool calls, it stops unless the finish reason is `pause_turn`.
If it continues, it executes local tools and appends their results before the next request.

## Results

`CollectResult` contains the final `StepResult`, `steps`, and optional `totalUsage`.
`steps` contains the collected results from all nonfailed steps.
`totalUsage` sums the usage fields that the provider reports.
Missing usage does not imply zero provider cost.
`Usage` requires `inputTokens`, `outputTokens`, and `totalTokens` when it is present.
It can also contain `reasoningTokens`, `cacheReadInputTokens`, and `cacheCreationInputTokens`.
A finish reason can be `stop`, `length`, `tool-calls`, `content-filter`, `refusal`, or another provider string.
`MessageProviderMetadata` and `PartProviderMetadata` are extensible interfaces for adapter metadata.

A `StepResult` contains `message`, `status`, optional `reason`, optional `usage`, `text`, `toolCalls`, and `toolResults`.
`text` concatenates text Parts from that step.
Reasoning and refusal content remain in `message.content`.
`toolResults` contains local tool results emitted after the step.
Use `steps` when you need output from earlier requests.

## Tools

`tool({ name, inputSchema, description?, outputSchema?, execute? })` resolves schemas and returns a tool.
Without `execute`, it returns a declaration for an external tool.
With `execute`, it returns an `ExecutableTool` for the loop.

`execute(input, options?)` receives validated input when the schema has a validator.
`options.signal` carries cancellation.
Without `outputSchema`, return a string or an array of tool-result content items.
With `outputSchema`, return a value that matches the schema input type.
The tool serializes this value as JSON. It does not validate the output at runtime.

## Failure and cancellation

HTTP failures throw `HttpError`.
Transport failures throw `XSAIError` with code `network-error`.
Invalid provider data can produce `invalid-response`.
A missing terminal event produces `truncated-stream`.
Multiple terminal events in one model request produce `protocol-error`.

A failed `step.end` rejects `generateText` and the `streamText` result promise.
The event stream can close normally after that failure event.
A thrown stream error rejects the result promise and errors the output stream.
Cancelling the output stream cancels its reader and rejects the result promise.
Pass `signal` to cancel the underlying request as well.
A provider-reported `cancelled` step is a result status, not a thrown transport error.
