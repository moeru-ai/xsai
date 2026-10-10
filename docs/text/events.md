# Text events

A `TextEvent` describes one change in a model response.
Wire adapters translate each provider's stream into these events, so your code reads one format for every service.
`streamText` and `loop` expose the events directly.

A response with one text answer produces this sequence:

```ts
const sequence = [
  { type: 'step.start' },
  { contentType: 'text', index: 0, type: 'content.start' },
  { delta: 'Hel', index: 0, type: 'text.delta' },
  { delta: 'lo.', index: 0, type: 'text.delta' },
  { content: { text: 'Hello.', type: 'text' }, index: 0, type: 'content.end' },
  { message: { content: [{ text: 'Hello.', type: 'text' }], role: 'assistant' }, reason: 'stop', status: 'completed', type: 'step.end' },
]
```

A step is one model request.
Inside it, each Part of the reply starts with `content.start`, grows through `*.delta` events, and ends with `content.end`.
`index` is the position of the Part in the message, so interleaved deltas stay attached to the right Part.
Use the deltas to render output and `content.end` when you need the finished Part.

| Event | Meaning |
| --- | --- |
| `step.start` | A model request begins. |
| `content.start` | A Part begins. Its `contentType` names the kind. |
| `text.delta`, `reasoning.delta`, `refusal.delta` | A fragment of that Part. |
| `tool-call.delta` | A fragment of tool input. `callId` identifies the call. |
| `content.end` | The finished Part. |
| `step.end` | The request ends. It carries the message, `status`, `usage`, and `reason` or `error`. |
| `raw` | The provider event, if you set `includeRawEvents: true`. |

## The terminal event

Each model request ends with exactly one `step.end`, called the terminal event.
Its `status` is `completed`, `incomplete`, `cancelled`, or `failed`.
A failed event carries an `error` and no `reason`.
The other statuses can carry a normalized `reason`.

A stream that ends without `step.end` is truncated, so the operation rejects with `truncated-stream`.
A loop with tools emits one `step.end` for each step, and it also emits `content.start` and `content.end` events for local tool results.
To produce these events yourself, see [Write a custom model](/advanced/custom-models).

## Use event listeners

`TextEventTarget` lets you handle events by name instead of with an `if` chain.
`withEventTarget(target)` returns a transform stream that dispatches each event to the target and passes it on unchanged.

```ts
import type { LanguageModel } from '@xsai/text'

declare const model: LanguageModel
// ---cut---
import { loop, TextEventTarget, withEventTarget } from '@xsai/text'

const target = new TextEventTarget()
target.addEventListener('text.delta', event => process.stdout.write(event.detail.delta))
target.addEventListener('step.end', event => console.log(event.detail.status))

const stream = loop(model, { input: 'Hello.' }).pipeThrough(withEventTarget(target))
for await (const _ of stream) {
  // Reading the stream dispatches the events.
}
```

Listeners run only while something reads the stream.
Creating the transform does not start it.

Each listener gets a `CustomEvent`.
For most events, `detail` holds the event fields without `type`.
For `raw` events, `detail` is the provider value itself.
Use `toCustomEvent(event)` to wrap one event yourself.
