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

## Send audio

Chat accepts audio in user messages as raw base64 data:

```ts
import type { Message } from '@xsai/text'

declare const audioBytes: Uint8Array
// ---cut---
const message: Message = {
  content: [
    { text: 'What does the speaker say?', type: 'text' },
    { data: audioBytes.toBase64(), format: 'wav', type: 'audio' },
  ],
  role: 'user',
}
```

`format` is `wav` or `mp3`.
Use raw base64 without a `data:` URL prefix.
Audio Parts do not accept URLs, `Blob` values, or live streams.
Messages and Responses reject audio Parts with `invalid-input` before sending a request.

## Parts by role

| Role | Allowed Parts |
| --- | --- |
| `user` | `text`, `image`, `file`, `audio`, `tool-result` |
| `assistant` | `text`, `reasoning`, `refusal`, `tool-call`, `provider` |
| `system`, `developer` | `text` |

The field names of each Part are in the [text API reference](/text/api#parts).
A refusal is its own Part and never appears as `text`.
A `provider` Part keeps content that has no shared form, so you can send it back unchanged.
