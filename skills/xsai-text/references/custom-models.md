# Supply a custom language model

A custom model follows the same event contract as an HTTP adapter.
This model returns a fixed answer without a service:

```ts
import type { LanguageModel, TextEvent } from '@xsai/text'

import { generateText } from '@xsai/text'

const model: LanguageModel = () => new ReadableStream<TextEvent>({
  start: (controller) => {
    controller.enqueue({ type: 'step.start' })
    controller.enqueue({ contentType: 'text', index: 0, type: 'content.start' })
    controller.enqueue({ delta: 'Hello.', index: 0, type: 'text.delta' })
    controller.enqueue({ content: { text: 'Hello.', type: 'text' }, index: 0, type: 'content.end' })
    controller.enqueue({
      message: { content: [{ text: 'Hello.', type: 'text' }], role: 'assistant' },
      reason: 'stop',
      status: 'completed',
      type: 'step.end',
    })
    controller.close()
  },
})

console.log((await generateText(model, { input: 'Hello.' })).text)
```

The program prints `Hello.`.
A custom model must handle its input and cancellation signal when it performs asynchronous work.
Keep one terminal event per request, including requests that end without text.

For the event contract, read the [text event reference](https://xsai.js.org/text/events).
