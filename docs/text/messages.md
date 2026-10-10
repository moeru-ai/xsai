# Messages and Parts

`input` accepts a list of messages when a request needs more than one turn, an image, or earlier tool results.
A message has a `role` and a `content`.
`content` is a string or an array of Parts.
A Part is one typed item of content, such as text, an image, or a tool call.

## Continue a conversation

`generateText` does not keep state.
To continue, append the assistant message from `result.message` and your next user message, then send the whole list again.

```ts
import type { LanguageModel, Message } from '@xsai/text'

declare const model: LanguageModel
// ---cut---
import { generateText } from '@xsai/text'

const messages: Message[] = [{ content: 'Pick a color.', role: 'user' }]

const first = await generateText(model, { input: messages })
messages.push(first.message, { content: 'Why that one?', role: 'user' })

const second = await generateText(model, { input: messages })
```

Return the message exactly as you received it.
Adapters store provider metadata on it, and some services need that metadata in later turns.

After a tool loop, `result.message` is only the last step.
Append every step's `message` and, when the step has `toolResults`, a user message that holds them.

## Send images and files

A user message can mix text, image, and file Parts:

```ts
import type { Message } from '@xsai/text'

const message: Message = {
  content: [
    { text: 'What is in this picture?', type: 'text' },
    { data: new URL('https://example.com/cat.png'), detail: 'low', type: 'image' },
  ],
  role: 'user',
}
```

`data` is a URL or a string, such as a base64 data URL.
The adapter decides which Parts the service accepts.

## Parts by role

| Role | Allowed Parts |
| --- | --- |
| `user` | `text`, `image`, `file`, `tool-result` |
| `assistant` | `text`, `reasoning`, `refusal`, `tool-call`, `provider` |
| `system`, `developer` | `text` |

The field names of each Part are in the [text API reference](/text/api#parts).
A refusal is its own Part and never appears as `text`.
A `provider` Part keeps content that has no shared form, so you can send it back unchanged.
