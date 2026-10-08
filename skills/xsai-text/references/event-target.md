# Use event listeners

Use the model from the [text quick start](https://xsai.js.org/text/quick-start).

`TextEventTarget` provides typed listeners for `TextEvent` event names.
`toCustomEvent(event)` wraps a text event in a `CustomEvent`.
For a `raw` event, its `detail` is the provider value directly.
For other events, `detail` contains the event fields without `type`.

`withEventTarget(target)` returns a transform stream.
Pipe a text stream through it to dispatch events and preserve the stream values:

```ts
import type { LanguageModel } from '@xsai/text'

declare const model: LanguageModel
// ---cut---
import { loop, TextEventTarget, withEventTarget } from '@xsai/text'

const target = new TextEventTarget()
target.addEventListener('text.delta', event => console.log(event.detail.delta))
const stream = loop(model, { input: 'Hello.' }).pipeThrough(withEventTarget(target))
for await (const event of stream) {
  if (event.type === 'step.end')
    console.log(event.status)
}
```

Use a runtime that provides `CustomEvent` for these helpers.
Consuming the stream causes dispatch. Creating the transform alone does not consume it.

For the event contract, read the [text event reference](https://xsai.js.org/text/events).
