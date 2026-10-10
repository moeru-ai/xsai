# Generate text

`generateText(model, options)` sends a request and returns when the model finishes.
Use it when you need the whole reply before your code continues.
To show output while it arrives, use [`streamText`](/text/streaming).

```ts
import type { LanguageModel } from '@xsai/text'

declare const model: LanguageModel
// ---cut---
import { generateText } from '@xsai/text'

const result = await generateText(model, {
  input: 'Name three uses for a paperclip.',
  instructions: 'Answer in one short sentence per item.',
  maxOutputTokens: 200,
  temperature: 0.2,
})

console.log(result.text)
```

`input` is a string or a list of [messages](/text/messages).
`instructions` sets the system prompt.
xsAI sets no defaults for `temperature`, `topP`, or `maxOutputTokens`, so the service applies its own when you omit them.
The full list of options is in the [text API reference](/text/api#options).

## Read the result

`result` describes the last model request, and it adds the history of earlier ones.

| Field | Value |
| --- | --- |
| `text` | The text of the last step. |
| `status` | `completed`, `incomplete`, or `cancelled`. A `failed` step throws instead. |
| `reason` | The finish reason, such as `stop` or `length`. |
| `message` | The assistant message, including reasoning and tool calls. |
| `steps` | One result per model request. Tool use creates more than one step. |
| `totalUsage` | Token counts summed over all steps, if the service reports them. |

An `incomplete` status means that the service stopped before the answer was finished.
Check `reason` to see why.
For example, `length` means that the output hit `maxOutputTokens`.

A missing `totalUsage` does not mean that the request was free.
It means that the service did not report usage.

## Cancel a request

Pass an `AbortSignal` as `signal` to any text operation.
The adapter forwards it to the HTTP request, and an aborted request rejects with the abort reason.

```ts
import type { LanguageModel } from '@xsai/text'

declare const model: LanguageModel
// ---cut---
import { generateText } from '@xsai/text'

const controller = new AbortController()
const timer = setTimeout(() => controller.abort(), 5_000)

try {
  await generateText(model, {
    input: 'Write a long story.',
    signal: controller.signal,
  })
}
catch (error) {
  if (controller.signal.aborted)
    console.log('Cancelled.')
  else
    throw error
}
finally {
  clearTimeout(timer)
}
```

The loop passes the same signal to `execute`, so a tool can stop its own work.

### Streams

Cancelling the output stream of `streamText` cancels its reader and rejects `result`.
Pass `signal` as well to cancel the underlying HTTP request.

A step that the provider reports as `cancelled` is a result status.
It does not throw.
