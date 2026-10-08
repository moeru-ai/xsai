# Cancel a request

Use the model from the [text quick start](https://xsai.js.org/text/quick-start).

Create an `AbortController` before the request.
Pass its signal to the operation:

```ts
import type { LanguageModel } from '@xsai/text'

declare const model: LanguageModel
// ---cut---
import { generateText } from '@xsai/text'

const controller = new AbortController()
const pending = generateText(model, {
  input: 'Write a long story.',
  signal: controller.signal,
})
controller.abort()
try {
  await pending
}
catch (error) {
  console.error(error)
}
```

The adapter forwards cancellation to the HTTP request.
An aborted request rejects with the abort reason.
Pass the same signal to work that a tool starts.

For stream cancellation and result errors, read the [text API reference](https://xsai.js.org/text/api#failure-and-cancellation).
