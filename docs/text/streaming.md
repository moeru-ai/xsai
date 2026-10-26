# Stream text

`streamText(model, options)` returns a `ReadableStream` of [`TextEvent`](/text/events) values.
The model starts when you read the stream.
If you pause, the SDK stops reading after the pipeline buffers fill.

```ts
import type { LanguageModel } from '@xsai/text'

declare const model: LanguageModel
// ---cut---
import { streamText } from '@xsai/text'

const stream = streamText(model, { input: 'Describe a quiet forest.' })

for await (const event of stream) {
  if (event.type === 'text.delta')
    process.stdout.write(event.delta)
  if (event.type === 'step.end' && event.status === 'failed')
    throw event.error
}
```

Read the entire stream to finish all tool steps.

## Process events and collect the result

To process events asynchronously and get a final result, place an async transform before `collect`:

```ts
import type { LanguageModel, TextEvent } from '@xsai/text'

declare const model: LanguageModel
// ---cut---
import { collect, streamText } from '@xsai/text'

declare const handleEvent: (event: TextEvent) => Promise<void>

const result = await collect(
  streamText(model, { input: 'Describe a quiet forest.' }).pipeThrough(
    new TransformStream<TextEvent, TextEvent>({
      transform: async (event, controller) => {
        await handleEvent(event)
        controller.enqueue(event)
      },
    }),
  ),
)

console.log(result.text, result.totalUsage)
```

`collect` returns after all handlers finish and the stream closes.
It rejects if a handler throws, a model step fails, or the stream reports an [error](/text/api#errors).

## Stop early

Cancel the stream to stop the request.
A default `for await` loop also cancels the stream when you exit early.
If you hold a reader, call `reader.cancel(reason)`.

You can also [abort the request](/text/generating#cancel-a-request).
If you pause, the stream can report the abort when you read again.
