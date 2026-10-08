# Stream text

A `TextEvent` describes one change in a model response.
Use `streamText` when you need both incremental events and a collected result.
Use `loop` when you want to consume events directly.

Use the `model` from the [text quick start](https://xsai.js.org/text/quick-start).
Read each text delta:

```ts
import { streamText } from '@xsai/text'

const { result, stream } = streamText(model, { input: 'Describe a quiet forest.' })
const settled = result.then(
  value => ({ value }),
  error => ({ error }),
)

try {
  for await (const event of stream) {
    if (event.type === 'text.delta')
      process.stdout.write(event.delta)
  }
}
finally {
  const outcome = await settled
  if ('error' in outcome)
    console.error(outcome.error)
}
```

The program prints text as it arrives.
It also reports result failures when the event stream closes normally.

For event fields and terminal status, read the [text event reference](https://xsai.js.org/text/events).
For cancellation, read [Cancel a request](https://xsai.js.org/text/cancellation).
