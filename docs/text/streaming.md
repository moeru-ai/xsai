# Stream text

`streamText(model, options)` returns right away with two values.
`stream` is a `ReadableStream` of [`TextEvent`](/text/events) values, and `result` is a promise for the same result that `generateText` returns.

```ts
import type { LanguageModel } from '@xsai/text'

declare const model: LanguageModel
// ---cut---
import { streamText } from '@xsai/text'

const { result, stream } = streamText(model, { input: 'Describe a quiet forest.' })

for await (const event of stream) {
  if (event.type === 'text.delta')
    process.stdout.write(event.delta)
}

const { totalUsage } = await result
```

A `text.delta` event carries a fragment of text.
Other events describe reasoning, refusals, tool calls, and the end of each step.

## Handle failures

A failed request ends the stream normally and rejects `result`.
This means that a `for await` loop alone cannot tell you about the failure.
Always await `result`, or attach a handler to it, even when you only read the stream.

If you do not need the stream, call `generateText` instead.
If you need events without a result, call `loop(model, options)`, which returns only the stream.

## Stop early

Pass an `AbortSignal` as `signal` to stop the request.
[Cancel a request](/text/generating#cancel-a-request) shows the details.
