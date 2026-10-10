# Stream text {#text}

Read assistant text as the provider sends it.

This page describes the v0 API from `v0.5.1`.
Use v0 package builds with these examples.
Make sure that the service accepts the model ID and request protocol shown below.

```sh
npm i @xsai/stream-text@0.5.1
```

## Examples

### Basic

```ts
const { textStream } = streamText({
  apiKey: env.OPENAI_API_KEY!,
  baseURL: 'https://api.openai.com/v1/',
  messages: [
    {
      content: 'You are a helpful assistant.',
      role: 'system',
    },
    {
      content: 'This is a test, so please answer'
        + '\'The quick brown fox jumps over the lazy dog.\''
        + 'and nothing else.',
      role: 'user',
    },
  ],
  model: 'gpt-4o',
})

const text: string[] = []

for await (const textPart of textStream) {
  text.push(textPart)
}

// "The quick brown fox jumps over the lazy dog."
console.log(text)
```

### Streams and events

`streamText()` exposes these streams:

- `textStream`: text deltas only
- `reasoningTextStream`: reasoning deltas only, when the model emits them
- `eventStream`: normalized xsAI events
- `fullStream`: parsed chat completion chunks from the provider

`eventStream` emits events for each step. Depending on the response, a step can include:

- `step.start` and `step.done` (with optional usage on `step.done`)
- `reasoning.start`, `reasoning.delta`, and `reasoning.done`
- `text.start`, `text.delta`, and `text.done`
- `tool-call.start`, `tool-call.delta`, and `tool-call.done`
- `tool-result.done`

Event names use dot notation.
Use `eventStream` for shared text, reasoning, and tool events.
Use `fullStream` for the original provider chunks.

```ts
const { eventStream, fullStream } = streamText({
  apiKey: env.OPENAI_API_KEY!,
  baseURL: 'https://api.openai.com/v1/',
  messages: [{
    content: 'Tell me a short joke.',
    role: 'user',
  }],
  model: 'gpt-4o',
})

for await (const event of eventStream) {
  if (event.type === 'text.delta')
    console.log(event.delta)

  if (event.type === 'step.done')
    console.log('step usage:', event.usage)
}

for await (const chunk of fullStream) {
  console.log(chunk.object)
}
```

### Image input

Make sure that the model accepts the image or audio input before you send it. xsAI does not detect this capability.

```ts
const { textStream } = streamText({
  apiKey: env.OPENAI_API_KEY!,
  baseURL: 'https://api.openai.com/v1/',
  messages: [{
    content: [
      { text: 'What\'s in this image?', type: 'text' },
      { // [!code highlight]
        image_url: { // [!code highlight]
          url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg', // [!code highlight]
        }, // [!code highlight]
        type: 'image_url', // [!code highlight]
      }, // [!code highlight]
    ],
    role: 'user',
  }],
  model: 'gpt-4o',
})
```

### Audio input

Make sure that the model accepts the image or audio input before you send it. xsAI does not detect this capability.

```ts
const data = await fetch('https://cdn.openai.com/API/docs/audio/alloy.wav')
  .then(res => res.arrayBuffer())
  .then(buffer => Buffer.from(buffer).toString('base64'))

const { textStream } = streamText({
  apiKey: env.OPENAI_API_KEY!,
  baseURL: 'https://api.openai.com/v1/',
  messages: [{
    content: [
      { text: 'What is in this recording?', type: 'text' },
      { input_audio: { data, format: 'wav' }, type: 'input_audio' } // [!code highlight]
    ],
    role: 'user',
  }],
  modalities: ['text', 'audio'], // [!code highlight]
  model: 'gpt-4o-audio-preview', // [!code highlight]
})
```

## Result

The basic example collects text fragments in an array and prints that array.
