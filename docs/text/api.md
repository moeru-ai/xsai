# Text API

Import these exports from `@xsai/text`.
Create a language model with a [wire adapter](/text/adapters).

## Operations

```ts:no-twoslash
generateText(model: LanguageModel, options: StreamTextOptions): Promise<CollectResult>
streamText(model: LanguageModel, options: StreamTextOptions): ReadableStream<TextEvent>
collect(stream: ReadableStream<TextEvent>): Promise<CollectResult>
```

`streamText` runs model requests and executable tools as the consumer reads.
It stops when a stop condition applies.
Without a consumer, it does not start the model.
`generateText` is `collect(streamText(...))`.
`collect` consumes the entire stream and rejects when a step fails or the stream is truncated.

## Options

`streamText` and `generateText` take `StreamTextOptions`, which extends `LanguageModelOptions` with [tool loop options](#tool-loop-options).
`collect` takes only a stream.

| Field | Description |
| --- | --- |
| `input` | Required. A string, which becomes one user message, or a `Message[]`. |
| `instructions` | System instructions. |
| `maxOutputTokens` | The output token limit. The provider defines the range. |
| `temperature`, `topP` | Sampling controls. The provider defines the range and the support. |
| `reasoningEffort` | A string. Common values are `none`, `low`, `medium`, `high`, `xhigh`, and `max`. |
| `tools` | An array of tools from `tool()`. |
| `toolChoice` | `auto`, `none`, `required`, or `{ name: string }`. |
| `outputFormat` | A strict schema for [structured output](/text/structured-output). |
| `includeRawEvents` | If `true`, the stream also emits `raw` events with the provider events. |
| `providerOptions` | Adapter-specific options, by [namespace](/text/adapters#provider-options). |
| `signal` | An `AbortSignal`. |

xsAI sets no default for sampling or token fields.
The adapter or the provider supplies them.

A schema is a JSON Schema, or a value that exposes `~standard.jsonSchema.input`.
If it also exposes `~standard.validate`, the loop uses it to validate tool input.
A raw JSON Schema has no validator.
A Standard Schema without JSON Schema support must go through [xsschema](/xsschema) first.

## Tool loop options

| Field | Description |
| --- | --- |
| `stopWhen` | A function of the completed steps. Defaults to `maxSteps(10)`. |
| `prepareStep` | Runs before each request and can override the model, the input, and the request options. |
| `preToolCall` | Runs before a local tool. |
| `postToolCall` | Runs after a local tool. |

A step is one model request.
The loop stops after a `failed` or `cancelled` step.
It also stops when `stopWhen` returns `true`, or when a step has no tool calls and its reason is not `pause_turn`.
Otherwise, it runs the local tools, appends their results as a user message, and sends the next request.

`maxSteps(n)` stops once at least `n` steps have run.
`hasToolCall(name?)` stops when the last step has a matching tool call, or any tool call without a name.
`and`, `or`, and `not` combine conditions.
Details of the hooks are in [Control the tool loop](/text/tools#control-the-loop).

## Result

`CollectResult` is the `StepResult` of the last step plus `steps` and an optional `totalUsage`.

| Field | Description |
| --- | --- |
| `message` | The assistant message of the step. |
| `status` | `completed`, `incomplete`, or `cancelled`. |
| `reason` | A finish reason: `stop`, `length`, `tool-calls`, `content-filter`, `refusal`, or another provider string. |
| `usage` | Optional `Usage` for the step. |
| `text` | The text Parts of the step, joined. Reasoning and refusals stay in `message.content`. |
| `toolCalls` | The tool calls of the step. |
| `toolResults` | The local tool results that followed the step. |
| `steps` | The results of all steps that did not fail. |
| `totalUsage` | `usage` summed over the steps. Absent when no step reports usage. |

`Usage` has `inputTokens`, `outputTokens`, and `totalTokens`, and it can have `reasoningTokens`, `cacheReadInputTokens`, and `cacheCreationInputTokens`.

## Messages

| Role | Content |
| --- | --- |
| `user` | A string, or an array of `text`, `image`, `file`, and `tool-result` Parts. |
| `assistant` | A string, or an array of `text`, `reasoning`, `refusal`, `tool-call`, and `provider` Parts. |
| `system`, `developer` | A string, or an array of `text` Parts. |

An assistant message can also have an `id` and `providerMetadata`.
`MessageProviderMetadata` and `PartProviderMetadata` are interfaces that adapters extend.

## Parts

| Part | Fields |
| --- | --- |
| `text` | `text`, optional `providerMetadata`. |
| `image` | `data: string \| URL`, optional `detail: 'auto' \| 'high' \| 'low'`. |
| `file` | `data: string \| URL`. |
| `tool-call` | `arguments: string`, `callId`, `id`, `name`. |
| `tool-result` | `callId`, `output`, optional `isError`. `output` is a string or an array of `text` and `image` Parts. |
| `reasoning` | `content`, an array of `{ type, text }` where `type` is `text`, `summary`, `encrypted`, or `redacted`. Optional `id` and `providerMetadata`. |
| `refusal` | `refusal: string`. |
| `provider` | `source: string`, `value: unknown`. Holds content that has no shared form. |

## Tools

```ts:no-twoslash
tool({ name, inputSchema, description?, outputSchema?, execute? })
```

Without `execute`, `tool()` returns a declaration.
With `execute`, it returns an `ExecutableTool` that the loop can run.

`execute(input, { signal })` receives validated input when the schema has a validator.
Without `outputSchema`, it returns a string or an array of tool-result content.
With `outputSchema`, it returns a value of that schema's type, which the tool serializes as JSON.
xsAI does not validate the output at runtime.

## Events

See [Text events](/text/events) for the event types.
`TextEventTarget`, `toCustomEvent`, and `withEventTarget` are covered in [Use event listeners](/text/events#use-event-listeners).

## Errors

| Code | Cause |
| --- | --- |
| `http-error` | An HTTP error status. Thrown as `HttpError`. |
| `network-error` | `fetch` rejected. |
| `invalid-input` | The adapter cannot accept the options. |
| `invalid-response` | The provider data is not valid. |
| `truncated-stream` | The stream ended without `step.end`. |
| `model-error` | The adapter reports a model failure. |
| `protocol-error` | One request emitted several terminal events. |

A `failed` `step.end` rejects `collect` and `generateText`.
The event stream can close normally after a failed event.
If you read events directly, inspect the status of each `step.end`.
A thrown stream error also rejects `collect` and `generateText`.
Cancel the output stream to stop the run.
A `cancelled` step from the provider is a status and does not throw.
