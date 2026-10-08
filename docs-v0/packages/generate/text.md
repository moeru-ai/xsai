# Generate text {#text}

Send chat messages and collect the final assistant text.

This page describes the v0 API from `v0.5.1`.
Use v0 package builds with these examples.
Make sure that the service accepts the model ID and request protocol shown below.

```sh
npm i @xsai/generate-text@0.5.1
```

## Examples

### Basic

```ts
const { text } = await generateText({
  apiKey: env.OPENAI_API_KEY!,
  baseURL: 'https://api.openai.com/v1/',
  messages: [
    {
      content: 'You\'re a helpful assistant.',
      role: 'system'
    },
    {
      content: 'Why is the sky blue?',
      role: 'user'
    }
  ],
  model: 'gpt-4o',
})
```

### Usage

`usage` contains token usage for the final step.
`totalUsage` sums token usage across all steps, including requests after tool calls.

```ts
const { text, totalUsage, usage } = await generateText({
  apiKey: env.OPENAI_API_KEY!,
  baseURL: 'https://api.openai.com/v1/',
  messages: [{
    content: 'Why is the sky blue?',
    role: 'user',
  }],
  model: 'gpt-4o',
})

console.log(text)
console.log(usage)
console.log(totalUsage)
```

### Image input

Make sure that the model accepts the image or audio input before you send it. xsAI does not detect this capability.

```ts
const { text } = await generateText({
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

const { text } = await generateText({
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

The basic example prints the requested sentence. Model output can vary.
